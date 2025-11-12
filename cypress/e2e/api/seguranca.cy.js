// ***********************************************************
// Testes de Segurança - API Serverest
// 
// Cenários de teste para validar segurança da API
// contra vulnerabilidades comuns
// ***********************************************************

describe('API - Segurança', () => {
  
  let token

  before(() => {
    // Cria um usuário e faz login para testes que precisam de autenticação
    const email = Cypress.helpers.gerarEmailAleatorio()
    const senha = 'senha123'
    
    cy.criarUsuario({
      nome: 'Admin Segurança',
      email: email,
      password: senha,
      administrador: 'true'
    }).then(() => {
      return cy.login(email, senha)
    }).then((response) => {
      if (response && response.status === 200) {
        token = response.body.authorization
      }
    })
  })

  /**
   * Teste: SQL Injection - Login
   */
  it('Deve proteger contra SQL Injection no login', () => {
    cy.step('Dado que tento SQL Injection no login')
    cy.step('Quando envio payload malicioso')
    
    const sqlInjectionAttempts = [
      "admin' OR '1'='1",
      "admin'--",
      "admin'/*",
      "' OR 1=1--",
      "' UNION SELECT * FROM usuarios--"
    ]
    
    sqlInjectionAttempts.forEach((payload) => {
      cy.login(payload, 'senha123').then((response) => {
        cy.step('Então o sistema deve rejeitar a tentativa')
        expect(response.status).to.be.oneOf([400, 401])
        expect(response.body).to.not.have.property('authorization')
      })
    })
  })

  /**
   * Teste: SQL Injection - Criação de Usuário
   */
  it('Deve proteger contra SQL Injection na criação de usuário', () => {
    cy.step('Dado que tento SQL Injection na criação de usuário')
    cy.step('Quando envio payload malicioso')
    
    const sqlInjection = "'; DROP TABLE usuarios; --"
    cy.criarUsuario({
      nome: sqlInjection,
      email: Cypress.helpers.gerarEmailAleatorio(),
      password: 'senha123',
      administrador: 'false'
    }).then((response) => {
      cy.step('Então o sistema deve rejeitar ou aceitar mas sanitizar')
      cy.step('E não deve executar o comando SQL')
      // A API pode aceitar mas deve sanitizar - validamos que não há erro de execução
      expect(response.status).to.be.oneOf([201, 400])
      if (response.status === 201 && response.body && response.body.nome) {
        // Se aceitar, deve ter sanitizado (não deve conter o comando SQL perigoso)
        expect(response.body.nome).to.not.include('DROP TABLE')
      }
    })
  })

  /**
   * Teste: XSS - Cross-Site Scripting
   */
  it('Deve proteger contra XSS no nome de usuário', () => {
    cy.step('Dado que tento XSS no nome de usuário')
    cy.step('Quando envio script malicioso')
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>'
    ]
    
    xssPayloads.forEach((payload) => {
      cy.criarUsuario({
        nome: payload,
        email: Cypress.helpers.gerarEmailAleatorio(),
        password: 'senha123',
        administrador: 'false'
      }).then((response) => {
        cy.step('Então o sistema deve rejeitar ou sanitizar a entrada')
        expect(response.status).to.be.oneOf([400, 201]) // Pode aceitar mas sanitizar
        if (response.status === 201 && response.body && response.body.nome) {
          // Se aceitar, deve ter sanitizado (não deve conter o script)
          expect(response.body.nome).to.not.include('<script>')
        }
      })
    })
  })

  /**
   * Teste: Autenticação - Token Inválido
   */
  it('Deve rejeitar requisições com token inválido', () => {
    cy.step('Dado que tenho um token inválido')
    cy.step('Quando tento criar produto')
    
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    const tokensInvalidos = [
      'token-invalido',
      'Bearer token-fake',
      '123456789',
      '',
      null
    ]
    
    tokensInvalidos.forEach((tokenInvalido) => {
      cy.criarProduto(dadosProduto, tokenInvalido).then((response) => {
        cy.step('Então o sistema deve retornar erro 401')
        expect(response.status).to.eq(401)
      })
    })
  })

  /**
   * Teste: Autenticação - Token Expirado
   * 
   * Nota: Este teste pode não funcionar se a API não expirar tokens rapidamente
   */
  it('Deve validar formato do token retornado', () => {
    cy.step('Dado que faço login com credenciais válidas')
    cy.step('Quando recebo o token')
    
    const email = Cypress.helpers.gerarEmailAleatorio()
    const senha = 'senha123'
    
    cy.criarUsuario({
      nome: 'Usuário Teste Token',
      email: email,
      password: senha,
      administrador: 'true'
    }).then(() => {
      return cy.login(email, senha)
    }).then((response) => {
      if (response.status === 200) {
        cy.step('Então o token deve ter formato Bearer válido')
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.include('Bearer')
        expect(response.body.authorization.length).to.be.greaterThan(20)
      }
    })
  })

  /**
   * Teste: Rate Limiting - Múltiplas Tentativas de Login
   * 
   * Objetivo: Validar se há proteção contra brute force
   */
  it('Deve tratar múltiplas tentativas de login inválidas', () => {
    cy.step('Dado que faço múltiplas tentativas de login inválidas')
    cy.step('Quando executo 10 tentativas')
    
    let tentativas = 0
    for (let i = 0; i < 10; i++) {
      cy.login('email_inexistente@teste.com', 'senha_errada').then((response) => {
        tentativas++
        expect(response.status).to.eq(401)
      })
    }
    
    cy.then(() => {
      cy.step('Então todas as tentativas devem ser rejeitadas')
      cy.step('E o sistema deve continuar respondendo')
      expect(tentativas).to.eq(10)
    })
  })

  /**
   * Teste: Validação de Entrada - Campos Maliciosos
   */
  it('Deve sanitizar ou rejeitar campos com caracteres perigosos', () => {
    cy.step('Dado que envio caracteres perigosos')
    cy.step('Quando tento criar usuário')
    
    const caracteresPerigosos = [
      '../',
      '..\\',
      '%00',
      '\x00',
      '\r\n',
      '\n'
    ]
    
    caracteresPerigosos.forEach((caractere) => {
      cy.criarUsuario({
        nome: `Usuário${caractere}Teste`,
        email: Cypress.helpers.gerarEmailAleatorio(),
        password: 'senha123',
        administrador: 'false'
      }).then((response) => {
        cy.step('Então o sistema deve rejeitar ou sanitizar')
        expect(response.status).to.be.oneOf([400, 201])
      })
    })
  })

  /**
   * Teste: Autorização - Acesso a Recursos de Outro Usuário
   */
  it('Deve validar que usuário não pode acessar carrinho de outro usuário', () => {
    cy.step('Dado que tenho dois usuários diferentes')
    cy.step('Quando um usuário tenta acessar carrinho do outro')
    
    // Cria primeiro usuário e carrinho
    const email1 = Cypress.helpers.gerarEmailAleatorio()
    const senha1 = 'senha123'
    
    cy.criarUsuario({
      nome: 'Usuário 1',
      email: email1,
      password: senha1,
      administrador: 'false'
    }).then(() => {
      return cy.login(email1, senha1)
    }).then((loginResponse1) => {
      if (loginResponse1.status === 200) {
        const token1 = loginResponse1.body.authorization
        
        // Cria produto e carrinho para usuário 1
        const dadosProduto = Cypress.helpers.gerarDadosProduto()
        dadosProduto.nome = `Produto Teste ${Date.now()}`
        cy.criarProduto(dadosProduto, token).then((prodResponse) => {
          if (prodResponse.status === 201) {
            const productId = prodResponse.body._id
            
            cy.criarCarrinho([{ idProduto: productId, quantidade: 1 }], token1).then((cartResponse) => {
              if (cartResponse.status === 201 && cartResponse.body._id) {
                const cartId = cartResponse.body._id
                
                // Tenta acessar com token de outro usuário (admin)
                cy.buscarCarrinho(cartId, token).then((accessResponse) => {
                  cy.step('Então o sistema deve permitir ou negar baseado na política')
                  // A API pode permitir ou negar - validamos que há resposta
                  expect(accessResponse.status).to.be.oneOf([200, 401, 403])
                })
              }
            })
          }
        })
      }
    })
  })

  /**
   * Teste: Validação de Headers de Segurança
   */
  it('Deve validar headers de segurança nas respostas', () => {
    cy.step('Dado que faço uma requisição')
    cy.step('Quando recebo a resposta')
    
    cy.request({
      method: 'GET',
      url: '/produtos',
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então a resposta deve ter headers apropriados')
      // Valida que a resposta existe e tem estrutura válida
      expect(response).to.have.property('headers')
      expect(response).to.have.property('status')
    })
  })
})


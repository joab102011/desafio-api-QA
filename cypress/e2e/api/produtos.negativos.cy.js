// ***********************************************************
// Testes Negativos - Funcionalidade: Produtos
// 
// Cenários de teste negativo para validar tratamento de erros
// e validações de dados
// ***********************************************************

describe('API - Produtos - Testes Negativos', () => {
  
  let token
  let productId

  before(() => {
    // Cria um usuário administrador e faz login
    const email = Cypress.helpers.gerarEmailAleatorio()
    const senha = 'senha123'
    
    cy.criarUsuario({
      nome: 'Admin Teste Produtos Negativo',
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
   * Teste: Validação de preço
   */
  it('Deve rejeitar criação de produto com preço negativo', () => {
    cy.step('Dado que tenho um preço negativo')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.preco = -100
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com preço zero', () => {
    cy.step('Dado que tenho um preço zero')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.preco = 0
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com preço como string', () => {
    cy.step('Dado que envio preço como string')
    cy.step('Quando tento criar produto')
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        authorization: token
      },
      body: {
        nome: 'Produto Teste',
        preco: 'cem reais', // String ao invés de número
        descricao: 'Descrição do produto',
        quantidade: 10
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      expect(response.status).to.eq(400)
    })
  })

  it('Deve rejeitar criação de produto com preço null', () => {
    cy.step('Dado que envio preço como null')
    cy.step('Quando tento criar produto')
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        authorization: token
      },
      body: {
        nome: 'Produto Teste',
        preco: null,
        descricao: 'Descrição do produto',
        quantidade: 10
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      expect(response.status).to.eq(400)
    })
  })

  /**
   * Teste: Validação de quantidade
   */
  it('Deve rejeitar criação de produto com quantidade negativa', () => {
    cy.step('Dado que tenho uma quantidade negativa')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.quantidade = -10
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com quantidade zero', () => {
    cy.step('Dado que tenho uma quantidade zero')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.quantidade = 0
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com quantidade como string', () => {
    cy.step('Dado que envio quantidade como string')
    cy.step('Quando tento criar produto')
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        authorization: token
      },
      body: {
        nome: 'Produto Teste',
        preco: 100,
        descricao: 'Descrição do produto',
        quantidade: 'dez' // String ao invés de número
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      expect(response.status).to.eq(400)
    })
  })

  /**
   * Teste: Validação de nome
   */
  it('Deve rejeitar criação de produto com nome vazio (apenas espaços)', () => {
    cy.step('Dado que tenho um nome apenas com espaços')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.nome = '   '
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com nome muito longo', () => {
    cy.step('Dado que tenho um nome com mais de 200 caracteres')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.nome = 'a'.repeat(300)
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  /**
   * Teste: Validação de descrição
   */
  it('Deve rejeitar criação de produto com descrição vazia', () => {
    cy.step('Dado que tenho uma descrição vazia')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.descricao = ''
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com descrição muito longa', () => {
    cy.step('Dado que tenho uma descrição com mais de 1000 caracteres')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.descricao = 'a'.repeat(2000)
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  /**
   * Teste: Segurança - SQL Injection
   */
  it('Deve rejeitar criação de produto com SQL Injection no nome', () => {
    cy.step('Dado que tento SQL Injection no campo nome')
    cy.step('Quando envio payload malicioso')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.nome = "'; DROP TABLE produtos; --"
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.step('E não deve executar o comando SQL')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve rejeitar criação de produto com SQL Injection na descrição', () => {
    cy.step('Dado que tento SQL Injection no campo descrição')
    cy.step('Quando envio payload malicioso')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.descricao = "'; DROP TABLE produtos; --"
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.step('E não deve executar o comando SQL')
      cy.validarRespostaErro(response, 400)
    })
  })

  /**
   * Teste: Segurança - XSS
   */
  it('Deve rejeitar criação de produto com XSS no nome', () => {
    cy.step('Dado que tento XSS no campo nome')
    cy.step('Quando envio script malicioso')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.nome = '<script>alert("XSS")</script>'
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.step('E não deve executar o script')
      cy.validarRespostaErro(response, 400)
    })
  })

  /**
   * Teste: Autorização
   */
  it('Deve rejeitar criação de produto com token inválido', () => {
    cy.step('Dado que tenho um token inválido')
    cy.step('Quando tento criar produto')
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    cy.criarProduto(dadosProduto, 'token-invalido-123').then((response) => {
      cy.step('Então o sistema deve retornar erro 401')
      cy.validarRespostaErro(response, 401)
    })
  })

  it('Deve rejeitar atualização de produto sem token', () => {
    cy.step('Dado que não tenho token de autenticação')
    cy.step('Quando tento atualizar produto')
    // Primeiro cria um produto
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.nome = `Produto Teste ${Date.now()}`
    cy.criarProduto(dadosProduto, token).then((createResponse) => {
      if (createResponse.status === 201) {
        productId = createResponse.body._id
        cy.atualizarProduto(productId, {
          nome: 'Produto Atualizado'
        }, null).then((response) => {
          cy.step('Então o sistema deve retornar erro 401')
          expect(response.status).to.eq(401)
        })
      }
    })
  })

  /**
   * Teste: Validação de ID
   */
  it('Deve retornar erro ao buscar produto com ID inválido (formato incorreto)', () => {
    cy.step('Dado que tenho um ID com formato incorreto')
    cy.step('Quando busco o produto')
    cy.buscarProduto('id-invalido-123').then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  it('Deve retornar erro ao atualizar produto inexistente', () => {
    cy.step('Dado que tenho um ID de produto inexistente')
    cy.step('Quando tento atualizar o produto')
    const idInexistente = '000000000000000000000000'
    cy.atualizarProduto(idInexistente, {
      nome: 'Produto Atualizado'
    }, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      expect(response.status).to.eq(400)
    })
  })
})


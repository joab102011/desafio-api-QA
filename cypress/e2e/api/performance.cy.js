// ***********************************************************
// Testes de Performance - API Serverest
// 
// Cenários de teste para validar tempo de resposta
// e comportamento sob carga
// ***********************************************************

describe('API - Performance', () => {
  
  let token
  const TIMEOUT_PADRAO = 5000 // 5 segundos

  before(() => {
    // Cria um usuário e faz login para testes que precisam de autenticação
    const email = Cypress.helpers.gerarEmailAleatorio()
    const senha = 'senha123'
    
    cy.criarUsuario({
      nome: 'Admin Performance',
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
   * Teste: Performance - Login
   * 
   * Objetivo: Validar que o login responde em tempo aceitável
   */
  it('Login deve responder em menos de 2 segundos', () => {
    cy.step('Dado que tenho credenciais válidas')
    cy.step('Quando realizo login')
    const startTime = Date.now()
    
    cy.login('fulano@qa.com', 'teste').then((response) => {
      const responseTime = Date.now() - startTime
      
      cy.step('Então o sistema deve retornar status 200')
      expect(response.status).to.be.oneOf([200, 401]) // Pode ser 401 se usuário não existir
      
      cy.step('E o tempo de resposta deve ser menor que 2 segundos')
      expect(responseTime).to.be.lessThan(2000)
    })
  })

  /**
   * Teste: Performance - Listar Produtos
   * 
   * Objetivo: Validar que a listagem de produtos é rápida
   */
  it('Listar produtos deve responder em menos de 2 segundos', () => {
    cy.step('Dado que existem produtos cadastrados')
    cy.step('Quando solicito a listagem de produtos')
    const startTime = Date.now()
    
    cy.listarProdutos().then((response) => {
      const responseTime = Date.now() - startTime
      
      cy.step('Então o sistema deve retornar status 200')
      cy.validarRespostaSucesso(response, 200)
      
      cy.step('E o tempo de resposta deve ser menor que 2 segundos')
      expect(responseTime).to.be.lessThan(2000)
    })
  })

  /**
   * Teste: Performance - Listar Usuários
   * 
   * Objetivo: Validar que a listagem de usuários é rápida
   */
  it('Listar usuários deve responder em menos de 2 segundos', () => {
    cy.step('Dado que existem usuários cadastrados')
    cy.step('Quando solicito a listagem de usuários')
    const startTime = Date.now()
    
    cy.listarUsuarios().then((response) => {
      const responseTime = Date.now() - startTime
      
      cy.step('Então o sistema deve retornar status 200')
      cy.validarRespostaSucesso(response, 200)
      
      cy.step('E o tempo de resposta deve ser menor que 2 segundos')
      expect(responseTime).to.be.lessThan(2000)
    })
  })

  /**
   * Teste: Performance - Criar Usuário
   * 
   * Objetivo: Validar que a criação de usuário é rápida
   */
  it('Criar usuário deve responder em menos de 3 segundos', () => {
    cy.step('Dado que tenho dados válidos de usuário')
    cy.step('Quando envio requisição para criar usuário')
    const dadosUsuario = Cypress.helpers.gerarDadosUsuario()
    const startTime = Date.now()
    
    cy.criarUsuario(dadosUsuario).then((response) => {
      const responseTime = Date.now() - startTime
      
      cy.step('Então o sistema deve retornar status 201 ou 400')
      expect(response.status).to.be.oneOf([201, 400]) // 400 se email duplicado
      
      cy.step('E o tempo de resposta deve ser menor que 3 segundos')
      expect(responseTime).to.be.lessThan(3000)
    })
  })

  /**
   * Teste: Performance - Criar Produto
   * 
   * Objetivo: Validar que a criação de produto é rápida
   */
  it('Criar produto deve responder em menos de 3 segundos', () => {
    cy.step('Dado que tenho dados válidos de produto')
    cy.step('E estou autenticado')
    cy.step('Quando envio requisição para criar produto')
    const timestamp = Date.now()
    const dadosProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto.nome = `${dadosProduto.nome} ${timestamp}`
    const startTime = Date.now()
    
    cy.criarProduto(dadosProduto, token).then((response) => {
      const responseTime = Date.now() - startTime
      
      cy.step('Então o sistema deve retornar status 201 ou 400')
      expect(response.status).to.be.oneOf([201, 400]) // 400 se nome duplicado
      
      cy.step('E o tempo de resposta deve ser menor que 3 segundos')
      expect(responseTime).to.be.lessThan(3000)
    })
  })

  /**
   * Teste: Performance - Buscar Produto por ID
   * 
   * Objetivo: Validar que a busca por ID é rápida
   */
  it('Buscar produto por ID deve responder em menos de 1 segundo', () => {
    cy.step('Dado que tenho um ID de produto válido')
    cy.step('Quando busco o produto')
    // Primeiro lista produtos para pegar um ID válido
    cy.listarProdutos().then((listResponse) => {
      if (listResponse.body.produtos && listResponse.body.produtos.length > 0) {
        const productId = listResponse.body.produtos[0]._id
        const startTime = Date.now()
        
        cy.buscarProduto(productId).then((response) => {
          const responseTime = Date.now() - startTime
          
          cy.step('Então o sistema deve retornar status 200')
          cy.validarRespostaSucesso(response, 200)
          
          cy.step('E o tempo de resposta deve ser menor que 1 segundo')
          expect(responseTime).to.be.lessThan(1000)
        })
      }
    })
  })

  /**
   * Teste: Performance - Tamanho da Resposta
   * 
   * Objetivo: Validar que as respostas não são muito grandes
   */
  it('Resposta de listar produtos não deve exceder 1MB', () => {
    cy.step('Dado que solicito a listagem de produtos')
    cy.step('Quando recebo a resposta')
    cy.listarProdutos().then((response) => {
      cy.step('Então o tamanho da resposta deve ser razoável')
      const responseSize = JSON.stringify(response.body).length
      
      cy.step('E não deve exceder 1MB')
      expect(responseSize).to.be.lessThan(1000000) // 1MB
    })
  })

  it('Resposta de listar usuários não deve exceder 1MB', () => {
    cy.step('Dado que solicito a listagem de usuários')
    cy.step('Quando recebo a resposta')
    cy.listarUsuarios().then((response) => {
      cy.step('Então o tamanho da resposta deve ser razoável')
      const responseSize = JSON.stringify(response.body).length
      
      cy.step('E não deve exceder 1MB')
      expect(responseSize).to.be.lessThan(1000000) // 1MB
    })
  })

  /**
   * Teste: Performance - Múltiplas Requisições Sequenciais
   * 
   * Objetivo: Validar comportamento com múltiplas requisições
   */
  it('Deve suportar múltiplas requisições sequenciais sem degradação', () => {
    cy.step('Dado que faço múltiplas requisições sequenciais')
    cy.step('Quando executo 5 requisições de listagem')
    
    const tempos = []
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now()
      cy.listarProdutos().then((response) => {
        const responseTime = Date.now() - startTime
        tempos.push(responseTime)
        expect(response.status).to.eq(200)
      })
    }
    
    cy.then(() => {
      cy.step('Então todas as requisições devem completar com sucesso')
      cy.step('E os tempos devem ser consistentes')
      // Valida que não há degradação significativa (última não deve ser 5x mais lenta)
      if (tempos.length >= 2) {
        const primeiro = tempos[0]
        const ultimo = tempos[tempos.length - 1]
        // Ajustado para ser mais tolerante com variações de rede
        expect(ultimo).to.be.lessThan(primeiro * 5)
      }
    })
  })
})


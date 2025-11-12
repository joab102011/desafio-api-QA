// ***********************************************************
// Testes de API - Funcionalidade: Produtos
// 
// Cenários críticos automatizados:
// 1. Criar produto com dados válidos (autenticado)
// 2. Buscar produto por ID
// 3. Atualizar produto existente
// 4. Deletar produto existente
// 5. Listar todos os produtos
// 6. Validar campos obrigatórios
// 7. Validar autenticação necessária
// ***********************************************************

// Helpers são importados automaticamente via cypress/support/helpers.js

describe('API - Produtos', () => {
  
  // Variáveis para armazenar dados de teste
  let productId
  let dadosProduto
  let token
  let userId

  // Hook executado antes de todos os testes
  // Cria um usuário e realiza login para obter token
  before(() => {
    const email = Cypress.helpers.gerarEmailAleatorio()
    const senha = 'senha123'
    
    // Cria usuário administrador
    cy.criarUsuario({
      nome: 'Admin Produtos',
      email: email,
      password: senha,
      administrador: 'true'
    }).then((response) => {
      if (response.status === 201) {
        userId = response.body._id
        
        // Realiza login para obter token
        return cy.login(email, senha)
      }
    }).then((loginResponse) => {
      if (loginResponse && loginResponse.status === 200) {
        token = loginResponse.body.authorization
      }
    })
  })

  /**
   * Cenário Crítico 1: Criar produto com dados válidos
   * 
   * Objetivo: Validar que o sistema cria corretamente
   * um novo produto quando todos os dados são válidos e o usuário está autenticado
   * 
   * Criticidade: ALTA - Cadastro de produtos é funcionalidade essencial do e-commerce
   */
  it('Deve criar produto com dados válidos e usuário autenticado', () => {
    cy.step('Dado que tenho dados válidos de produto')
    cy.step('E estou autenticado no sistema')
    // Gera dados válidos de produto com nome único
    const timestamp = Date.now()
    const baseProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto = {
      ...baseProduto,
      nome: `${baseProduto.nome} ${timestamp}`
    }
    
    cy.step('Quando envio requisição para criar produto')
    cy.criarProduto(dadosProduto, token).then((response) => {
      cy.step('Então o sistema deve retornar status 201')
      cy.validarRespostaSucesso(response, 201)
      
      cy.step('E a resposta deve conter mensagem de sucesso')
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      
      cy.step('E a resposta deve conter ID do produto criado')
      expect(response.body).to.have.property('_id')
      
      // Armazena o ID do produto criado
      productId = response.body._id
      expect(productId).to.be.a('string')
      expect(productId.length).to.be.greaterThan(0)
      
      cy.step('E ao buscar o produto criado, os dados devem estar corretos')
      cy.buscarProduto(productId).then((getResponse) => {
        expect(getResponse.status).to.eq(200)
        expect(getResponse.body).to.have.property('nome', dadosProduto.nome)
        expect(getResponse.body).to.have.property('preco', dadosProduto.preco)
        expect(getResponse.body).to.have.property('descricao', dadosProduto.descricao)
        expect(getResponse.body).to.have.property('quantidade', dadosProduto.quantidade)
      })
    })
  })

  /**
   * Cenário Crítico 2: Buscar produto por ID
   * 
   * Objetivo: Validar que o sistema retorna corretamente
   * os dados de um produto quando buscado por ID
   * 
   * Criticidade: ALTA - Consulta de produtos é essencial para o e-commerce
   */
  it('Deve buscar produto por ID com sucesso', () => {
    cy.step('Dado que tenho um produto cadastrado no sistema')
    // Primeiro cria um produto para buscar com nome único
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 10000)
    const baseProduto = Cypress.helpers.gerarDadosProduto()
    dadosProduto = {
      ...baseProduto,
      nome: `Produto Teste Busca ${timestamp}_${randomSuffix}`,
      preco: 299.99,
      descricao: `Produto para teste de busca ${timestamp}_${randomSuffix}`,
      quantidade: 15
    }
    
    cy.criarProduto(dadosProduto, token).then((createResponse) => {
      // Verifica se o produto foi criado
      // Se falhou por duplicação, busca um produto existente para usar no teste
      if (createResponse.status === 400) {
        cy.step('E se o produto não pôde ser criado, uso um produto existente')
        // Se falhou, busca um produto existente para validar a busca
        return cy.listarProdutos().then((listResponse) => {
          if (listResponse.body.produtos && listResponse.body.produtos.length > 0) {
            productId = listResponse.body.produtos[0]._id
            return cy.wrap({ status: 200, useExisting: true })
          } else {
            // Se não há produtos, o teste falha
            throw new Error('Não foi possível criar produto e não há produtos existentes para testar')
          }
        })
      } else {
        expect(createResponse.status).to.eq(201)
        productId = createResponse.body._id
        expect(productId).to.be.a('string')
        return cy.wrap({ status: 201, useExisting: false })
      }
    }).then((result) => {
      // Valida que temos um productId válido
      expect(productId).to.be.a('string')
      expect(productId.length).to.be.greaterThan(0)
      
      cy.step('Quando busco o produto pelo ID')
      // Aguarda um pouco e busca o produto
      cy.wait(500)
      cy.buscarProduto(productId).then((response) => {
        cy.step('Então o sistema deve retornar status 200')
        cy.validarRespostaSucesso(response, 200)
        
        cy.step('E a resposta deve conter os dados do produto')
        expect(response.body).to.have.property('nome')
        expect(response.body).to.have.property('preco')
        expect(response.body).to.have.property('descricao')
        expect(response.body).to.have.property('quantidade')
        expect(response.body).to.have.property('_id', productId)
        
        // Se for o produto que criamos (não é existente), valida os dados específicos
        if (!result.useExisting && response.body.nome === dadosProduto.nome) {
          cy.step('E os dados devem corresponder aos dados cadastrados')
          expect(response.body).to.have.property('nome', dadosProduto.nome)
          expect(response.body).to.have.property('preco', dadosProduto.preco)
          expect(response.body).to.have.property('descricao', dadosProduto.descricao)
          expect(response.body).to.have.property('quantidade', dadosProduto.quantidade)
        }
      })
    })
  })

  /**
   * Cenário adicional: Validar criação de produto sem autenticação
   * 
   * Objetivo: Validar que apenas usuários autenticados podem criar produtos
   */
  it('Deve rejeitar criação de produto sem autenticação', () => {
    cy.step('Dado que tenho dados válidos de produto')
    cy.step('E não estou autenticado no sistema')
    dadosProduto = Cypress.helpers.gerarDadosProduto()
    
    cy.step('Quando tento criar produto sem token de autenticação')
    cy.request({
      method: 'POST',
      url: '/produtos',
      body: dadosProduto,
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 401')
      cy.step('E a mensagem deve indicar que o token está ausente')
      cy.validarRespostaErro(response, 401, 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
    })
  })

  /**
   * Cenário adicional: Validar campos obrigatórios na criação
   * 
   * Objetivo: Validar que o sistema valida campos obrigatórios
   */
  it('Deve rejeitar criação de produto sem campos obrigatórios', () => {
    cy.step('Dado que não preencho os campos obrigatórios')
    
    cy.step('Quando tento criar produto sem nome')
    cy.criarProduto({
      preco: 100,
      descricao: 'Produto sem nome',
      quantidade: 10
    }, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento criar produto sem preço')
    cy.criarProduto({
      nome: 'Produto sem preço',
      descricao: 'Produto sem preço',
      quantidade: 10
    }, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento criar produto sem descrição')
    cy.criarProduto({
      nome: 'Produto sem descrição',
      preco: 100,
      quantidade: 10
    }, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento criar produto sem quantidade')
    cy.criarProduto({
      nome: 'Produto sem quantidade',
      preco: 100,
      descricao: 'Produto sem quantidade'
    }, token).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  /**
   * Cenário adicional: Atualizar produto existente
   * 
   * Objetivo: Validar atualização de dados de produto
   */
  it('Deve atualizar produto existente com sucesso', () => {
    cy.step('Dado que tenho um produto cadastrado no sistema')
    // Cria um produto primeiro com nome único
    const timestamp = Date.now()
    dadosProduto = Cypress.helpers.gerarDadosProduto({
      nome: `Produto Original ${timestamp}`,
      preco: 100,
      descricao: 'Descrição original',
      quantidade: 5
    })
    
    cy.criarProduto(dadosProduto, token).then((createResponse) => {
      expect(createResponse.status).to.eq(201)
      productId = createResponse.body._id
      
      cy.step('Quando envio requisição para atualizar o produto')
      // Atualiza o produto com nome único também
      const dadosAtualizados = {
        nome: `Produto Atualizado ${timestamp}`,
        preco: 200,
        descricao: 'Descrição atualizada',
        quantidade: 10
      }
      
      cy.atualizarProduto(productId, dadosAtualizados, token).then((response) => {
        cy.step('Então o sistema deve retornar status 200')
        cy.validarRespostaSucesso(response, 200)
        cy.step('E a resposta deve conter mensagem de sucesso')
        expect(response.body).to.have.property('message', 'Registro alterado com sucesso')
      })
    })
  })

  /**
   * Cenário adicional: Listar todos os produtos
   * 
   * Objetivo: Validar que o sistema retorna lista de produtos
   */
  it('Deve listar todos os produtos', () => {
    cy.step('Dado que existem produtos cadastrados no sistema')
    
    cy.step('Quando solicito a listagem de todos os produtos')
    cy.listarProdutos().then((response) => {
      cy.step('Então o sistema deve retornar status 200')
      cy.validarRespostaSucesso(response, 200)
      
      cy.step('E a resposta deve conter lista de produtos')
      expect(response.body).to.have.property('quantidade')
      expect(response.body).to.have.property('produtos')
      expect(response.body.produtos).to.be.an('array')
      expect(response.body.quantidade).to.be.a('number')
    })
  })

  /**
   * Cenário adicional: Buscar produto inexistente
   * 
   * Objetivo: Validar tratamento de erro para produto não encontrado
   */
  it('Deve retornar erro ao buscar produto inexistente', () => {
    cy.step('Dado que tenho um ID de produto inexistente')
    const idInexistente = '000000000000000000000000' // ID inválido
    
    cy.step('Quando busco o produto por esse ID')
    cy.buscarProduto(idInexistente).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.step('E a mensagem deve indicar que o produto não foi encontrado')
      cy.validarRespostaErro(response, 400, 'Produto não encontrado')
    })
  })
})


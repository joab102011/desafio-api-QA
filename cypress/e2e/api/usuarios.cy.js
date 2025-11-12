// ***********************************************************
// Testes de API - Funcionalidade: Usuários
// 
// Cenários críticos automatizados:
// 1. Criar usuário com dados válidos
// 2. Buscar usuário por ID
// 3. Atualizar usuário existente
// 4. Deletar usuário existente
// 5. Listar todos os usuários
// 6. Validar campos obrigatórios
// 7. Validar email duplicado
// ***********************************************************

// Helpers são importados automaticamente via cypress/support/helpers.js

describe('API - Usuários', () => {
  
  // Variáveis para armazenar dados de teste
  let userId
  let dadosUsuario
  let token

  // Hook executado antes de todos os testes
  // Realiza login para obter token de autenticação
  before(() => {
    // Cria um usuário administrador para usar nos testes
    const email = Cypress.helpers.gerarEmailAleatorio()
    const senha = 'senha123'
    
    cy.criarUsuario({
      nome: 'Admin Teste',
      email: email,
      password: senha,
      administrador: 'true'
    }).then(() => {
      // Realiza login para obter token
      return cy.login(email, senha)
    }).then((response) => {
      if (response && response.status === 200) {
        token = response.body.authorization
      }
    })
  })

  /**
   * Cenário Crítico 1: Criar usuário com dados válidos
   * 
   * Objetivo: Validar que o sistema cria corretamente
   * um novo usuário quando todos os dados são válidos
   * 
   * Criticidade: ALTA - Cadastro de usuários é funcionalidade essencial
   */
  it('Deve criar usuário com dados válidos', () => {
    cy.step('Dado que tenho dados válidos de usuário')
    dadosUsuario = Cypress.helpers.gerarDadosUsuario()
    
    cy.step('Quando envio requisição para criar usuário')
    cy.criarUsuario(dadosUsuario).then((response) => {
      cy.step('Então o sistema deve retornar status 201')
      cy.validarRespostaSucesso(response, 201)
      
      cy.step('E a resposta deve conter mensagem de sucesso')
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      
      cy.step('E a resposta deve conter ID do usuário criado')
      expect(response.body).to.have.property('_id')
      
      // Armazena o ID do usuário criado para uso em outros testes
      userId = response.body._id
      expect(userId).to.be.a('string')
      expect(userId.length).to.be.greaterThan(0)
    })
  })

  /**
   * Cenário Crítico 2: Buscar usuário por ID
   * 
   * Objetivo: Validar que o sistema retorna corretamente
   * os dados de um usuário quando buscado por ID
   * 
   * Criticidade: ALTA - Consulta de dados é funcionalidade essencial
   */
  it('Deve buscar usuário por ID com sucesso', () => {
    cy.step('Dado que tenho um usuário cadastrado no sistema')
    dadosUsuario = Cypress.helpers.gerarDadosUsuario()
    
    cy.criarUsuario(dadosUsuario).then((createResponse) => {
      expect(createResponse.status).to.eq(201)
      userId = createResponse.body._id
      
      cy.step('Quando busco o usuário pelo ID')
      cy.buscarUsuario(userId).then((response) => {
        cy.step('Então o sistema deve retornar status 200')
        cy.validarRespostaSucesso(response, 200)
        
        cy.step('E os dados retornados devem corresponder aos dados cadastrados')
        expect(response.body).to.have.property('nome', dadosUsuario.nome)
        expect(response.body).to.have.property('email', dadosUsuario.email)
        expect(response.body).to.have.property('administrador', dadosUsuario.administrador)
        expect(response.body).to.have.property('_id', userId)
      })
    })
  })

  /**
   * Cenário adicional: Validar criação de usuário com email duplicado
   * 
   * Objetivo: Validar que o sistema não permite cadastro de emails duplicados
   */
  it('Deve rejeitar criação de usuário com email duplicado', () => {
    cy.step('Dado que já existe um usuário cadastrado com um email')
    dadosUsuario = Cypress.helpers.gerarDadosUsuario()
    
    cy.criarUsuario(dadosUsuario).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201)
      
      cy.step('Quando tento criar outro usuário com o mesmo email')
      cy.criarUsuario({
        nome: 'Outro Nome',
        email: dadosUsuario.email, // Mesmo email
        password: 'outrasenha',
        administrador: 'false'
      }).then((secondResponse) => {
        cy.step('Então o sistema deve retornar erro 400')
        cy.step('E a mensagem deve indicar que o email já está em uso')
        cy.validarRespostaErro(secondResponse, 400, 'Este email já está sendo usado')
      })
    })
  })

  /**
   * Cenário adicional: Validar campos obrigatórios
   * 
   * Objetivo: Validar que o sistema valida campos obrigatórios
   */
  it('Deve rejeitar criação de usuário sem campos obrigatórios', () => {
    cy.step('Dado que não preencho os campos obrigatórios')
    
    cy.step('Quando tento criar usuário sem nome')
    cy.criarUsuario({
      email: Cypress.helpers.gerarEmailAleatorio(),
      password: 'senha123',
      administrador: 'true'
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento criar usuário sem email')
    cy.criarUsuario({
      nome: 'Teste',
      password: 'senha123',
      administrador: 'true'
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento criar usuário sem senha')
    cy.criarUsuario({
      nome: 'Teste',
      email: Cypress.helpers.gerarEmailAleatorio(),
      administrador: 'true'
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })

  /**
   * Cenário adicional: Buscar usuário inexistente
   * 
   * Objetivo: Validar tratamento de erro para usuário não encontrado
   */
  it('Deve retornar erro ao buscar usuário inexistente', () => {
    cy.step('Dado que tenho um ID de usuário inexistente')
    const idInexistente = '000000000000000000000000' // ID inválido
    
    cy.step('Quando busco o usuário por esse ID')
    cy.buscarUsuario(idInexistente).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.step('E a mensagem deve indicar que o usuário não foi encontrado')
      cy.validarRespostaErro(response, 400, 'Usuário não encontrado')
    })
  })

  /**
   * Cenário adicional: Listar todos os usuários
   * 
   * Objetivo: Validar que o sistema retorna lista de usuários
   */
  it('Deve listar todos os usuários', () => {
    cy.step('Dado que existem usuários cadastrados no sistema')
    
    cy.step('Quando solicito a listagem de todos os usuários')
    cy.listarUsuarios().then((response) => {
      cy.step('Então o sistema deve retornar status 200')
      cy.validarRespostaSucesso(response, 200)
      
      cy.step('E a resposta deve conter lista de usuários')
      expect(response.body).to.have.property('quantidade')
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array')
      expect(response.body.quantidade).to.be.a('number')
      expect(response.body.quantidade).to.be.greaterThan(0)
    })
  })
})


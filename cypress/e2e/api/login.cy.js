// ***********************************************************
// Testes de API - Funcionalidade: Login
// 
// Cenários críticos automatizados:
// 1. Login com credenciais válidas
// 2. Login com credenciais inválidas
// ***********************************************************

describe('API - Login', () => {
  
  // Variáveis para armazenar dados de teste
  let emailValido
  let senhaValida
  let token

  // Hook executado antes de todos os testes
  // Cria um usuário válido para usar nos testes de login
  before(() => {
    // Gera dados de usuário válido
    emailValido = `teste_login_${Date.now()}@teste.com`
    senhaValida = 'senha123'
    
    // Cria o usuário antes de testar o login
    cy.criarUsuario({
      nome: 'Usuário Teste Login',
      email: emailValido,
      password: senhaValida,
      administrador: 'true'
    }).then((response) => {
      // Valida que o usuário foi criado com sucesso
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
    })
  })

  /**
   * Cenário Crítico 1: Login com credenciais válidas
   * 
   * Objetivo: Validar que o sistema autentica corretamente
   * um usuário com credenciais válidas e retorna um token de acesso
   * 
   * Criticidade: ALTA - Login é funcionalidade essencial do sistema
   */
  it('Deve realizar login com credenciais válidas e retornar token de autenticação', () => {
    cy.step('Dado que tenho um usuário cadastrado no sistema')
    cy.step('Quando realizo login com credenciais válidas')
    cy.login(emailValido, senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar status 200')
      cy.validarRespostaSucesso(response, 200)
      
      cy.step('E a resposta deve conter mensagem de sucesso')
      expect(response.body).to.have.property('message', 'Login realizado com sucesso')
      
      cy.step('E a resposta deve conter token de autorização')
      expect(response.body).to.have.property('authorization')
      expect(response.body.authorization).to.be.a('string')
      expect(response.body.authorization.length).to.be.greaterThan(0)
      
      // Armazena o token para uso em outros testes se necessário
      token = response.body.authorization
      
      cy.step('E o token deve ter formato Bearer válido')
      expect(response.body.authorization).to.include('Bearer')
    })
  })

  /**
   * Cenário Crítico 2: Login com credenciais inválidas
   * 
   * Objetivo: Validar que o sistema rejeita corretamente
   * tentativas de login com credenciais inválidas
   * 
   * Criticidade: ALTA - Segurança do sistema depende disso
   */
  it('Deve rejeitar login com credenciais inválidas', () => {
    cy.step('Dado que tenho credenciais inválidas')
    
    cy.step('Quando tento fazer login com email inválido')
    cy.login('email_invalido@teste.com', senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 401')
      cy.validarRespostaErro(response, 401, 'Email e/ou senha inválidos')
    })

    cy.step('Quando tento fazer login com senha inválida')
    cy.login(emailValido, 'senha_incorreta').then((response) => {
      cy.step('Então o sistema deve retornar erro 401')
      cy.validarRespostaErro(response, 401, 'Email e/ou senha inválidos')
    })

    cy.step('Quando tento fazer login com email e senha inválidos')
    cy.login('email_inexistente@teste.com', 'senha_qualquer').then((response) => {
      cy.step('Então o sistema deve retornar erro 401')
      cy.validarRespostaErro(response, 401, 'Email e/ou senha inválidos')
    })
  })

  /**
   * Cenário adicional: Login sem preencher campos obrigatórios
   * 
   * Objetivo: Validar validação de campos obrigatórios
   */
  it('Deve rejeitar login sem preencher campos obrigatórios', () => {
    cy.step('Dado que não preencho os campos obrigatórios')
    
    cy.step('Quando tento fazer login sem email')
    cy.login('', senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento fazer login sem senha')
    cy.login(emailValido, '').then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })

    cy.step('Quando tento fazer login sem email e sem senha')
    cy.login('', '').then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      cy.validarRespostaErro(response, 400)
    })
  })
})


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
    cy.login(emailValido, senhaValida).then((response) => {
      // Valida status da resposta
      cy.validarRespostaSucesso(response, 200)
      
      // Valida estrutura da resposta
      expect(response.body).to.have.property('message', 'Login realizado com sucesso')
      expect(response.body).to.have.property('authorization')
      expect(response.body.authorization).to.be.a('string')
      expect(response.body.authorization.length).to.be.greaterThan(0)
      
      // Armazena o token para uso em outros testes se necessário
      token = response.body.authorization
      
      // Valida que o token tem formato válido (Bearer token)
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
    // Testa com email inválido
    cy.login('email_invalido@teste.com', senhaValida).then((response) => {
      cy.validarRespostaErro(response, 401, 'Email e/ou senha inválidos')
    })

    // Testa com senha inválida
    cy.login(emailValido, 'senha_incorreta').then((response) => {
      cy.validarRespostaErro(response, 401, 'Email e/ou senha inválidos')
    })

    // Testa com email e senha inválidos
    cy.login('email_inexistente@teste.com', 'senha_qualquer').then((response) => {
      cy.validarRespostaErro(response, 401, 'Email e/ou senha inválidos')
    })
  })

  /**
   * Cenário adicional: Login sem preencher campos obrigatórios
   * 
   * Objetivo: Validar validação de campos obrigatórios
   */
  it('Deve rejeitar login sem preencher campos obrigatórios', () => {
    // Testa sem email
    cy.login('', senhaValida).then((response) => {
      cy.validarRespostaErro(response, 400)
    })

    // Testa sem senha
    cy.login(emailValido, '').then((response) => {
      cy.validarRespostaErro(response, 400)
    })

    // Testa sem email e sem senha
    cy.login('', '').then((response) => {
      cy.validarRespostaErro(response, 400)
    })
  })
})


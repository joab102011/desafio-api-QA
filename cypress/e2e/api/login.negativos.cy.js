// ***********************************************************
// Testes Negativos - Funcionalidade: Login
// 
// Cenários de teste negativo para validar tratamento de erros
// e comportamentos de segurança
// ***********************************************************

describe('API - Login - Testes Negativos', () => {
  
  let emailValido
  let senhaValida

  before(() => {
    // Cria um usuário válido para usar nos testes
    emailValido = `teste_login_neg_${Date.now()}@teste.com`
    senhaValida = 'senha123'
    
    cy.criarUsuario({
      nome: 'Usuário Teste Login Negativo',
      email: emailValido,
      password: senhaValida,
      administrador: 'true'
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })

  /**
   * Teste: Login com email em formato inválido
   * 
   * Objetivo: Validar que o sistema rejeita emails em formato inválido
   */
  it('Deve rejeitar login com email sem @', () => {
    cy.step('Dado que tenho um email sem o caractere @')
    cy.step('Quando tento fazer login')
    cy.login('usuario.teste.com', senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  it('Deve rejeitar login com email sem domínio', () => {
    cy.step('Dado que tenho um email sem domínio')
    cy.step('Quando tento fazer login')
    cy.login('usuario@', senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  it('Deve rejeitar login com email com múltiplos @', () => {
    cy.step('Dado que tenho um email com múltiplos @')
    cy.step('Quando tento fazer login')
    cy.login('usuario@@teste.com', senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  /**
   * Teste: Login com tipos de dados incorretos
   * 
   * Objetivo: Validar que o sistema trata tipos de dados incorretos
   */
  it('Deve rejeitar login com email como número', () => {
    cy.step('Dado que envio email como número')
    cy.step('Quando tento fazer login')
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: 123456,
        password: senhaValida
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  it('Deve rejeitar login com senha como número', () => {
    cy.step('Dado que envio senha como número')
    cy.step('Quando tento fazer login')
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: emailValido,
        password: 123456
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  /**
   * Teste: Login com tentativas de SQL Injection
   * 
   * Objetivo: Validar proteção contra SQL Injection
   */
  it('Deve rejeitar login com tentativa de SQL Injection no email', () => {
    cy.step('Dado que tento SQL Injection no campo email')
    cy.step('Quando envio payload malicioso')
    const sqlInjection = "admin' OR '1'='1"
    cy.login(sqlInjection, senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      cy.step('E não deve permitir acesso não autorizado')
      expect(response.status).to.be.oneOf([400, 401])
      expect(response.body).to.not.have.property('authorization')
    })
  })

  it('Deve rejeitar login com tentativa de SQL Injection na senha', () => {
    cy.step('Dado que tento SQL Injection no campo senha')
    cy.step('Quando envio payload malicioso')
    const sqlInjection = "' OR '1'='1"
    cy.login(emailValido, sqlInjection).then((response) => {
      cy.step('Então o sistema deve retornar erro 401')
      cy.step('E não deve permitir acesso não autorizado')
      expect(response.status).to.eq(401)
      expect(response.body).to.not.have.property('authorization')
    })
  })

  /**
   * Teste: Login com tentativas de XSS
   * 
   * Objetivo: Validar proteção contra Cross-Site Scripting
   */
  it('Deve rejeitar login com tentativa de XSS no email', () => {
    cy.step('Dado que tento XSS no campo email')
    cy.step('Quando envio script malicioso')
    const xssPayload = '<script>alert("XSS")</script>@teste.com'
    cy.login(xssPayload, senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      cy.step('E não deve executar o script')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  /**
   * Teste: Login com campos muito longos
   * 
   * Objetivo: Validar tratamento de campos com tamanho excessivo
   */
  it('Deve rejeitar login com email muito longo', () => {
    cy.step('Dado que tenho um email com mais de 100 caracteres')
    cy.step('Quando tento fazer login')
    const emailLongo = 'a'.repeat(100) + '@teste.com'
    cy.login(emailLongo, senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  it('Deve rejeitar login com senha muito longa', () => {
    cy.step('Dado que tenho uma senha com mais de 100 caracteres')
    cy.step('Quando tento fazer login')
    const senhaLonga = 'a'.repeat(200)
    cy.login(emailValido, senhaLonga).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  /**
   * Teste: Login com caracteres especiais
   * 
   * Objetivo: Validar tratamento de caracteres especiais
   */
  it('Deve rejeitar login com email contendo caracteres especiais inválidos', () => {
    cy.step('Dado que tenho um email com caracteres especiais inválidos')
    cy.step('Quando tento fazer login')
    cy.login('usuario#teste@teste.com', senhaValida).then((response) => {
      cy.step('Então o sistema deve retornar erro 400 ou 401')
      expect(response.status).to.be.oneOf([400, 401])
    })
  })

  /**
   * Teste: Login com campos null/undefined
   * 
   * Objetivo: Validar tratamento de valores nulos
   */
  it('Deve rejeitar login com email null', () => {
    cy.step('Dado que envio email como null')
    cy.step('Quando tento fazer login')
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: null,
        password: senhaValida
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      expect(response.status).to.eq(400)
    })
  })

  it('Deve rejeitar login com senha null', () => {
    cy.step('Dado que envio senha como null')
    cy.step('Quando tento fazer login')
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: emailValido,
        password: null
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.step('Então o sistema deve retornar erro 400')
      expect(response.status).to.eq(400)
    })
  })
})


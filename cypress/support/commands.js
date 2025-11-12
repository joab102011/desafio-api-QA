// ***********************************************************
// Custom Commands - Comandos reutilizáveis para os testes
// Seguindo as boas práticas mencionadas na entrevista:
// - Usar Custom Commands para métodos que serão reutilizados
// - Evitar herança desnecessária
// - Manter código organizado e comentado
// ***********************************************************

/**
 * Comando customizado para criar steps BDD (Behavior-Driven Development)
 * Segue o padrão Given-When-Then (Dado-Quando-Então)
 * @param {string} message - Mensagem descritiva do step BDD
 * @returns {Cypress.Chainable} - Retorna o próprio Cypress para encadeamento
 */
Cypress.Commands.add('step', (message) => {
  // Loga o step no console do Cypress para melhor rastreabilidade
  cy.log(`STEP: ${message}`)
  // Retorna o próprio Cypress para permitir encadeamento
  return cy.wrap(null)
})

/**
 * Comando customizado para realizar login na API
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('login', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/login',
    body: {
      email: email,
      password: password
    },
    failOnStatusCode: false // Permite validar respostas de erro
  }).then((response) => {
    // Armazena o token na sessão se o login for bem-sucedido
    if (response.status === 200 && response.body.authorization) {
      cy.wrap(response.body.authorization).as('authToken')
    }
    return cy.wrap(response)
  })
})

/**
 * Comando customizado para criar um usuário
 * @param {Object} userData - Dados do usuário a ser criado
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('criarUsuario', (userData) => {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: userData,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para buscar um usuário por ID
 * @param {string} userId - ID do usuário
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('buscarUsuario', (userId) => {
  return cy.request({
    method: 'GET',
    url: `/usuarios/${userId}`,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para listar todos os usuários
 * @param {Object} queryParams - Parâmetros de query (opcional)
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('listarUsuarios', (queryParams = {}) => {
  return cy.request({
    method: 'GET',
    url: '/usuarios',
    qs: queryParams,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para atualizar um usuário
 * @param {string} userId - ID do usuário
 * @param {Object} userData - Dados atualizados do usuário
 * @param {string} token - Token de autenticação (opcional)
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('atualizarUsuario', (userId, userData, token = null) => {
  const headers = token ? { authorization: token } : {}
  
  return cy.request({
    method: 'PUT',
    url: `/usuarios/${userId}`,
    body: userData,
    headers: headers,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para deletar um usuário
 * @param {string} userId - ID do usuário
 * @param {string} token - Token de autenticação (opcional)
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('deletarUsuario', (userId, token = null) => {
  const headers = token ? { authorization: token } : {}
  
  return cy.request({
    method: 'DELETE',
    url: `/usuarios/${userId}`,
    headers: headers,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para criar um produto
 * @param {Object} productData - Dados do produto
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('criarProduto', (productData, token) => {
  return cy.request({
    method: 'POST',
    url: '/produtos',
    body: productData,
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para buscar um produto por ID
 * @param {string} productId - ID do produto
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('buscarProduto', (productId) => {
  return cy.request({
    method: 'GET',
    url: `/produtos/${productId}`,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para listar todos os produtos
 * @param {Object} queryParams - Parâmetros de query (opcional)
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('listarProdutos', (queryParams = {}) => {
  return cy.request({
    method: 'GET',
    url: '/produtos',
    qs: queryParams,
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para atualizar um produto
 * @param {string} productId - ID do produto
 * @param {Object} productData - Dados atualizados do produto
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('atualizarProduto', (productId, productData, token) => {
  return cy.request({
    method: 'PUT',
    url: `/produtos/${productId}`,
    body: productData,
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para deletar um produto
 * @param {string} productId - ID do produto
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('deletarProduto', (productId, token) => {
  return cy.request({
    method: 'DELETE',
    url: `/produtos/${productId}`,
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para criar um carrinho
 * @param {Array} produtos - Array de produtos com quantidade
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('criarCarrinho', (produtos, token) => {
  return cy.request({
    method: 'POST',
    url: '/carrinhos',
    body: {
      produtos: produtos
    },
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para buscar um carrinho por ID
 * @param {string} cartId - ID do carrinho
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('buscarCarrinho', (cartId, token) => {
  return cy.request({
    method: 'GET',
    url: `/carrinhos/${cartId}`,
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para listar carrinhos
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('listarCarrinhos', (token) => {
  return cy.request({
    method: 'GET',
    url: '/carrinhos',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para concluir uma compra (finalizar carrinho)
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('concluirCompra', (token) => {
  return cy.request({
    method: 'DELETE',
    url: '/carrinhos/concluir-compra',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para cancelar uma compra (deletar carrinho)
 * @param {string} token - Token de autenticação
 * @returns {Cypress.Chainable} - Retorna a resposta da requisição
 */
Cypress.Commands.add('cancelarCompra', (token) => {
  return cy.request({
    method: 'DELETE',
    url: '/carrinhos/cancelar-compra',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  })
})

/**
 * Comando customizado para validar estrutura de resposta de sucesso
 * @param {Object} response - Resposta da requisição
 * @param {number} expectedStatus - Status HTTP esperado (padrão: 200)
 */
Cypress.Commands.add('validarRespostaSucesso', (response, expectedStatus = 200) => {
  expect(response.status).to.eq(expectedStatus)
  expect(response.body).to.not.be.null
})

/**
 * Comando customizado para validar estrutura de resposta de erro
 * @param {Object} response - Resposta da requisição
 * @param {number} expectedStatus - Status HTTP esperado
 * @param {string} expectedMessage - Mensagem de erro esperada (opcional)
 */
Cypress.Commands.add('validarRespostaErro', (response, expectedStatus, expectedMessage = null) => {
  expect(response.status).to.eq(expectedStatus)
  // Valida mensagem apenas se existir na resposta
  if (response.body && response.body.message) {
    if (expectedMessage) {
      expect(response.body.message).to.include(expectedMessage)
    }
  }
})


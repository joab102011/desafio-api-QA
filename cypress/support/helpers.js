// ***********************************************************
// Helpers - Funções auxiliares para geração de dados de teste
// ***********************************************************

/**
 * Gera um email aleatório para testes
 * @returns {string} - Email gerado
 */
const gerarEmailAleatorio = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `teste_${timestamp}_${random}@teste.com`
}

/**
 * Gera um nome aleatório para testes
 * @returns {string} - Nome gerado
 */
const gerarNomeAleatorio = () => {
  const nomes = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Julia', 'Lucas', 'Fernanda']
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida']
  const nome = nomes[Math.floor(Math.random() * nomes.length)]
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
  return `${nome} ${sobrenome}`
}

/**
 * Gera dados completos de usuário para testes
 * @param {Object} overrides - Dados para sobrescrever os padrões
 * @returns {Object} - Objeto com dados do usuário
 */
const gerarDadosUsuario = (overrides = {}) => {
  return {
    nome: gerarNomeAleatorio(),
    email: gerarEmailAleatorio(),
    password: 'senha123',
    administrador: 'true',
    ...overrides
  }
}

/**
 * Gera dados completos de produto para testes
 * @param {Object} overrides - Dados para sobrescrever os padrões
 * @returns {Object} - Objeto com dados do produto
 */
const gerarDadosProduto = (overrides = {}) => {
  const produtos = [
    { nome: 'Notebook', preco: 3500, descricao: 'Notebook gamer', quantidade: 10 },
    { nome: 'Mouse', preco: 50, descricao: 'Mouse óptico', quantidade: 50 },
    { nome: 'Teclado', preco: 150, descricao: 'Teclado mecânico', quantidade: 30 },
    { nome: 'Monitor', preco: 800, descricao: 'Monitor 24 polegadas', quantidade: 20 }
  ]
  
  const produtoBase = produtos[Math.floor(Math.random() * produtos.length)]
  
  return {
    ...produtoBase,
    ...overrides
  }
}

// Exporta as funções para uso nos testes
// As funções ficam disponíveis globalmente através do objeto Cypress
Cypress.helpers = {
  gerarEmailAleatorio,
  gerarNomeAleatorio,
  gerarDadosUsuario,
  gerarDadosProduto
}


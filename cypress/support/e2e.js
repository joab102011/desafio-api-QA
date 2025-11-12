// ***********************************************************
// Este arquivo é processado e carregado automaticamente antes
// dos arquivos de teste. É um ótimo lugar para colocar configurações
// globais e comportamentos que modificam o Cypress.
//
// Você pode ler mais aqui:
// https://on.cypress.io/configuration
// ***********************************************************

// Importa os comandos customizados
import './commands'

// Importa os helpers
import './helpers'

// Configurações globais
// Desabilita logs desnecessários no console
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para prevenir que o Cypress falhe o teste
  // em caso de exceções não capturadas (útil para APIs)
  return false
})


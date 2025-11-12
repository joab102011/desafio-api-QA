const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev',
    // Configuração para testes de API
    setupNodeEvents(on, config) {
      allureWriter(on, config)
      return config
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true
    },
    // Timeout padrão para requisições
    defaultCommandTimeout: 10000,
    // Timeout para execução de testes
    execTimeout: 60000,
    // Timeout para requisições HTTP
    requestTimeout: 10000,
    // Timeout para resposta
    responseTimeout: 10000,
    // Especifica onde estão os testes
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // Suporta arquivos de suporte
    supportFile: 'cypress/support/e2e.js',
    // Vídeo desabilitado para testes de API (opcional)
    video: false,
    // Screenshots apenas em falhas
    screenshotOnRunFailure: true
  }
})


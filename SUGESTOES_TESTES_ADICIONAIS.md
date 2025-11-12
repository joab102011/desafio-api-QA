# Sugestões de Testes Adicionais - Negativos e Performance

Este documento lista sugestões de testes negativos e de performance que podem ser adicionados ao projeto para aumentar a cobertura de testes.

## 📋 Testes Negativos Adicionais

### 🔐 Login

#### Testes Negativos Faltantes:
1. **Login com email em formato inválido**
   - Email sem @ (ex: `usuario.teste.com`)
   - Email sem domínio (ex: `usuario@`)
   - Email com múltiplos @ (ex: `usuario@@teste.com`)
   - Email com caracteres especiais inválidos

2. **Login com tipos de dados incorretos**
   - Email como número
   - Senha como número
   - Email como objeto/array

3. **Login com SQL Injection**
   - Tentativa de SQL injection no campo email
   - Tentativa de SQL injection no campo senha

4. **Login com XSS (Cross-Site Scripting)**
   - Tentativa de XSS no campo email
   - Tentativa de XSS no campo senha

5. **Login com token expirado**
   - Validar comportamento com token expirado
   - Validar renovação de token

6. **Login com rate limiting**
   - Múltiplas tentativas de login (brute force)
   - Validar bloqueio temporário após X tentativas

### 👥 Usuários

#### Testes Negativos Faltantes:
1. **Validação de formato de email**
   - Email sem @
   - Email sem domínio
   - Email com formato inválido
   - Email muito longo

2. **Validação de senha**
   - Senha muito curta (< 6 caracteres)
   - Senha muito longa (> 100 caracteres)
   - Senha apenas com números
   - Senha apenas com letras
   - Senha com caracteres especiais inválidos

3. **Validação de nome**
   - Nome vazio (apenas espaços)
   - Nome muito longo (> 100 caracteres)
   - Nome com caracteres especiais inválidos
   - Nome apenas com números

4. **Validação de campo administrador**
   - Valor diferente de 'true' ou 'false'
   - Valor numérico
   - Valor nulo

5. **Testes de segurança**
   - Tentativa de criar usuário com SQL Injection
   - Tentativa de criar usuário com XSS
   - Tentativa de criar usuário com dados maliciosos

6. **Testes de autorização**
   - Atualizar usuário de outro usuário (sem permissão)
   - Deletar usuário sem autenticação
   - Buscar usuário com token inválido

7. **Validação de limites**
   - Criar usuário com dados no limite máximo
   - Criar usuário com dados no limite mínimo

### 🛍️ Produtos

#### Testes Negativos Faltantes:
1. **Validação de preço**
   - Preço negativo
   - Preço zero
   - Preço muito alto (overflow)
   - Preço com muitas casas decimais
   - Preço como string
   - Preço como null/undefined

2. **Validação de quantidade**
   - Quantidade negativa
   - Quantidade zero
   - Quantidade muito alta (overflow)
   - Quantidade como string
   - Quantidade como float (deve ser inteiro)

3. **Validação de nome**
   - Nome vazio
   - Nome apenas com espaços
   - Nome muito longo (> 200 caracteres)
   - Nome com caracteres especiais inválidos

4. **Validação de descrição**
   - Descrição vazia
   - Descrição apenas com espaços
   - Descrição muito longa (> 1000 caracteres)

5. **Testes de segurança**
   - Tentativa de criar produto com SQL Injection
   - Tentativa de criar produto com XSS
   - Tentativa de criar produto com dados maliciosos

6. **Testes de autorização**
   - Criar produto com token inválido
   - Criar produto com token expirado
   - Atualizar produto de outro usuário
   - Deletar produto sem autenticação

7. **Validação de tipos de dados**
   - Enviar objeto ao invés de string
   - Enviar array ao invés de número
   - Enviar null/undefined em campos obrigatórios

### 🛒 Carrinhos

#### Testes Negativos Faltantes:
1. **Validação de quantidade no carrinho**
   - Quantidade zero
   - Quantidade negativa
   - Quantidade muito alta (maior que estoque)
   - Quantidade como string
   - Quantidade como float

2. **Validação de produtos no carrinho**
   - Array vazio
   - Array com objetos inválidos
   - Array com ID de produto inválido
   - Array com produto deletado
   - Array com produto sem estoque

3. **Validação de limites**
   - Carrinho com muitos produtos (limite máximo)
   - Produto com quantidade maior que estoque disponível

4. **Testes de segurança**
   - Tentativa de criar carrinho com SQL Injection
   - Tentativa de criar carrinho com XSS
   - Tentativa de criar carrinho com dados maliciosos

5. **Testes de autorização**
   - Criar carrinho com token inválido
   - Criar carrinho com token expirado
   - Buscar carrinho de outro usuário
   - Concluir compra sem autenticação
   - Cancelar compra sem autenticação

6. **Validação de estados**
   - Concluir compra de carrinho já concluído
   - Cancelar compra de carrinho já cancelado
   - Adicionar produto a carrinho concluído

## ⚡ Testes de Performance

### 📊 Métricas a Validar

1. **Tempo de Resposta (Response Time)**
   - Login deve responder em < 2 segundos
   - Criar usuário deve responder em < 3 segundos
   - Criar produto deve responder em < 3 segundos
   - Criar carrinho deve responder em < 3 segundos
   - Listar produtos deve responder em < 2 segundos
   - Listar usuários deve responder em < 2 segundos

2. **Throughput (Taxa de Transferência)**
   - Número de requisições por segundo que a API suporta
   - Validar capacidade de processamento

3. **Carga (Load Testing)**
   - Múltiplas requisições simultâneas
   - Validar comportamento sob carga
   - Validar degradação gradual

4. **Stress Testing**
   - Testar limites da API
   - Validar comportamento em sobrecarga
   - Validar recuperação após sobrecarga

### 🔧 Implementação Sugerida

#### Exemplo de Teste de Performance com Cypress:

```javascript
// cypress/e2e/api/performance/login.cy.js
describe('Performance - Login', () => {
  it('Deve responder em menos de 2 segundos', () => {
    const startTime = Date.now()
    
    cy.login('email@teste.com', 'senha123').then((response) => {
      const responseTime = Date.now() - startTime
      
      expect(response.status).to.eq(200)
      expect(responseTime).to.be.lessThan(2000) // 2 segundos
    })
  })
  
  it('Deve suportar múltiplas requisições simultâneas', () => {
    const requests = []
    const numRequests = 10
    
    for (let i = 0; i < numRequests; i++) {
      requests.push(cy.login(`user${i}@teste.com`, 'senha123'))
    }
    
    cy.then(() => {
      // Validar que todas as requisições foram concluídas
      expect(requests.length).to.eq(numRequests)
    })
  })
})
```

#### Exemplo de Teste de Performance para Listagem:

```javascript
// cypress/e2e/api/performance/produtos.cy.js
describe('Performance - Produtos', () => {
  it('Deve listar produtos em menos de 2 segundos', () => {
    const startTime = Date.now()
    
    cy.listarProdutos().then((response) => {
      const responseTime = Date.now() - startTime
      
      expect(response.status).to.eq(200)
      expect(responseTime).to.be.lessThan(2000)
    })
  })
  
  it('Deve validar tamanho da resposta', () => {
    cy.listarProdutos().then((response) => {
      // Validar que a resposta não é muito grande
      const responseSize = JSON.stringify(response.body).length
      expect(responseSize).to.be.lessThan(1000000) // 1MB
    })
  })
})
```

## 📝 Priorização de Implementação

### Alta Prioridade (Testes Negativos):
1. ✅ Validação de formatos de email
2. ✅ Validação de tipos de dados incorretos
3. ✅ Validação de campos obrigatórios (já implementado parcialmente)
4. ✅ Validação de limites (valores negativos, zero, etc.)
5. ✅ Testes de autorização (token inválido/expirado)

### Média Prioridade (Testes Negativos):
1. ⚠️ Testes de segurança (SQL Injection, XSS)
2. ⚠️ Validação de limites máximos/mínimos
3. ⚠️ Validação de estados inválidos

### Baixa Prioridade (Testes de Performance):
1. ⚠️ Testes de tempo de resposta
2. ⚠️ Testes de carga
3. ⚠️ Testes de stress

## 🛠️ Ferramentas Recomendadas para Performance

1. **Cypress** (já em uso)
   - Para testes básicos de performance
   - Validação de tempo de resposta

2. **Artillery** (recomendado para carga)
   - Testes de carga mais robustos
   - Relatórios detalhados de performance

3. **k6** (alternativa)
   - Testes de performance em JavaScript
   - Boa integração com CI/CD

## 📌 Notas Importantes

- Testes de performance devem ser executados em ambiente isolado
- Não executar testes de carga em APIs públicas sem permissão
- Considerar rate limiting da API Serverest
- Testes de segurança devem ser executados com cuidado
- Sempre validar que os testes não causam impacto negativo na API


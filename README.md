# Desafio API QA - Automação de Testes

Projeto de automação de testes de API utilizando Cypress para a API pública [Serverest](https://serverest.dev/).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Cenários de Teste](#cenários-de-teste)
- [Instalação](#instalação)
- [Como Executar os Testes](#como-executar-os-testes)
- [Configuração do Cypress](#configuração-do-cypress)
- [Tratamento de Erros](#tratamento-de-erros)
- [Resultados dos Testes](#resultados-dos-testes)
- [CI/CD - GitHub Actions](#cicd---github-actions)
- [Boas Práticas Implementadas](#boas-práticas-implementadas)
- [Manutenção](#manutenção)

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para automação de testes de API. O objetivo é demonstrar conhecimento em:

- Automação de testes de API REST
- Uso de Cypress para testes de API
- Organização e estruturação de projetos de teste
- Boas práticas de automação
- Documentação de cenários de teste
- Testes de performance e segurança
- Testes negativos e validação de erros
- Integração contínua (CI/CD)

## 🛠 Tecnologias Utilizadas

- **Cypress** - Framework de automação de testes
- **JavaScript** - Linguagem de programação
- **Node.js** - Ambiente de execução
- **GitHub Actions** - CI/CD e automação de workflows
- **Allure Reports** - Geração de relatórios HTML detalhados

## 📁 Estrutura do Projeto

```
desafio-api-QA/
├── .github/
│   └── workflows/
│       └── cypress-tests.yml      # Workflow do GitHub Actions
├── cypress/
│   ├── e2e/
│   │   └── api/
│   │       ├── login.cy.js                    # Testes críticos de Login
│   │       ├── login.negativos.cy.js          # Testes negativos de Login
│   │       ├── usuarios.cy.js                 # Testes críticos de Usuários
│   │       ├── usuarios.negativos.cy.js       # Testes negativos de Usuários
│   │       ├── produtos.cy.js                 # Testes críticos de Produtos
│   │       ├── produtos.negativos.cy.js       # Testes negativos de Produtos
│   │       ├── carrinhos.cy.js                # Testes críticos de Carrinhos
│   │       ├── performance.cy.js              # Testes de Performance
│   │       └── seguranca.cy.js                # Testes de Segurança
│   └── support/
│       ├── commands.js            # Custom Commands reutilizáveis
│       ├── helpers.js             # Funções auxiliares
│       └── e2e.js                 # Configurações globais
├── .gitignore                     # Arquivos ignorados pelo Git
├── cypress.config.js              # Configuração do Cypress
├── cypress.env.json               # Variáveis de ambiente
├── package.json                   # Dependências do projeto
└── README.md                      # Documentação
```

## 📝 Cenários de Teste

### 🔐 Login

#### Cenários Críticos Automatizados:

1. **Login com credenciais válidas**
   - **Objetivo**: Validar que o sistema autentica corretamente um usuário com credenciais válidas e retorna um token de acesso
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

2. **Login com credenciais inválidas**
   - **Objetivo**: Validar que o sistema rejeita corretamente tentativas de login com credenciais inválidas
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

#### Cenários Adicionais Levantados:

3. Login sem preencher email
4. Login sem preencher senha
5. Login sem preencher email e senha
6. Login com email em formato inválido
7. Login com senha muito curta
8. Login com email inexistente
9. Login com senha correta mas email incorreto
10. Login com email correto mas senha incorreta
11. Validação de expiração de token (se aplicável)
12. Validação de formato do token retornado

### 👥 Usuários

#### Cenários Críticos Automatizados:

1. **Criar usuário com dados válidos**
   - **Objetivo**: Validar que o sistema cria corretamente um novo usuário quando todos os dados são válidos
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

2. **Buscar usuário por ID**
   - **Objetivo**: Validar que o sistema retorna corretamente os dados de um usuário quando buscado por ID
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

#### Cenários Adicionais Levantados:

3. Criar usuário com email duplicado
4. Criar usuário sem nome (campo obrigatório)
5. Criar usuário sem email (campo obrigatório)
6. Criar usuário sem senha (campo obrigatório)
7. Criar usuário sem campo administrador
8. Criar usuário com email em formato inválido
9. Criar usuário com senha muito curta
10. Criar usuário com senha muito longa
11. Buscar usuário inexistente
12. Buscar usuário com ID inválido
13. Listar todos os usuários
14. Listar usuários com filtros (se disponível)
15. Atualizar usuário existente
16. Atualizar usuário inexistente
17. Atualizar usuário sem autenticação
18. Deletar usuário existente
19. Deletar usuário inexistente
20. Deletar usuário sem autenticação
21. Validar campos obrigatórios na atualização
22. Validar unicidade de email na atualização

### 🛍️ Produtos

#### Cenários Críticos Automatizados:

1. **Criar produto com dados válidos**
   - **Objetivo**: Validar que o sistema cria corretamente um novo produto quando todos os dados são válidos e o usuário está autenticado
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

2. **Buscar produto por ID**
   - **Objetivo**: Validar que o sistema retorna corretamente os dados de um produto quando buscado por ID
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

#### Cenários Adicionais Levantados:

3. Criar produto sem autenticação
4. Criar produto sem nome (campo obrigatório)
5. Criar produto sem preço (campo obrigatório)
6. Criar produto sem descrição (campo obrigatório)
7. Criar produto sem quantidade (campo obrigatório)
8. Criar produto com preço negativo
9. Criar produto com preço zero
10. Criar produto com quantidade negativa
11. Criar produto com quantidade zero
12. Criar produto com nome muito longo
13. Criar produto com descrição muito longa
14. Buscar produto inexistente
15. Buscar produto com ID inválido
16. Listar todos os produtos
17. Listar produtos com filtros (nome, preço, etc.)
18. Listar produtos com paginação (se disponível)
19. Atualizar produto existente
20. Atualizar produto inexistente
21. Atualizar produto sem autenticação
22. Deletar produto existente
23. Deletar produto inexistente
24. Deletar produto sem autenticação
25. Validar campos obrigatórios na atualização
26. Validar que produto deletado não pode ser encontrado
27. Validar que produto deletado não pode ser atualizado

### 🛒 Carrinhos

#### Cenários Críticos Automatizados:

1. **Criar carrinho com produtos válidos**
   - **Objetivo**: Validar que o sistema cria corretamente um carrinho de compras com produtos quando o usuário está autenticado
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

2. **Buscar carrinho por ID**
   - **Objetivo**: Validar que o sistema retorna corretamente os dados de um carrinho quando buscado por ID
   - **Criticidade**: ALTA
   - **Status**: ✅ Automatizado

#### Cenários Adicionais Levantados:

3. Criar carrinho sem autenticação
4. Criar carrinho sem produtos (vazio)
5. Criar carrinho com produto inexistente
6. Criar carrinho com quantidade zero
7. Criar carrinho com quantidade negativa
8. Criar carrinho com quantidade maior que estoque disponível
9. Criar carrinho com múltiplos produtos
10. Criar carrinho com produto duplicado
11. Buscar carrinho inexistente
12. Buscar carrinho com ID inválido
13. Buscar carrinho sem autenticação
14. Listar carrinhos do usuário autenticado
15. Listar carrinhos sem autenticação
16. Atualizar quantidade de produto no carrinho (se disponível)
17. Adicionar produto ao carrinho existente (se disponível)
18. Remover produto do carrinho (se disponível)
19. Concluir compra (finalizar carrinho)
20. Concluir compra sem autenticação
21. Concluir compra com carrinho vazio
22. Cancelar compra (deletar carrinho)
23. Cancelar compra sem autenticação
24. Validar cálculo de preço total do carrinho
25. Validar cálculo de quantidade total do carrinho
26. Validar que carrinho concluído não pode ser modificado
27. Validar que carrinho cancelado não pode ser encontrado
28. Validar limite de produtos no carrinho (se houver)
29. Validar que produto deletado não pode ser adicionado ao carrinho

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd desafio-api-QA
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar os Testes

### Executar todos os testes (modo headless)

```bash
npm run cy:run
```

### Executar todos os testes (modo headed - com interface gráfica)

```bash
npm run cy:run:headed
```

### Abrir o Cypress Test Runner (interface interativa)

```bash
npm run cy:open
```

### Executar apenas os testes de API

```bash
npm run test:api
```

### Executar um arquivo de teste específico

```bash
# Testes de Login
npx cypress run --spec "cypress/e2e/api/login.cy.js"

# Testes de Usuários
npx cypress run --spec "cypress/e2e/api/usuarios.cy.js"

# Testes de Produtos
npx cypress run --spec "cypress/e2e/api/produtos.cy.js"

# Testes de Carrinhos
npx cypress run --spec "cypress/e2e/api/carrinhos.cy.js"

# Testes Negativos de Login
npx cypress run --spec "cypress/e2e/api/login.negativos.cy.js"

# Testes Negativos de Usuários
npx cypress run --spec "cypress/e2e/api/usuarios.negativos.cy.js"

# Testes Negativos de Produtos
npx cypress run --spec "cypress/e2e/api/produtos.negativos.cy.js"

# Testes de Performance
npx cypress run --spec "cypress/e2e/api/performance.cy.js"

# Testes de Segurança
npx cypress run --spec "cypress/e2e/api/seguranca.cy.js"
```

### Gerar e Visualizar Relatório Allure

Após executar os testes, você pode gerar e visualizar o relatório Allure:

```bash
# Gerar relatório Allure
npm run allure:generate

# Abrir relatório no navegador
npm run allure:open

# Ou servir relatório diretamente (sem gerar arquivo)
npm run allure:serve
```

## ⚙️ Configuração do Cypress

O projeto está configurado para testes de API com as seguintes configurações:

### Base URL

A URL base da API está configurada em `cypress.config.js`:

```javascript
baseUrl: 'https://serverest.dev'
```

### Timeouts

Configurações de timeout para garantir que os testes tenham tempo suficiente para executar:

- **`defaultCommandTimeout`**: 10000ms (10 segundos) - Tempo máximo para comandos do Cypress
- **`execTimeout`**: 60000ms (60 segundos) - Tempo máximo para execução de testes
- **`requestTimeout`**: 10000ms (10 segundos) - Tempo máximo para requisições HTTP
- **`responseTimeout`**: 10000ms (10 segundos) - Tempo máximo para receber resposta

### Vídeos e Screenshots

- Vídeos desabilitados para testes de API (economia de recursos)
- Screenshots capturados automaticamente em caso de falha

## 🐛 Tratamento de Erros

O projeto inclui tratamento para erros comuns:

- **Validações robustas** com timeouts adequados
- **Custom Commands** para validação de respostas de sucesso e erro
- **Testes negativos** para validar comportamento da API em cenários de erro
- **Tratamento de exceções** em requisições HTTP
- **Validação de estrutura de resposta** antes de acessar propriedades
- **Mensagens de erro descritivas** para facilitar debugging

## 📊 Resultados dos Testes

### Execução Completa dos Testes

Todos os testes foram executados com sucesso! Abaixo estão os resultados da execução completa:

### Resumo da Execução

| Arquivo de Teste              | Testes | Passando | Falhando |
| ----------------------------- | ------ | -------- | -------- |
| login.cy.js                   | 2      | ✅ 2      | -        |
| login.negativos.cy.js         | 10+    | ✅ 10+    | -        |
| usuarios.cy.js                | 6      | ✅ 6      | -        |
| usuarios.negativos.cy.js      | 10+    | ✅ 10+    | -        |
| produtos.cy.js                | 7      | ✅ 7      | -        |
| produtos.negativos.cy.js      | 10+    | ✅ 10+    | -        |
| carrinhos.cy.js               | 8      | ✅ 8      | -        |
| performance.cy.js             | 10+    | ✅ 10+    | -        |
| seguranca.cy.js               | 10+    | ✅ 10+    | -        |
| **TOTAL**                     | **80+**| **✅ 80+**| **0**    |

### Estatísticas

- ✅ **100% de taxa de sucesso** - Todos os testes passaram
- 📦 **9 arquivos de teste** executados
- 🎯 **0 falhas** - Projeto totalmente funcional
- 🔒 **Testes de segurança** implementados
- ⚡ **Testes de performance** implementados
- ❌ **Testes negativos** abrangentes

### Categorias de Testes

1. **Testes Críticos**: 8 cenários críticos automatizados (2 por funcionalidade)
2. **Testes Negativos**: Validação de erros, campos inválidos, formatos incorretos
3. **Testes de Performance**: Validação de tempo de resposta da API
4. **Testes de Segurança**: Validação de proteção contra SQL Injection e XSS

### Relatórios

Após a execução dos testes, você encontrará:

- **Screenshots**: Em `cypress/screenshots/` (capturados em caso de falha)

### Relatórios no GitHub Actions

Os testes executados via GitHub Actions geram automaticamente:

- ✅ **Relatório Allure** - Relatório HTML completo com gráficos e estatísticas
- ✅ Artifacts com screenshots em caso de falha
- ✅ Status de execução visível no PR
- ✅ Logs detalhados de execução

**Para visualizar o relatório Allure:**
1. Acesse a aba "Actions" no GitHub
2. Selecione a execução do workflow
3. Baixe o artifact "allure-report"
4. Extraia e abra o arquivo `index.html` no navegador

## 🔄 CI/CD - GitHub Actions

O projeto inclui pipeline automatizado de CI/CD configurado para **execução manual sob demanda**.

### Workflow de Testes

**Arquivo:** `.github/workflows/cypress-tests.yml`

### Estratégia de CI/CD: Execução Manual

A decisão de usar execução manual ao invés de automática a cada push foi tomada considerando:

1. **Economia de Recursos e Custos** 💰
   * Evita consumo desnecessário de minutos do GitHub Actions
   * Reduz custos em projetos com muitos commits/pushes
   * Permite controle sobre quando utilizar recursos do CI/CD

2. **Testes Locais como Primeira Linha de Defesa** 🛡️
   * Testes locais são executados ANTES do push (`npm run cy:run`)
   * Desenvolvedor valida código localmente antes de enviar
   * Falhas são detectadas e corrigidas localmente

3. **Execução sob Demanda para Prioridades Específicas** 🎯
   * Workflow disponível para execução manual quando necessário
   * Ideal para validações específicas e prioridades do sistema
   * Permite executar testes em momentos estratégicos

### Configuração do Workflow

O workflow está configurado com:

1. **Execução Manual Apenas**
   * Disparado apenas via `workflow_dispatch` (interface do GitHub)
   * Não executa automaticamente em push
   * Controle total sobre quando executar

2. **Node.js 18**
   * Utiliza Node.js versão 18
   * Cache de dependências npm para execução mais rápida

3. **Validação de Qualidade de Código**
   * Execução de todos os testes automatizados
   * Garante que código segue padrões estabelecidos
   * Mantém consistência do código

4. **Artifacts para Debug**
   * Screenshots em caso de falha
   * Facilita identificação e correção de problemas

### Como Executar o Workflow Manualmente

1. Acesse a aba **"Actions"** no repositório GitHub
2. Selecione o workflow **"Cypress Tests - CI/CD"**
3. Clique em **"Run workflow"**
4. Selecione a branch (geralmente `main`)
5. Clique em **"Run workflow"** novamente

O workflow executará todos os testes e você poderá acompanhar o progresso em tempo real.

### Quando Usar o Workflow Manual

Recomenda-se executar o workflow manualmente em situações como:

* 🎯 **Antes de releases importantes**
* 🎯 **Antes de merges críticos**
* 🎯 **Validações periódicas do sistema**
* 🎯 **Após mudanças significativas no código**
* 🎯 **Validações de regressão**
* 🎯 **Testes de integração completos**

### Status dos Testes

Você pode verificar o status dos testes através da aba "Actions" do repositório.

## ✨ Boas Práticas Implementadas

### 1. Custom Commands
- Criação de comandos customizados reutilizáveis para todas as operações da API
- Evita duplicação de código
- Facilita manutenção e atualização
- Comandos disponíveis: `login`, `criarUsuario`, `buscarUsuario`, `listarUsuarios`, `atualizarUsuario`, `deletarUsuario`, `criarProduto`, `buscarProduto`, `listarProdutos`, `atualizarProduto`, `deletarProduto`, `criarCarrinho`, `buscarCarrinho`, `listarCarrinhos`, `concluirCompra`, `cancelarCompra`, `validarRespostaSucesso`, `validarRespostaErro`

### 2. Helpers e Utilitários
- Funções auxiliares para geração de dados de teste
- Geração dinâmica de emails, nomes e dados de usuários/produtos
- Facilita criação de dados únicos para cada execução
- Funções disponíveis: `gerarEmailAleatorio`, `gerarNomeAleatorio`, `gerarDadosUsuario`, `gerarDadosProduto`

### 3. Organização de Código
- Separação clara de responsabilidades
- Estrutura de pastas organizada
- Comentários explicativos em todo o código
- Separação entre testes críticos, negativos, performance e segurança

### 4. Validações Robustas
- Validação de status HTTP
- Validação de estrutura de resposta
- Validação de dados retornados
- Comandos customizados para validação de sucesso e erro
- Validação de tipos de dados
- Validação de campos obrigatórios

### 5. Tratamento de Erros
- Testes de cenários de erro
- Validação de mensagens de erro
- Tratamento adequado de exceções
- Testes negativos abrangentes
- Validação de códigos de status HTTP apropriados

### 6. Configuração Centralizada
- Variáveis de ambiente em `cypress.env.json`
- Configurações centralizadas em `cypress.config.js`
- Fácil manutenção e alteração de configurações
- Base URL configurada centralmente

### 7. Documentação
- README completo e detalhado
- Comentários no código explicando cada cenário
- Documentação de todos os cenários levantados
- Instruções claras de instalação e execução

### 8. Estrutura BDD (Behavior-Driven Development)
- Implementação do padrão Given-When-Then (Dado-Quando-Então) em todos os testes
- Uso de `cy.step()` para documentar cada etapa do cenário de teste
- Melhora a rastreabilidade e legibilidade dos testes
- Facilita a comunicação entre equipes técnicas e de negócio

### 9. Boas Práticas de Teste
- Testes independentes (cada teste pode rodar isoladamente)
- Setup e teardown adequados
- Uso de hooks (before, after) quando necessário
- Dados de teste gerados dinamicamente
- Isolamento de testes para evitar dependências

### 10. Testes de Performance
- Validação de tempo de resposta da API
- Testes de múltiplas requisições sequenciais
- Validação de limites de tempo aceitáveis
- Identificação de possíveis gargalos

### 11. Testes de Segurança
- Validação de proteção contra SQL Injection
- Validação de proteção contra Cross-Site Scripting (XSS)
- Testes de autenticação e autorização
- Validação de sanitização de inputs

### 12. Testes Negativos Abrangentes
- Validação de campos obrigatórios
- Validação de formatos inválidos
- Validação de tipos incorretos
- Validação de valores limites
- Validação de dados duplicados
- Validação de recursos inexistentes

## 🔧 Manutenção

### Adicionar Novos Testes

1. Crie um novo arquivo em `cypress/e2e/api/` seguindo o padrão `*.cy.js`
2. Use os Custom Commands disponíveis em `cypress/support/commands.js`
3. Use os Helpers disponíveis em `cypress/support/helpers.js`
4. Siga o padrão BDD (Given/When/Then) com `cy.step()`

### Adicionar Novos Commands

1. Adicione o command em `cypress/support/commands.js`
2. Documente o command com comentários
3. Inclua exemplos de uso
4. Garanta que retorne `cy.wrap()` para permitir encadeamento

### Adicionar Novos Helpers

1. Adicione a função em `cypress/support/helpers.js`
2. Exporte via `Cypress.helpers`
3. Documente a função com comentários
4. Inclua exemplos de uso

### Executar Testes Específicos

Para executar apenas um arquivo de teste específico:

```bash
npx cypress run --spec "cypress/e2e/api/nome-do-arquivo.cy.js"
```

## 📊 Resumo dos Cenários

| Funcionalidade | Cenários Críticos Automatizados | Cenários Adicionais Levantados | Testes Negativos | Testes Performance | Testes Segurança | Total |
|---------------|--------------------------------|-------------------------------|------------------|-------------------|------------------|-------|
| Login          | 2                              | 10                            | ✅ 10+            | -                 | ✅ 10+            | 32+   |
| Usuários       | 2                              | 20                            | ✅ 10+            | -                 | ✅ 10+            | 42+   |
| Produtos       | 2                              | 25                            | ✅ 10+            | ✅ 10+             | ✅ 10+            | 57+   |
| Carrinhos      | 2                              | 27                            | -                | ✅ 10+             | -                | 39+   |
| **TOTAL**      | **8**                          | **82**                        | **✅ 30+**        | **✅ 20+**         | **✅ 30+**        | **170+** |

## 🔍 Observações

- Todos os testes foram desenvolvidos seguindo as melhores práticas de automação
- O código está bem comentado e documentado
- Os Custom Commands facilitam a reutilização e manutenção
- A estrutura permite fácil expansão para novos cenários
- Os testes são independentes e podem ser executados em qualquer ordem
- Testes de performance e segurança foram implementados para garantir qualidade
- Testes negativos abrangentes garantem robustez da validação

## 📝 Notas sobre a API

A API Serverest é uma API pública para testes que simula um e-commerce. Ela permite:

- Cadastro e autenticação de usuários
- Gerenciamento de produtos
- Criação e gerenciamento de carrinhos de compra

**URL Base**: https://serverest.dev

**Documentação**: https://serverest.dev/

## 👤 Autor

**Joab Alexandre da Cruz**

Desenvolvido como parte do desafio técnico para vaga de QA Automation.

## 📄 Licença

Este projeto é privado e foi desenvolvido exclusivamente para fins de avaliação técnica.

---
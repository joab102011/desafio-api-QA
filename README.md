# Desafio API QA - Automação de Testes

Projeto de automação de testes de API utilizando Cypress para a API pública [Serverest](https://serverest.dev/).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Cenários de Teste](#cenários-de-teste)
- [Instalação](#instalação)
- [Como Executar os Testes](#como-executar-os-testes)
- [Boas Práticas Implementadas](#boas-práticas-implementadas)

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para automação de testes de API. O objetivo é demonstrar conhecimento em:

- Automação de testes de API
- Uso de Cypress para testes de API
- Organização e estruturação de projetos de teste
- Boas práticas de automação
- Documentação de cenários de teste

## 🛠 Tecnologias Utilizadas

- **Cypress** - Framework de automação de testes
- **JavaScript** - Linguagem de programação
- **Node.js** - Ambiente de execução

## 📁 Estrutura do Projeto

```
desafio-api-QA/
├── cypress/
│   ├── e2e/
│   │   └── api/
│   │       ├── login.cy.js          # Testes de Login
│   │       ├── usuarios.cy.js        # Testes de Usuários
│   │       ├── produtos.cy.js        # Testes de Produtos
│   │       └── carrinhos.cy.js       # Testes de Carrinhos
│   └── support/
│       ├── commands.js               # Custom Commands
│       ├── helpers.js                # Funções auxiliares
│       └── e2e.js                    # Configurações globais
├── cypress.config.js                 # Configuração do Cypress
├── cypress.env.json                  # Variáveis de ambiente
├── package.json                      # Dependências do projeto
└── README.md                         # Documentação
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
npx cypress run --spec "cypress/e2e/api/login.cy.js"
```

### Executar testes de uma funcionalidade específica

```bash
# Testes de Login
npx cypress run --spec "cypress/e2e/api/login.cy.js"

# Testes de Usuários
npx cypress run --spec "cypress/e2e/api/usuarios.cy.js"

# Testes de Produtos
npx cypress run --spec "cypress/e2e/api/produtos.cy.js"

# Testes de Carrinhos
npx cypress run --spec "cypress/e2e/api/carrinhos.cy.js"
```

## ✨ Boas Práticas Implementadas

### 1. Custom Commands
- Criação de comandos customizados reutilizáveis para todas as operações da API
- Evita duplicação de código
- Facilita manutenção e atualização

### 2. Helpers e Utilitários
- Funções auxiliares para geração de dados de teste
- Geração dinâmica de emails, nomes e dados de usuários/produtos
- Facilita criação de dados únicos para cada execução

### 3. Organização de Código
- Separação clara de responsabilidades
- Estrutura de pastas organizada
- Comentários explicativos em todo o código

### 4. Validações Robustas
- Validação de status HTTP
- Validação de estrutura de resposta
- Validação de dados retornados
- Comandos customizados para validação de sucesso e erro

### 5. Tratamento de Erros
- Testes de cenários de erro
- Validação de mensagens de erro
- Tratamento adequado de exceções

### 6. Configuração Centralizada
- Variáveis de ambiente em `cypress.env.json`
- Configurações centralizadas em `cypress.config.js`
- Fácil manutenção e alteração de configurações

### 7. Documentação
- README completo e detalhado
- Comentários no código explicando cada cenário
- Documentação de todos os cenários levantados

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

## 📊 Resumo dos Cenários

| Funcionalidade | Cenários Críticos Automatizados | Cenários Adicionais Levantados | Total |
|---------------|--------------------------------|-------------------------------|-------|
| Login          | 2                              | 10                            | 12    |
| Usuários       | 2                              | 20                            | 22    |
| Produtos       | 2                              | 25                            | 27    |
| Carrinhos      | 2                              | 27                            | 29    |
| **TOTAL**      | **8**                          | **82**                        | **90** |

## 🔍 Observações

- Todos os testes foram desenvolvidos seguindo as melhores práticas de automação
- O código está bem comentado e documentado
- Os Custom Commands facilitam a reutilização e manutenção
- A estrutura permite fácil expansão para novos cenários
- Os testes são independentes e podem ser executados em qualquer ordem

## 📝 Notas sobre a API

A API Serverest é uma API pública para testes que simula um e-commerce. Ela permite:
- Cadastro e autenticação de usuários
- Gerenciamento de produtos
- Criação e gerenciamento de carrinhos de compra

**URL Base**: https://serverest.dev

## 👨‍💻 Autor

Desenvolvido como parte de um desafio técnico de automação de testes.

---

**Desafio concluído com sucesso! ✅**

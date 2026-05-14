# Relato

GitHub: https://github.com/Antonio-Marcos-Goulart/catalogo-produtos-climba

Sistema online: https://catalogo-produtos-climba.onrender.com

Swagger: https://catalogo-produtos-climba.onrender.com/swagger

## Credenciais para login

- Email: `acesso@email.com`
- Senha: `useraAcessCl1`

## Como organizei o desenvolvimento

Organizei o desenvolvimento dividindo o projeto entre backend, frontend, integracao da API e deploy. Comecei pela modelagem das entidades e implementacao das regras de negocio, depois desenvolvi os endpoints da API, a interface web e finalizei com autenticacao, documentacao e publicacao online.

## Tecnologias utilizadas

### Backend

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Zod
- Swagger
- JWT

### Frontend

- HTML
- CSS
- JavaScript

### Publicacao

- Render na aplicacao
- Neon no banco de dados

## Apoio durante o desenvolvimento

Durante o desenvolvimento, utilizei o Codex como apoio em tarefas como organizacao estrutural, criação, autenticacao, integracao entre frontend e backend, documentacao e deploy.

## Pontos relevantes

- Organizei o backend em arquitetura em camadas, separando rotas, controllers, services, repositories, schemas e models.
- Aprofundei o entendimento sobre relacionamentos entre entidades no TypeORM.
- Aprendi melhor as diferencas de uso entre `findOne` e `findOneBy`.
- Utilizei transacoes com `transactionManager` para garantir consistencia nas movimentacoes de estoque.
- Alem do escopo obrigatorio, adicionei funcionalidades extras como reversao de movimentacoes com validacoes para impedir reversoes invalidas.

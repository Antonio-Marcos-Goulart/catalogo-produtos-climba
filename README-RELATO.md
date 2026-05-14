# Relato

## Como me organizei para entregar o teste

Me organizei dividindo o desenvolvimento entre backend, frontend, integração da API e deploy, utilizando como referência estrutural uma arquitetura em camadas. Iniciei pela modelagem das entidades principais do domínio, depois implementei as regras de negócio e os endpoints da API, avancei para a interface web e finalizei com os ajustes de autenticação, documentação e publicação online. Também realizei testes durante o desenvolvimento para validar o funcionamento da aplicação.

## Ferramentas e tecnologias utilizadas

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

### Publicação

- Render para hospedagem da aplicação
- Neon para hospedagem do banco de dados PostgreSQL

### Apoio no desenvolvimento

Durante o desenvolvimento, utilizei o Codex como ferramenta de apoio em tarefas como configuração do ambiente, ajustes de estrutura, organização de importações, criação e revisão de arquivos, apoio na estilização do frontend, ajustes em JavaScript, integração entre frontend e backend, autenticação, documentação com Swagger e apoio no processo de deploy.

Além disso, também recorri a pesquisas complementares para resolver pontos específicos de configuração e publicação da aplicação em ambiente online.

## Decisões consideradas relevantes

- Uso de uma base arquitetural já consolidada, com referência também em estruturas e aprendizados aplicados ao longo do TCC, adaptada para o contexto de catálogo de produtos com controle de estoque.
- Organização do backend em camadas, separando rotas, controllers, services, repositories, schemas e models, o que ajudou a manter mais clareza e consistência no desenvolvimento.
- Escolhi o TypeORM para facilitar a manipulação do banco de dados com mais produtividade e organização.
- Um dos pontos mais importantes no desenvolvimento foi aprofundar o entendimento sobre relacionamento entre classes no TypeScript com TypeORM, especialmente no uso de entidades relacionadas e consultas com `relations` dentro dos repositórios.
- Também foi importante diferenciar o uso de `findOneBy` e `findOne`, entendendo que `findOneBy` funciona melhor para buscas diretas por campos simples, enquanto `findOne` permite montar buscas mais completas com relacionamentos, filtros mais elaborados e outras configurações da consulta.
- Utilizei o Zod para validar e tipar os dados recebidos pela aplicação, reduzindo o risco de inconsistências.
- Implementei autenticação com JWT e armazenamento seguro de senha com bcryptjs.
- Nas movimentações de estoque, um aprendizado relevante foi o uso do `transactionManager` no TypeORM dentro da camada de service, permitindo executar mais de uma operação dentro da mesma transação, como atualizar o estoque do produto e criar a movimentação ao mesmo tempo. Dessa forma, se todas as etapas forem concluídas com sucesso, os dados são salvos; caso ocorra alguma falha, a operação é interrompida e a exceção é lançada, evitando inconsistências no banco.
- Além disso, nas movimentações de estoque apliquei atualização automática da quantidade disponível do produto e proteções com transações e bloqueio pessimista para evitar inconsistências em cenários sensíveis, como reversão de movimentação.
- Mantive a documentação da API integrada com Swagger na rota `/swagger`, facilitando testes e consulta dos endpoints.
- No frontend, optei por uma interface simples, funcional e organizada em arquivos separados por responsabilidade.
- Além do escopo obrigatório, adicionei funcionalidades extras como login, dashboard com métricas, alerta visual de estoque baixo e reversão de movimentações com bloqueio para impedir reversões inválidas.

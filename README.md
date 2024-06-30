# Daily Diet API
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

> API para controle de dieta diária.

## Como rodar local

### Com Docker compose:
```bash
cp .env.example .env
docker compose up
```

### Com Node.JS:
```bash
cp .env.example .env
npm install
npm run build
npm run knex -- migrate:latest
npm run start
```

## Regras da aplicação

- [X] Deve ser possível criar um usuário
- [X] Deve ser possível identificar o usuário entre as requisições
- [X] Deve ser possível registrar uma refeição feita, com as seguintes informações:

    *As refeições devem ser relacionadas a um usuário.*
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [X] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [X] Deve ser possível apagar uma refeição
- [X] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [X] Deve ser possível recuperar as métricas de um usuário
    - [X] Quantidade total de refeições registradas
    - [X] Quantidade total de refeições dentro da dieta
    - [X] Quantidade total de refeições fora da dieta
    - [X] Melhor sequência de refeições dentro da dieta
- [X] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou


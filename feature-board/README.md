# Feature Board

Sistema de votação de ideias para produtos desenvolvido com Next.js e NestJS.

## Tecnologias Utilizadas

- Frontend: Next.js
- Backend: NestJS
- Banco de Dados: SQLite
- ORM: TypeORM

## Funcionalidades

- Visualização de ideias de features
- Sistema de votação
- Atualizações em tempo real
- Interface responsiva

## Como Executar

1. Instale as dependências:
 cd .\feature-board\
   ```bash
   npm install
   ```

2.  O banco já se encontra populado com dados iniciais devido a teste, onde algumas das ideias já se encontra com votos (db.sqlite), ir para a etapa 3
   ```bash
   npm run seed
   ```
obs : Caso venha executar essa etapa os votos serão zerados

3. Inicie o projeto:
   ```bash
   npm start
   ```

O sistema estará disponível em:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000

Para a exibição em um Browser o terminal irá mostrar a url local http://localhost:3001


## Estrutura do Projeto

```
feature-board/
├── src/
│   ├── ideas/         # Módulo de ideias (NestJS)
│   ├── pages/         # Páginas do Next.js
│   ├── services/      # Serviços de API
│   └── database/      # Configurações do banco
```

## Scripts Disponíveis

- `npm run dev`: Inicia o projeto em modo desenvolvimento
- `npm run seed`: Popula o banco com dados iniciais
- `npm run build`: Compila o projeto
- `npm start`: Inicia o projeto em produção

## Incrementação 

Inseri um Ranking logo no final da página, para exibir qual a ideia que está tendo mais voto no momento, o ranking é dinamico, visto que assim que um voto é dado as posições são alteradas em tempo real.

## Autor

Jessica Gross

## Licença

ISC

# Arquitetura do Feature Board

## Back-end
A validação e proteção das rotas foi implementada usando:
- **Guards do NestJS**: Utilizamos `@UseGuards(AuthGuard)` para proteção de rotas sensíveis (criação de ideias)
- **DTOs com class-validator**: Para validação de dados de entrada
- **Padrão Repository**: Escolhido por encapsular a lógica de acesso a dados e facilitar testes

O padrão Module do NestJS foi usado por:
- Melhor organização do código
- Injeção de dependências nativa
- Separação clara de responsabilidades

## Front-end (Performance)

### Estratégia de Renderização
Escolhi **Server-Side Rendering (SSR)** através do `getServerSideProps` por:
- Dados são dinâmicos e mudam frequentemente (votos)
- **Otimização para Mecanismos de Busca (SEO)**: Como o conteúdo é renderizado no servidor, os motores de busca como Google conseguem indexar todo o conteúdo da página
- **First Contentful Paint (FCP) Otimizado**: O usuário vê o conteúdo mais rapidamente porque a página já vem pronta do servidor, sem precisar esperar o JavaScript carregar e processar os dados
- Dados iniciais carregados junto com HTML

## Front-end (Fluxo de Dados)

### Fluxo de Votação
1. Usuário clica em "Votar"
2. Front-end inicia otimistic update:
   ```typescript
   mutate(updatedIdeas, false); // Atualiza UI imediatamente
   ```
3. Requisição enviada ao backend
4. Após resposta, revalidação dos dados:
   ```typescript
   await mutate(); // Revalida dados do SWR
   ```

### Estratégia de Cache
Utilizamos **SWR (stale-while-revalidate)**, uma estratégia de gerenciamento de dados que:
- **Mostra dados em cache primeiro** (stale/antigo): Exibe imediatamente os dados armazenados em cache
- **Atualiza em segundo plano** (revalidate): Busca dados novos do servidor sem bloquear a interface
- **Atualiza automaticamente**: Quando os novos dados chegam, a interface é atualizada
- **Otimistic Updates**: Permite atualizar a interface antes mesmo da resposta do servidor
- **Tratamento de Erros**: Se a atualização falhar, volta ao estado anterior automaticamente

Benefícios desta abordagem:
- Interface sempre responsiva
- Dados sempre atualizados
- Melhor experiência do usuário
- Menor tempo de carregamento percebido

## Decisão Crítica

A decisão mais desafiadora foi **integrar Next.js e NestJS no mesmo projeto** porque:
1. Configurações TypeScript conflitantes
2. Diferentes necessidades de build
3. Complexidade de desenvolvimento

Solução:
- Separação clara de configs (tsconfig.json e tsconfig.nest.json)
- Scripts NPM específicos para cada parte
- **Uso de concurrently**: Ferramenta que permite rodar múltiplos comandos simultaneamente, possibilitando executar o servidor Next.js (front-end) e NestJS (back-end) ao mesmo tempo com um único comando:
  ```json
  "dev": "concurrently \"npm run dev:next\" \"npm run dev:nest\""
  ```
  Isso simplifica o desenvolvimento pois não precisamos abrir múltiplos terminais.

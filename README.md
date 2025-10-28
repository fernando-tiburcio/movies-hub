# Movies Hub

Aplicação moderna para explorar filmes usando a API do TMDB (The Movie Database).

## Projeto publicado para demonstração

- https://movies-hub-self-alpha.vercel.app/

## Funcionalidades

- **Filmes Populares**: listagem paginada com infinite scroll
- **Busca Global**: pesquisa por título com paginação
- **Favoritos**: salvar/remover no `localStorage` e página dedicada com ordenação
- **Detalhes**: carregamento on-demand de detalhes de filmes favoritados
- **Responsivo**: layouts otimizados para mobile, tablet e desktop
- **Modo Escuro**: segue a preferência do sistema automaticamente

## Requisitos

- Node.js 18+ e npm
- Conta no TMDB e credenciais de API

## Configuração

### 1) Obter credenciais no TMDB

1. Acesse `https://www.themoviedb.org/`
2. Crie uma conta e gere uma API Key (v3)
3. Opcionalmente gere um Bearer Token (v4)

### 2) Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
VITE_TMDB_API_KEY=coloque_sua_api_key_v3
VITE_TMDB_ACCESS_TOKEN=coloque_seu_bearer_token_v4_opcional
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

O serviço `TMDBService` lê essas variáveis via `import.meta.env` e envia a `api_key` e o header `Authorization` quando disponível.

### 3) Instalar dependências

```bash
npm install
```

### 4) Rodar o projeto

```bash
npm run dev
```

### 5) Build e servidor

```bash
npm run build
npm start
```

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento (React Router v7)
- `npm run build`: build de produção
- `npm start`: serve o build (`@react-router/serve`)
- `npm run typecheck`: gera tipos de rotas e roda `tsc`
- `npm test`: testes com Jest
- `npm run test:watch`: modo watch
- `npm run test:coverage`: relatório de cobertura

## Estrutura do Projeto

```
app/
├── app.css
├── components/
│   ├── Header.tsx           # Header com logo e busca
│   ├── MovieCard.tsx        # Card individual do filme
│   └── MovieGrid.tsx        # Grid responsivo com infinite scroll
├── Home/
│   └── index.tsx            # Página inicial (listagem)
├── hooks/
│   └── useFavorites.ts      # Hook utilitário para favoritos (se aplicável)
├── routes/
│   └── favorites.tsx        # Página de Favoritos com ordenação e remoção
├── services/
│   └── tmdb.ts              # Integração com TMDB (envs VITE_*)
├── store/
│   ├── favoritesSlice.ts    # Redux slice para favoritos (localStorage)
│   └── index.ts             # Store e hooks tipados
├── types/
│   └── movie.ts             # Tipos TypeScript
├── root.tsx                 # Root da aplicação (React Router v7)
├── routes.ts                # Definição/ajuda de rotas
└── utils/                   # Utilitários gerais

public/
├── favicon.ico
└── placeholder-poster.svg
```

## Tecnologias

- **React 19** e **React Router v7**
- **TypeScript**
- **Redux Toolkit** (persistência simples em `localStorage`)
- **Tailwind CSS v4**
- **Lucide React** (ícones)

## Cards de Filme

Cada card exibe poster (300px), nota (TMDB), botão de favorito, título, ano e sinopse (no hover, truncada). Em Favoritos, há botão de lixeira para remover diretamente.

## Favoritos

- Persistência em `localStorage` (`movies-hub-favorites`)
- Alternar favorito diretamente nos cards
- Página `/favorites` com ordenação por nome e nota

## Responsividade

- Mobile: 2 colunas
- Tablet: 3–4 colunas
- Desktop: 5–6 colunas

## Notas

- Imagens de poster são servidas via `https://image.tmdb.org/t/p/` (tamanhos `w300`, `w500`, `w780`).
- Quando um filme não possui poster, é usado um placeholder interno (`public/placeholder-poster.svg`). Substitua-o para personalizar a imagem.

## Licença

Uso educacional/demonstração. Ajuste conforme sua necessidade.

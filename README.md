# Movies Hub

Uma aplicação moderna para visualização de filmes usando a API do TMDB (The Movie Database).

## Funcionalidades

- 🎬 **Filmes Populares**: Visualize os filmes mais populares do momento
- 🔍 **Busca Global**: Pesquise filmes por título
- ❤️ **Sistema de Favoritos**: Marque filmes como favoritos (salvo no localStorage)
- 📱 **Design Responsivo**: Interface adaptada para todos os dispositivos
- 🌙 **Modo Escuro**: Suporte automático ao tema escuro
- ♾️ **Infinite Scroll**: Carregamento automático de mais filmes
- ⭐ **Avaliações TMDB**: Notas dos filmes diretamente do TMDB

## Configuração

### 1. Obter Chave da API do TMDB

1. Acesse [TMDB](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá para "API" no menu do usuário
4. Solicite uma chave de API
5. Copie sua chave de API

### 2. Configurar a Chave da API

Abra o arquivo `app/services/tmdb.ts` e substitua:

```typescript
const TMDB_API_KEY = "your_tmdb_api_key_here";
```

Pela sua chave real:

```typescript
const TMDB_API_KEY = "sua_chave_aqui";
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar o Projeto

```bash
npm run dev
```

## Estrutura do Projeto

```
app/
├── components/
│   ├── Header.tsx          # Header com logo e busca
│   ├── MovieCard.tsx       # Card individual do filme
│   └── MovieGrid.tsx       # Grid responsivo com infinite scroll
├── hooks/
│   └── useFavorites.ts     # Hook para gerenciar favoritos
├── services/
│   └── tmdb.ts             # Serviço para integração com TMDB
├── types/
│   └── movie.ts            # Tipos TypeScript para filmes
└── Home/
    └── index.tsx           # Componente principal da página home
```

## Tecnologias Utilizadas

- **React Router v7**: Roteamento
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones
- **TMDB API**: Dados dos filmes

## Funcionalidades dos Cards

Cada card de filme exibe:

- **Poster**: Imagem do filme (300px de largura)
- **Nota TMDB**: Avaliação com ícone de estrela
- **Botão de Favoritar**: Coração que muda de cor quando favoritado
- **Título**: Nome do filme
- **Ano**: Ano de lançamento
- **Sinopse**: Aparece no hover (truncada)

## Sistema de Favoritos

- Os favoritos são salvos no `localStorage` do navegador
- Persistem entre sessões
- Interface visual clara (coração preenchido quando favoritado)

## Responsividade

O grid se adapta automaticamente:

- **Mobile**: 2 colunas
- **Tablet**: 3-4 colunas
- **Desktop**: 5-6 colunas
- **Large Desktop**: 6 colunas

## Modo Escuro

O tema escuro é ativado automaticamente baseado nas preferências do sistema operacional do usuário.

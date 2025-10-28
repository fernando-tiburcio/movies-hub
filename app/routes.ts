import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("search", "routes/search.tsx"),
  route("movie/:movieId", "routes/movie.$movieId.tsx"),
  route("favorites", "routes/favorites.tsx"),
] satisfies RouteConfig;

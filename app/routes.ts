import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("movie/:movieId", "routes/movie.$movieId.tsx"),
] satisfies RouteConfig;

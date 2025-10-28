import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { MovieCard } from "../components/MovieCard";
import { useAppDispatch, useAppSelector } from "../store";
import { removeFavorite, toggleFavorite } from "../store/favoritesSlice";
import { TMDBService } from "../services/tmdb";
import type { Movie } from "../types/movie";
import { Trash2 } from "lucide-react";
import { Link } from "react-router";

type SortOption = "title-asc" | "title-desc" | "rating-asc" | "rating-desc";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((s) => s.favorites.ids);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<SortOption>("title-asc");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          favoriteIds.map((id) => TMDBService.getMovieDetails(id))
        );
        if (isMounted) setMovies(details);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [favoriteIds]);

  const sorted = useMemo(() => {
    const copy = [...movies];
    switch (sort) {
      case "title-asc":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return copy.sort((a, b) => b.title.localeCompare(a.title));
      case "rating-asc":
        return copy.sort((a, b) => a.vote_average - b.vote_average);
      case "rating-desc":
        return copy.sort((a, b) => b.vote_average - a.vote_average);
      default:
        return copy;
    }
  }, [movies, sort]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Favoritos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {favoriteIds.length}{" "}
                {favoriteIds.length === 1 ? "filme" : "filmes"}
              </p>
            </div>
            {favoriteIds.length > 0 && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  Ordenar por
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white"
                >
                  <option value="title-asc">Nome (A → Z)</option>
                  <option value="title-desc">Nome (Z → A)</option>
                  <option value="rating-asc">Nota (crescente)</option>
                  <option value="rating-desc">Nota (decrescente)</option>
                </select>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && favoriteIds.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sua lista de favoritos está vazia.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir para a Home
              </Link>
            </div>
          )}

          {!loading && favoriteIds.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sorted.map((movie) => (
                <div key={movie.id} className="relative">
                  {/* Usa MovieCard mas com ação de lixeira na página de favoritos */}
                  <MovieCard
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={() => dispatch(toggleFavorite(movie.id))}
                  />

                  {/* Botão de remover (lixeira) sobreposto no canto superior direito */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(removeFavorite(movie.id));
                    }}
                    aria-label="Remover dos favoritos"
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200 z-20"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

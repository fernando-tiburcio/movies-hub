import { useState, useEffect, useCallback, useRef } from "react";
import { MovieCard } from "./MovieCard";
import { TMDBService } from "../services/tmdb";
import { useFavorites } from "../hooks/useFavorites";
import type { Movie } from "../types/movie";

interface MovieGridProps {
  searchQuery?: string;
}

export function MovieGrid({ searchQuery }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useRef<HTMLDivElement | null>(null);

  const loadMovies = useCallback(
    async (pageNum: number, query?: string, reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const response = query
          ? await TMDBService.searchMovies(query, pageNum)
          : await TMDBService.getPopularMovies(pageNum);

        if (reset) {
          setMovies(response.results);
        } else {
          setMovies((prev) => [...prev, ...response.results]);
        }

        setHasMore(pageNum < response.total_pages);
      } catch (err) {
        setError("Erro ao carregar filmes. Tente novamente.");
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Carrega filmes quando a página ou query mudam
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadMovies(1, searchQuery, true);
  }, [searchQuery]);

  // Configura o observer para infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadMovies(nextPage, searchQuery);
        }
      },
      { threshold: 0.1 }
    );

    if (lastMovieElementRef.current) {
      observerRef.current.observe(lastMovieElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, page, loadMovies, searchQuery]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => loadMovies(1, searchQuery, true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (movies.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "Nenhum filme encontrado para sua busca."
            : "Nenhum filme encontrado."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título da seção */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {searchQuery
            ? `Resultados para "${searchQuery}"`
            : "Filmes Populares"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {searchQuery
            ? `${movies.length} filmes encontrados`
            : "Os filmes mais populares do momento"}
        </p>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, index) => {
          const isLast = index === movies.length - 1;
          return (
            <div
              key={`${movie.id}-${index}`}
              ref={isLast ? lastMovieElementRef : null}
            >
              <MovieCard
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={toggleFavorite}
                searchQuery={searchQuery}
              />
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Mensagem quando não há mais filmes */}
      {!hasMore && movies.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Todos os filmes foram carregados
          </p>
        </div>
      )}
    </div>
  );
}

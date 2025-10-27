import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Heart, Star, ArrowLeft } from "lucide-react";
import { TMDBService } from "../services/tmdb";
import { useFavorites } from "../hooks/useFavorites";
import { Header } from "./Header";
import type { MovieDetails } from "../types/movie";

interface MovieDetailsProps {
  movieId: string;
}

export function MovieDetails({ movieId }: MovieDetailsProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Valida se o movieId é válido
    const id = parseInt(movieId);
    if (isNaN(id)) {
      setError("ID do filme inválido");
      setLoading(false);
      return;
    }

    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await TMDBService.getMovieDetails(id);
        setMovie(movieData);
        setError(null);
      } catch (err) {
        console.error("Error loading movie details:", err);
        setError("Erro ao carregar detalhes do filme. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Erro ao carregar filme
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "Filme não encontrado"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
    : null;
  const isMovieFavorite = isFavorite(movie.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {/* Header com botão voltar */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-20 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Imagem na esquerda */}
          <div className="flex-shrink-0 w-full lg:w-[40%]">
            {backdropUrl ? (
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Sem imagem disponível
                </span>
              </div>
            )}
          </div>

          {/* Conteúdo na direita */}
          <div className="flex-1">
            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {movie.title}
            </h1>

            {/* Gêneros */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Data de lançamento */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Data de lançamento: </span>
                <span>{formatReleaseDate(movie.release_date)}</span>
              </p>
            </div>

            {/* Nota */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                <span className="text-gray-900 dark:text-white font-bold">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  / 10
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                ({movie.vote_count} avaliações)
              </span>
            </div>

            {/* Runtime se disponível */}
            {movie.runtime && movie.runtime > 0 && (
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Duração: </span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </p>
              </div>
            )}

            {/* Sinopse */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sinopse
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.overview || "Sinopse não disponível."}
              </p>
            </div>

            {/* Botão de favoritar */}
            <div>
              <button
                onClick={() => toggleFavorite(movie.id)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isMovieFavorite
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isMovieFavorite
                      ? "fill-current"
                      : "hover:fill-current transition-all"
                  }`}
                />
                {isMovieFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Heart, Star } from "lucide-react";
import type { Movie } from "../types/movie";
import { TMDBService } from "../services/tmdb";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movieId: number) => void;
}

export function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
}: MovieCardProps) {
  const posterUrl = TMDBService.getPosterUrl(movie.poster_path);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Overlay com informações */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm line-clamp-3">{movie.overview}</p>
          </div>
        </div>

        {/* Botão de favoritar */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-white hover:text-red-400"
            } transition-colors duration-200`}
          />
        </button>

        {/* Nota TMDB */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Informações do filme */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          {formatReleaseDate(movie.release_date)}
        </p>
      </div>
    </div>
  );
}

// Hook para gerenciar favoritos usando localStorage
import { useState, useEffect } from "react";
import type { Movie } from "../types/movie";

const FAVORITES_KEY = "movies-hub-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Carrega favoritos do localStorage na inicialização
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(new Set(parsedFavorites));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
      }
    }
  }, []);

  // Salva favoritos no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (movieId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (movieId: number) => favorites.has(movieId);

  const getFavoriteMovies = (movies: Movie[]) => {
    return movies.filter((movie) => favorites.has(movie.id));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteMovies,
  };
}

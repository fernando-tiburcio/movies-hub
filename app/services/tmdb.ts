import type { Movie, MoviesResponse, SearchResponse } from "../types/movie";

const TMDB_API_KEY = "45af9e5ba1deceb7d8d153b62ee2a2bd";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export class TMDBService {
  private static async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NWFmOWU1YmExZGVjZWI3ZDhkMTUzYjYyZWUyYTJiZCIsIm5iZiI6MTc2MTM5NDU1OC41NDgsInN1YiI6IjY4ZmNiZjdlMGE4OWJhMmE3YWZiNjhiZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rxGFXDcawqJWjPjTNO1YULIpNuE7s6Ht00iAEjJZtpc",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
      throw error;
    }
  }

  static async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      `/movie/popular?language=pt-BR&page=${page}`
    );
  }

  static async searchMovies(
    query: string,
    page: number = 1
  ): Promise<SearchResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB<SearchResponse>(
      `/search/movie?query=${encodedQuery}&page=${page}`
    );
  }

  static getPosterUrl(
    posterPath: string | null,
    size: "w300" | "w500" | "w780" = "w300"
  ): string {
    if (!posterPath) {
      return "/placeholder-poster.png"; // Imagem placeholder para filmes sem poster
    }
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  static async getMovieDetails(
    movieId: number
  ): Promise<import("../types/movie").MovieDetails> {
    return this.fetchFromTMDB<import("../types/movie").MovieDetails>(
      `/movie/${movieId}?language=pt-BR`
    );
  }
}

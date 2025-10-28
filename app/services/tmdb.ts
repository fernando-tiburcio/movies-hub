import type { Movie, MoviesResponse, SearchResponse } from "../types/movie";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export class TMDBService {
  private static async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
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
      return "/placeholder-poster.svg"; // Imagem placeholder para filmes sem poster
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

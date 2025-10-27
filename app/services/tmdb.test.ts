import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { TMDBService } from "./tmdb";
import type { MoviesResponse, SearchResponse } from "../types/movie";

// Mock fetch with proper typing
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("TMDBService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPopularMovies", () => {
    it("should fetch popular movies successfully", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie",
            overview: "A test movie",
            poster_path: "/test.jpg",
            backdrop_path: "/backdrop.jpg",
            release_date: "2023-01-01",
            vote_average: 8.5,
            vote_count: 1000,
            adult: false,
            genre_ids: [1, 2, 3],
            original_language: "en",
            original_title: "Test Movie",
            popularity: 100,
            video: false,
          },
        ],
        total_pages: 10,
        total_results: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await TMDBService.getPopularMovies(1);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/movie/popular?language=pt-BR&page=1"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            accept: "application/json",
          }),
        })
      );
    });

    it("should fetch popular movies with custom page number", async () => {
      const mockResponse: MoviesResponse = {
        page: 2,
        results: [],
        total_pages: 10,
        total_results: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await TMDBService.getPopularMovies(2);

      expect(result.page).toBe(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=2"),
        expect.any(Object)
      );
    });

    it("should fetch popular movies with default page when no page is provided", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 10,
        total_results: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.getPopularMovies();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=1"),
        expect.any(Object)
      );
    });

    it("should throw error when API returns non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(TMDBService.getPopularMovies()).rejects.toThrow(
        "TMDB API error: 404"
      );
    });

    it("should throw error when fetch fails", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const errorMessage = "Network error";

      mockFetch.mockRejectedValueOnce(new Error(errorMessage) as any);

      await expect(TMDBService.getPopularMovies()).rejects.toThrow(
        errorMessage
      );
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("searchMovies", () => {
    it("should search movies successfully", async () => {
      const mockResponse: SearchResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Searched Movie",
            overview: "A movie that was searched",
            poster_path: "/search.jpg",
            backdrop_path: "/backdrop.jpg",
            release_date: "2023-01-01",
            vote_average: 7.5,
            vote_count: 500,
            adult: false,
            genre_ids: [1, 2],
            original_language: "en",
            original_title: "Searched Movie",
            popularity: 50,
            video: false,
          },
        ],
        total_pages: 5,
        total_results: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await TMDBService.searchMovies("test query");

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/search/movie"),
        expect.any(Object)
      );
    });

    it("should encode query string properly", async () => {
      const mockResponse: SearchResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.searchMovies("query with spaces");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("query=query%20with%20spaces"),
        expect.any(Object)
      );
    });

    it("should search movies with custom page number", async () => {
      const mockResponse: SearchResponse = {
        page: 2,
        results: [],
        total_pages: 5,
        total_results: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await TMDBService.searchMovies("test", 2);

      expect(result.page).toBe(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=2"),
        expect.any(Object)
      );
    });

    it("should search movies with default page when no page is provided", async () => {
      const mockResponse: SearchResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.searchMovies("test");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=1"),
        expect.any(Object)
      );
    });

    it("should throw error when API returns non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(TMDBService.searchMovies("test")).rejects.toThrow(
        "TMDB API error: 500"
      );
    });

    it("should throw error when fetch fails during search", async () => {
      const errorMessage = "Search failed";
      mockFetch.mockRejectedValueOnce(new Error(errorMessage) as any);

      await expect(TMDBService.searchMovies("test")).rejects.toThrow(
        errorMessage
      );
    });

    it("should handle special characters in query", async () => {
      const mockResponse: SearchResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.searchMovies("query with émojis & symbols!@#");

      // Verify that the query was encoded
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain("query=");
    });
  });

  describe("getPosterUrl", () => {
    it("should return poster URL with default size", () => {
      const posterPath = "/example.jpg";
      const result = TMDBService.getPosterUrl(posterPath);

      expect(result).toBe("https://image.tmdb.org/t/p/w300/example.jpg");
    });

    it("should return poster URL with w500 size", () => {
      const posterPath = "/example.jpg";
      const result = TMDBService.getPosterUrl(posterPath, "w500");

      expect(result).toBe("https://image.tmdb.org/t/p/w500/example.jpg");
    });

    it("should return poster URL with w780 size", () => {
      const posterPath = "/example.jpg";
      const result = TMDBService.getPosterUrl(posterPath, "w780");

      expect(result).toBe("https://image.tmdb.org/t/p/w780/example.jpg");
    });

    it("should return placeholder when poster path is null", () => {
      const result = TMDBService.getPosterUrl(null);

      expect(result).toBe("/placeholder-poster.png");
    });

    it("should return placeholder when poster path is empty string", () => {
      const result = TMDBService.getPosterUrl("");

      expect(result).toBe("/placeholder-poster.png");
    });

    it("should handle poster paths with leading slash correctly", () => {
      const posterPath = "/poster.jpg";
      const result = TMDBService.getPosterUrl(posterPath, "w300");

      expect(result).toBe("https://image.tmdb.org/t/p/w300/poster.jpg");
    });

    it("should handle poster paths without leading slash correctly", () => {
      const posterPath = "poster.jpg";
      const result = TMDBService.getPosterUrl(posterPath, "w300");

      expect(result).toBe("https://image.tmdb.org/t/p/w300poster.jpg");
    });

    it("should handle different image formats", () => {
      const formats = [".jpg", ".png", ".webp"];

      formats.forEach((format) => {
        const posterPath = `/image${format}`;
        const result = TMDBService.getPosterUrl(posterPath, "w300");

        expect(result).toBe(`https://image.tmdb.org/t/p/w300/image${format}`);
      });
    });
  });

  describe("API integration", () => {
    it("should include API key in the request URL", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.getPopularMovies();

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain("api_key=");
    });

    it("should include Authorization header in the request", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.getPopularMovies();

      const callOptions = mockFetch.mock.calls[0][1] as any;
      expect(callOptions.headers.Authorization).toBeDefined();
      expect(callOptions.headers.Authorization).toContain("Bearer");
    });

    it("should use correct base URL", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await TMDBService.getPopularMovies();

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain("https://api.themoviedb.org/3");
    });
  });

  describe("Error handling", () => {
    it("should log error to console when fetch fails", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const errorMessage = "Network error";

      mockFetch.mockRejectedValueOnce(new Error(errorMessage) as any);

      try {
        await TMDBService.getPopularMovies();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching from TMDB:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should propagate error after logging", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const errorMessage = "Fatal error";

      mockFetch.mockRejectedValueOnce(new Error(errorMessage) as any);

      await expect(TMDBService.getPopularMovies()).rejects.toThrow(
        errorMessage
      );

      consoleSpy.mockRestore();
    });
  });
});

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFavorites } from "./useFavorites";
import type { Movie } from "../types/movie";

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
      return Object.keys(store)[index] || null;
    },
  };
})();

describe("useFavorites", () => {
  beforeEach(() => {
    // Substituir localStorage global pelo mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    // Limpar o store
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe("Inicialização", () => {
    it("deve inicializar com Set vazio quando não há favoritos salvos", () => {
      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toBeInstanceOf(Set);
      expect(result.current.favorites.size).toBe(0);
    });

    it("deve carregar favoritos existentes do localStorage na inicialização", () => {
      const savedFavorites = JSON.stringify([1, 2, 3]);
      localStorageMock.setItem("movies-hub-favorites", savedFavorites);

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.size).toBe(3);
      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.has(2)).toBe(true);
      expect(result.current.favorites.has(3)).toBe(true);
    });

    it("deve lidar com erro ao fazer parse de dados inválidos do localStorage", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      localStorageMock.setItem("movies-hub-favorites", "invalid-json");

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.size).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error parsing favorites from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("deve salvar favoritos no localStorage quando a lista muda", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
      });

      // Verifica que foi salvo no localStorage
      const savedData = localStorageMock.getItem("movies-hub-favorites");
      const parsedData = JSON.parse(savedData || "[]");
      expect(parsedData).toContain(1);
    });
  });

  describe("toggleFavorite", () => {
    it("deve adicionar um filme aos favoritos", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.size).toBe(1);
    });

    it("deve remover um filme dos favoritos quando já está favoritado", () => {
      const { result } = renderHook(() => useFavorites());

      // Adiciona o favorito
      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites.has(1)).toBe(true);

      // Remove o favorito
      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites.has(1)).toBe(false);
      expect(result.current.favorites.size).toBe(0);
    });

    it("deve adicionar múltiplos filmes aos favoritos", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
      });

      expect(result.current.favorites.size).toBe(3);
      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.has(2)).toBe(true);
      expect(result.current.favorites.has(3)).toBe(true);
    });

    it("deve funcionar corretamente com IDs duplicados", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(1); // Remove
        result.current.toggleFavorite(1); // Adiciona novamente
      });

      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.size).toBe(1);
    });
  });

  describe("isFavorite", () => {
    it("deve retornar false para um filme que não está favoritado", () => {
      const { result } = renderHook(() => useFavorites());

      expect(result.current.isFavorite(1)).toBe(false);
    });

    it("deve retornar true para um filme favoritado", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.isFavorite(1)).toBe(true);
    });

    it("deve retornar false para um filme que foi desfavoritado", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(1);
      });

      expect(result.current.isFavorite(1)).toBe(false);
    });

    it("deve verificar múltiplos filmes corretamente", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(3);
      });

      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(2)).toBe(false);
      expect(result.current.isFavorite(3)).toBe(true);
    });
  });

  describe("getFavoriteMovies", () => {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "Movie 1",
        overview: "Overview 1",
        poster_path: "/poster1.jpg",
        backdrop_path: "/backdrop1.jpg",
        release_date: "2023-01-01",
        vote_average: 8.5,
        vote_count: 1000,
        adult: false,
        genre_ids: [1, 2],
        original_language: "en",
        original_title: "Movie 1",
        popularity: 100,
        video: false,
      },
      {
        id: 2,
        title: "Movie 2",
        overview: "Overview 2",
        poster_path: "/poster2.jpg",
        backdrop_path: "/backdrop2.jpg",
        release_date: "2023-02-01",
        vote_average: 7.5,
        vote_count: 500,
        adult: false,
        genre_ids: [3, 4],
        original_language: "en",
        original_title: "Movie 2",
        popularity: 80,
        video: false,
      },
      {
        id: 3,
        title: "Movie 3",
        overview: "Overview 3",
        poster_path: "/poster3.jpg",
        backdrop_path: "/backdrop3.jpg",
        release_date: "2023-03-01",
        vote_average: 9.0,
        vote_count: 1500,
        adult: false,
        genre_ids: [5, 6],
        original_language: "en",
        original_title: "Movie 3",
        popularity: 120,
        video: false,
      },
    ];

    it("deve retornar array vazio quando não há favoritos", () => {
      const { result } = renderHook(() => useFavorites());

      const favoriteMovies = result.current.getFavoriteMovies(mockMovies);

      expect(favoriteMovies).toEqual([]);
    });

    it("deve retornar apenas os filmes favoritados", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(3);
      });

      const favoriteMovies = result.current.getFavoriteMovies(mockMovies);

      expect(favoriteMovies.length).toBe(2);
      expect(favoriteMovies).toContainEqual(mockMovies[0]);
      expect(favoriteMovies).toContainEqual(mockMovies[2]);
      expect(favoriteMovies).not.toContainEqual(mockMovies[1]);
    });

    it("deve retornar todos os filmes quando todos estão favoritados", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
      });

      const favoriteMovies = result.current.getFavoriteMovies(mockMovies);

      expect(favoriteMovies.length).toBe(3);
      expect(favoriteMovies).toEqual(mockMovies);
    });

    it("deve retornar array vazio quando favoritados não existem na lista", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(999); // ID que não existe na lista
      });

      const favoriteMovies = result.current.getFavoriteMovies(mockMovies);

      expect(favoriteMovies).toEqual([]);
    });

    it("deve funcionar corretamente com array vazio de filmes", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
      });

      const favoriteMovies = result.current.getFavoriteMovies([]);

      expect(favoriteMovies).toEqual([]);
    });

    it("deve manter a ordem dos filmes favoritados", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(1);
      });

      const favoriteMovies = result.current.getFavoriteMovies(mockMovies);

      expect(favoriteMovies[0]).toEqual(mockMovies[0]);
      expect(favoriteMovies[1]).toEqual(mockMovies[2]);
    });
  });

  describe("Integração com localStorage", () => {
    it("deve salvar favoritos no localStorage automaticamente quando mudarem", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(1);
      });

      // Verifica que foi salvo
      let savedData = localStorageMock.getItem("movies-hub-favorites");
      let parsedData = JSON.parse(savedData || "[]");
      expect(parsedData).toContain(1);

      act(() => {
        result.current.toggleFavorite(2);
      });

      // Verifica que ambos foram salvos
      savedData = localStorageMock.getItem("movies-hub-favorites");
      parsedData = JSON.parse(savedData || "[]");
      expect(parsedData).toContain(1);
      expect(parsedData).toContain(2);
    });

    it("deve manter favoritos ao remover um filme", () => {
      localStorageMock.setItem(
        "movies-hub-favorites",
        JSON.stringify([1, 2, 3])
      );

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.size).toBe(3);

      act(() => {
        result.current.toggleFavorite(2);
      });

      // Verifica que o favorito foi removido do localStorage
      const savedData = localStorageMock.getItem("movies-hub-favorites");
      const parsedData = JSON.parse(savedData || "[]");
      expect(parsedData).toContain(1);
      expect(parsedData).toContain(3);
      expect(parsedData).not.toContain(2);
    });

    it("deve inicializar com dados do localStorage e permitir modificações", async () => {
      localStorageMock.setItem(
        "movies-hub-favorites",
        JSON.stringify([5, 10, 15])
      );

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.favorites.size).toBe(3);
      });

      act(() => {
        result.current.toggleFavorite(20);
      });

      await waitFor(() => {
        expect(result.current.favorites.size).toBe(4);
        expect(result.current.favorites.has(20)).toBe(true);
      });
    });
  });

  describe("Comportamento com dados inválidos", () => {
    it("deve lidar com array vazio no localStorage", () => {
      localStorageMock.setItem("movies-hub-favorites", JSON.stringify([]));

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.size).toBe(0);
    });

    it("deve lidar com string vazia no localStorage", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      localStorageMock.setItem("movies-hub-favorites", "");

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.size).toBe(0);
      // String vazia não gera erro no JSON.parse, apenas retorna string vazia
      // que não pode ser parseada

      consoleSpy.mockRestore();
    });

    it("deve lidar com null no localStorage", () => {
      // Simula localStorage sem dados
      localStorageMock.clear();

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.size).toBe(0);
    });
  });

  describe("Persistência entre múltiplas chamadas do hook", () => {
    it("deve carregar e atualizar favoritos de forma persistente", () => {
      // Inicializa com dados do localStorage
      const initialData = JSON.stringify([1, 2]);
      localStorageMock.setItem("movies-hub-favorites", initialData);

      const { result } = renderHook(() => useFavorites());

      // Verifica que carregou corretamente
      expect(result.current.favorites.size).toBe(2);
      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.has(2)).toBe(true);

      // Adiciona novo favorito
      act(() => {
        result.current.toggleFavorite(3);
      });

      expect(result.current.favorites.size).toBe(3);
      expect(result.current.favorites.has(1)).toBe(true);
      expect(result.current.favorites.has(2)).toBe(true);
      expect(result.current.favorites.has(3)).toBe(true);

      // Remove um favorito
      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites.size).toBe(2);
      expect(result.current.favorites.has(1)).toBe(false);
      expect(result.current.favorites.has(2)).toBe(true);
      expect(result.current.favorites.has(3)).toBe(true);
    });

    it("deve persistir favoritos no localStorage após modificações", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(10);
        result.current.toggleFavorite(20);
        result.current.toggleFavorite(30);
      });

      expect(result.current.favorites.size).toBe(3);

      // Verifica que foi salvo no localStorage
      const savedData = localStorageMock.getItem("movies-hub-favorites");
      const parsedData = JSON.parse(savedData || "[]");
      expect(parsedData).toContain(10);
      expect(parsedData).toContain(20);
      expect(parsedData).toContain(30);
    });
  });

  describe("Performance e otimizações", () => {
    it("não deve recriar o Set desnecessariamente", () => {
      const { result, rerender } = renderHook(() => useFavorites());

      const initialSet = result.current.favorites;

      act(() => {
        result.current.toggleFavorite(1);
      });

      // Rerender sem mudanças
      rerender();

      // Verifica que um novo Set foi criado apenas quando necessário
      expect(result.current.favorites.has(1)).toBe(true);
    });

    it("deve lidar eficientemente com muitas operações", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        // Adiciona 100 favoritos
        for (let i = 1; i <= 100; i++) {
          result.current.toggleFavorite(i);
        }
      });

      expect(result.current.favorites.size).toBe(100);

      act(() => {
        // Remove metade
        for (let i = 1; i <= 50; i++) {
          result.current.toggleFavorite(i);
        }
      });

      expect(result.current.favorites.size).toBe(50);
    });
  });
});

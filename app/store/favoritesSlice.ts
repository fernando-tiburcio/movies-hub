import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const FAVORITES_KEY = "movies-hub-favorites";

function loadInitialState(): number[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed))
      return parsed.filter((n) => typeof n === "number");
    return [];
  } catch {
    return [];
  }
}

export interface FavoritesState {
  ids: number[];
}

const initialState: FavoritesState = {
  ids: loadInitialState(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload;
      const exists = state.ids.includes(id);
      state.ids = exists
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id];
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.ids));
        }
      } catch {}
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.ids = state.ids.filter((x) => x !== action.payload);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.ids));
        }
      } catch {}
    },
    clearFavorites(state) {
      state.ids = [];
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.ids));
        }
      } catch {}
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;

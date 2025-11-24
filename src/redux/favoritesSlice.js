import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  loading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    addFavorite: (state, action) => {
      const exists = state.favorites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    toggleFavorite: (state, action) => {
      const existingIndex = state.favorites.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.favorites.splice(existingIndex, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const {
  setFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
  toggleFavorite,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

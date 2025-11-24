import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import exerciseReducer from './exerciseSlice';
import favoritesReducer from './favoritesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercise: exerciseReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

import { createSlice } from '@reduxjs/toolkit';
import { THEME_MODE } from '../utils/constants';

const initialState = {
  mode: THEME_MODE.LIGHT,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;

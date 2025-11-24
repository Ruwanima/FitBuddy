import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exercises: [],
  loading: false,
  error: null,
  selectedExercise: null,
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    fetchExercisesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchExercisesSuccess: (state, action) => {
      state.loading = false;
      state.exercises = action.payload;
      state.error = null;
    },
    fetchExercisesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedExercise: (state, action) => {
      state.selectedExercise = action.payload;
    },
    clearSelectedExercise: (state) => {
      state.selectedExercise = null;
    },
  },
});

export const {
  fetchExercisesStart,
  fetchExercisesSuccess,
  fetchExercisesFailure,
  setSelectedExercise,
  clearSelectedExercise,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;

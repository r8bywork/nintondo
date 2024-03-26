import { configureStore } from '@reduxjs/toolkit';
import timeFiltersReducer from '../slices/timeFilterSlice';
import typeFiltersReducer from '../slices/typeFiltersSlice';
import sortByFiltersReducer from '../slices/sortByFiltersSlice';

export const store = configureStore({
  reducer: {
    timeFilters: timeFiltersReducer,
    typeFilters: typeFiltersReducer,
    sortByFilters: sortByFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

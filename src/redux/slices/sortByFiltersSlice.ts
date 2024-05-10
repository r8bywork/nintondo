import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SortByFiltersState {
  selectedSortByFilter: string;
}

const initialState: SortByFiltersState = {
  selectedSortByFilter: 'newest',
};

const sortByFiltersSlice = createSlice({
  name: 'sortByFilters',
  initialState,
  reducers: {
    selectSortByFilter: (state, action: PayloadAction<string>) => {
      state.selectedSortByFilter = action.payload;
    },
  },
});

export const { selectSortByFilter } = sortByFiltersSlice.actions;

export default sortByFiltersSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypeFiltersState {
  selectedTypeFilter: string;
}

const initialState: TypeFiltersState = {
  selectedTypeFilter: 'all',
};

const typeFiltersSlice = createSlice({
  name: 'typeFilters',
  initialState,
  reducers: {
    selectTypeFilter: (state, action: PayloadAction<string>) => {
      state.selectedTypeFilter = action.payload;
    },
  },
});

export const { selectTypeFilter } = typeFiltersSlice.actions;

export default typeFiltersSlice.reducer;

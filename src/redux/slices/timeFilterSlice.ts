import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimeFiltersState {
  selectedTimeFilter: string;
}

const initialState: TimeFiltersState = {
  selectedTimeFilter: 'all',
};

const timeFiltersSlice = createSlice({
  name: 'timeFilters',
  initialState,
  reducers: {
    selectTimeFilter: (state, action: PayloadAction<string>) => {
      state.selectedTimeFilter = action.payload;
    },
  },
});

export const { selectTimeFilter } = timeFiltersSlice.actions;

export default timeFiltersSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const scrollSlice = createSlice({
  name: "scroll",
  initialState: {
    scrolled: false,
  },
  reducers: {
    setScrolled: (state, action) => {
      state.scrolled = action.payload;
    },
  },
});

export const { setScrolled } = scrollSlice.actions;
export default scrollSlice.reducer;

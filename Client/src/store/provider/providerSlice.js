import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sales: {},
  estimation: {},
  salesOrder: {},
  management: {},
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setSales: (state, action) => {
      state.sales = action.payload;
    },
    setEstimation: (state, action) => {
      state.estimation = action.payload;
    },
    setSalesOrder: (state, action) => {
      state.salesOrder = action.payload;
    },
    setManagement: (state, action) => {
      state.management = action.payload;
    },
  },
});

export const { setSales, setEstimation, setSalesOrder, setManagement } =
  providerSlice.actions;

export default providerSlice.reducer;

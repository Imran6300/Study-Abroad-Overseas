import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visa: null,

  logs: [],

  loading: false,

  error: null,
};

const visaSlice = createSlice({
  name: "visa",

  initialState,

  reducers: {
    visaStart: (state) => {
      state.loading = true;

      state.error = null;
    },

    visaSuccess: (state, action) => {
      state.loading = false;

      state.visa = action.payload;
    },

    visaFailure: (state, action) => {
      state.loading = false;

      state.error = action.payload;
    },

    updateVisaInStore: (state, action) => {
      state.visa = action.payload;
    },

    logsSuccess: (state, action) => {
      state.logs = action.payload;
    },
  },
});

export const {
  visaStart,
  visaSuccess,
  visaFailure,
  updateVisaInStore,
  logsSuccess,
} = visaSlice.actions;

export default visaSlice.reducer;

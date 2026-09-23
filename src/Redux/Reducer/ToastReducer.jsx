import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "success", // "success" | "error" | "info" | "warning"
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearToast: (state) => {
      state.message = "";
      state.type = "success";
    },
  },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;

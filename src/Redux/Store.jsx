// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./Reducer/ToastReducer";
// import other reducers here

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    // other reducers
  },
});

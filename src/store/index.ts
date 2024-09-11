import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers } from "@reduxjs/toolkit";
import { apiBase } from "../service";
import { authSlice } from "./authSlice";

const rootReducers = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [apiBase.reducerPath]: apiBase.reducer,
});

export const store = configureStore({
  reducer: rootReducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiBase.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

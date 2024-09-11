import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IUser } from "@/shared/types/user";
import Cookies from "universal-cookie";

const setTokenToCookie = (token: string) => {
  const cookies = new Cookies();
  cookies.set("gracegate_token", token, {
    path: "/",
    expires: new Date(Date.now() + 2592000000),
  });
};

export const getTokenCookie = () => {
  const cookies = new Cookies();
  const token = cookies.get("gracegate_token");
  return token;
};

const removeTokenCookie = () => {
  const cookies = new Cookies();
  cookies.remove("gracegate_token", { path: "/" });
};

type AppStateT = {
  user: IUser | null;
  accessToken: string;
};

const initialState: AppStateT = {
  user: null,
  accessToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      setTokenToCookie(action.payload);
    },
    logout(state) {
      removeTokenCookie();
      state.accessToken = initialState.accessToken;
      state.user = initialState.user;
    },
  },
});

export const { reset, setUser, setAccessToken, logout } = authSlice.actions;

export const getUser = (state: RootState) => state.auth.user;

export const getAccessToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;

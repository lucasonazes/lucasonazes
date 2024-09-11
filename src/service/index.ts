import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { logout } from "@/store/authSlice";

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token: string = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json;charset=UTF-8");

    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    //@ts-ignore
    const message = result.error.data?.message;
    if (result.error.status === 401 || result.error.status === "FETCH_ERROR") {
      const pathName = window.location.pathname;
      if (
        pathName === "/sign-in" ||
        pathName === "/sign-up" ||
        pathName === "/forgot-password" ||
        pathName === "/password-recover"
      ) {
        toast.error(message);
      } else {
        toast.error("Sua sessão expirou");
        api.dispatch(logout());
        window.location.href = "/sign-in";
      }
    } else {
      toast.error(message);
    }
  }
  return result;
};

export const apiBase = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  // Add the tags to the api cache
  tagTypes: ["User", "Event"],
  refetchOnFocus: false,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
});

import { IUser } from "@/shared/types/user";
import { apiBase } from ".";

export type CreateUserT = IUser & {
  password: string;
};

type UserResponseT = IUser & {
  _id: string;
  type: string;
  created_at: string;
  updated_at: string;
};

export type SignInT = {
  email: string;
  password: string;
};

type SignInResponseT = {
  token: string;
};

export type ResetPasswordT = {
  email: string;
};

type UpdatePasswordT = {
  password: string;
};

export const UserService = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    createMember: builder.mutation<UserResponseT, CreateUserT>({
      query: (params) => ({
        url: `/user/member`,
        method: "POST",
        body: params,
      }),
    }),

    login: builder.mutation<SignInResponseT, SignInT>({
      query: (params) => ({
        url: `/user/login`,
        method: "POST",
        body: params,
      }),
    }),

    fetchUserInfo: builder.query<UserResponseT, undefined>({
      query: () => ({
        url: `/user/me`,
      }),
    }),

    resetPassword: builder.mutation<undefined, ResetPasswordT>({
      query: (params) => ({
        url: `/user/reset-password`,
        method: "POST",
        body: params,
      }),
    }),

    updatePassword: builder.mutation<UserResponseT, UpdatePasswordT>({
      query: (params) => ({
        url: `/user`,
        method: "PUT",
        body: params,
      }),
    }),
  }),
});

export const {
  useCreateMemberMutation,
  useLoginMutation,
  useFetchUserInfoQuery,
  useLazyFetchUserInfoQuery,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = UserService;

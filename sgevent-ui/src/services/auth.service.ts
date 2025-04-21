import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../state/store';
import { commonHeader } from '../utils';

export const authReducerName = 'authApi';

export const authApi = createApi({
  reducerPath: authReducerName,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.GATSBY_BACKEND_API_URL + '/api/auth',
    credentials: 'include',
    prepareHeaders: commonHeader,
  }),
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async credential => {
        try {
          const token = btoa(`${credential.emailAddress}:${credential.password}`);
          const data = await fetch(process.env.GATSBY_BACKEND_API_URL + `/api/auth/sign-in`, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (data.ok) {
            return { data: data.json() };
          } else {
            return Promise.reject(data);
          }
        } catch (error) {
          return { error };
        }
      },
    }),

    loginWithGoogle: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: `/google/sign-in`,
        method: 'POST',
      }),
    }),
    signUp: builder.mutation<LoginResponse, EventUserRequest>({
      query: userInfo => ({
        url: '/sign-up',
        method: 'POST',
        body: userInfo,
      }),
    }),
    logout: builder.mutation<string, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const selectAuth = (state: RootState) => state[authReducerName];

export const { useLoginMutation, useLoginWithGoogleMutation, useSignUpMutation, useLogoutMutation } = authApi;

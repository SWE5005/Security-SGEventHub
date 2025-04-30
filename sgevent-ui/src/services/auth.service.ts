import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
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
      queryFn: async (credential, _api, _extraOptions, _baseQuery) => {
        try {
          const token = btoa(`${credential.emailAddress}:${credential.password}`);
          const response = await fetch(process.env.GATSBY_BACKEND_API_URL + `/api/auth/sign-in`, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${token}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest', // hint to prevent Spring Boot from adding WWW-Authenticate header in response
            },
            credentials: 'include',
          });
          if (response.ok) {
            const data: LoginResponse = await response.json();
            return { data };
          } else {
            const error: FetchBaseQueryError = await response.json();
            return { error };
          }
        } catch (error) {
          return { error: error as FetchBaseQueryError };
        }
      },
    }),

    loginWithGoogle: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: `/google/sign-in`,
        method: 'GET',
      }),
    }),
    signUp: builder.mutation<LoginResponse, SignupRequest>({
      query: userInfo => ({
        url: '/sign-up',
        method: 'POST',
        body: userInfo,
      }),
    }),
    logout: builder.mutation<string, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
    }),
  }),
});

export const selectAuth = (state: RootState) => state[authReducerName];

export const { useLoginMutation, useLoginWithGoogleMutation, useSignUpMutation, useLogoutMutation } = authApi;

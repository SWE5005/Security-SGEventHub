import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../state/store";

export const authReducerName = "authApi";

export const authApi = createApi({
	reducerPath: authReducerName,
	baseQuery: fetchBaseQuery({ baseUrl: process.env.GATSBY_USER_MANAGER_API_URL }),
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (credentials) => ({
				url: "api/user-manager/user/login",
				method: "POST",
				body: credentials,
			}),
		}),

		// 新增：处理注册请求
		signUp: builder.mutation<EventUserResponse, EventUserRequest>({
			// Adjust the query to accept user info and pass them in the request body
			query: (userInfo) => ({
				url: "api/user-manager/user/signup", // 假设这是你的注册接口
				method: "POST",
				body: userInfo,
			}),
		}),
	}),
});

export const selectAuth = (state: RootState) => state[authReducerName];

// 导出useLoginMutation和useSignUpMutation
export const { useLoginMutation, useSignUpMutation } = authApi;

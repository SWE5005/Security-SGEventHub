import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonHeader } from "../utils";

export const userReducerName = "userApi";

export const userApi = createApi({
	reducerPath: userReducerName,
	baseQuery: fetchBaseQuery({ baseUrl: process.env.USER_MANAGER_API_URL, prepareHeaders: commonHeader }),
	refetchOnMountOrArgChange: true,
	endpoints: (builder) => ({
		getUserList: builder.query({
			query: () => ({
				url: "api/user-manager/user/all",
				method: "GET",
			}),
		}),
		getUserDetails: builder.query({
			query: (userId) => ({
				url: `api/user-manager/user/search/${userId}`,
				method: "GET",
			}),
		}),
		getUserListByIds: builder.mutation({
			query: (payload) => ({
				url: `api/user-manager/user/getUserDetails`,
				method: "POST",
				body: payload,
			}),
		}),
		updateUser: builder.mutation({
			query: (payload) => ({
				url: "api/user-manager/user/update",
				method: "POST",
				body: payload,
			}),
		}),
		addUser: builder.mutation({
			query: (payload) => ({
				url: "api/user-manager/user/add",
				method: "POST",
				body: payload,
			}),
		}),
		deleteUser: builder.mutation({
			query: (userId) => ({
				url: `api/user-manager/user/delete/${userId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const selectUser = (state) => state?.[userReducerName];

export const {
	useGetUserListQuery,
	useGetUserDetailsQuery,
	useGetUserListByIdsMutation,
	useUpdateUserMutation,
	useAddUserMutation,
	useDeleteUserMutation,
} = userApi;

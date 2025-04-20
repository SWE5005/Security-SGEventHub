import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonHeader } from "../utils";
import { RootState } from "../state/store";

export const userReducerName = "userApi";

type SgehAllUsersResult = Array<SgehUserDetail>;

export const userApi = createApi({
	reducerPath: userReducerName,
	baseQuery: fetchBaseQuery({ baseUrl: process.env.GATSBY_USER_MANAGER_API_URL, prepareHeaders: commonHeader }),
	refetchOnMountOrArgChange: true,
	endpoints: (builder) => ({
		getUserList: builder.query<SgehAllUsersResult, void>({
			query: () => ({
				url: "api/user-manager/user/all",
				method: "GET",
			}),
		}),
		getUserDetails: builder.query<SgehUserDetail, string>({
			query: (userId) => ({
				url: `api/user-manager/user/search/${userId}`,
				method: "GET",
			}),
		}),
		getUserListByIds: builder.mutation<SgehUser, Array<string>>({
			query: (userIds) => ({
				url: `api/user-manager/user/getUserDetails`,
				method: "POST",
				body: userIds,
			}),
		}),
		updateUser: builder.mutation<void, SgehUser>({
			query: (payload) => ({
				url: "api/user-manager/user/update",
				method: "POST",
				body: payload,
			}),
		}),
		addUser: builder.mutation<void, SgehUser>({
			query: (payload) => ({
				url: "api/user-manager/user/add",
				method: "POST",
				body: payload,
			}),
		}),
		deleteUser: builder.mutation<void, string>({
			query: (userId) => ({
				url: `api/user-manager/user/delete/${userId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const userReducerSelector = (state: RootState) => state[userReducerName];

export const {
	useGetUserListQuery,
	useGetUserDetailsQuery,
	useGetUserListByIdsMutation,
	useUpdateUserMutation,
	useAddUserMutation,
	useDeleteUserMutation,
} = userApi;

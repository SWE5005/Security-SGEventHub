import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonHeader } from "../utils/index.js";

export const roleReducerName = "roleApi";

export const roleApi = createApi({
	reducerPath: roleReducerName,
	baseQuery: fetchBaseQuery({ baseUrl: process.env.USER_MANAGER_API_URL, prepareHeaders: commonHeader }),
	endpoints: (builder) => ({
		getRoleList: builder.query({
			query: () => ({
				url: "api/user-manager/userrole/all",
				method: "GET",
			}),
		}),
	}),
});

export const selectRole = (state) => state?.[roleReducerName];

export const { useGetRoleListQuery } = roleApi;

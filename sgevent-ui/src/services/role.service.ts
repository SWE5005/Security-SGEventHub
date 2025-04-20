import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonHeader } from "../utils/index";
import { RootState } from "../state/store";

export const roleReducerName = "roleApi";

export interface AllUserRoleResult {
	RoleId: number;
	RoleName: string;
	Permission: string;
}

export const roleApi = createApi({
	reducerPath: roleReducerName,
	baseQuery: fetchBaseQuery({ baseUrl: process.env.GATSBY_USER_MANAGER_API_URL, prepareHeaders: commonHeader }),
	endpoints: (builder) => ({
		getRoleList: builder.query<AllUserRoleResult, void>({
			query: () => ({
				url: "api/user-manager/userrole/all",
				method: "GET",
			}),
		}),
	}),
});

export const selectRole = (state: RootState) => state[roleReducerName];
export const { useGetRoleListQuery } = roleApi;

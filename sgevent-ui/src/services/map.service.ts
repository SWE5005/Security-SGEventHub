import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mapReducerName = "mapApi";

export const mapApi = createApi({
	reducerPath: mapReducerName,
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.ONE_MAP_API_URL,
	}),
	refetchOnMountOrArgChange: true,
	endpoints: (builder) => ({
		searchLocation: builder.mutation({
			query: (input) => ({
				url: `/search?returnGeom=Y&getAddrDetails=Y&searchVal=${input}`,
				method: "GET",
			}),
		}),
	}),
});

export const selectMap = (state) => state?.[mapReducerName];
export const { useSearchLocationMutation } = mapApi;

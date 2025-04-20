import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../state/store";

export const mapReducerName = "mapApi";

interface OneMapSearchResult {
	found: number;
	totalNumPages: number;
	pageNum: number;
	results: [
		{
			SEARCHVAL: string;
			BLK_NO: string;
			ROAD_NAME: string;
			BUILDING: string;
			ADDRESS: string;
			POSTAL: string;
			X: string;
			Y: string;
			LATITUDE: string;
			LONGITUDE: string;
		}
	];
}

export const mapApi = createApi({
	reducerPath: mapReducerName,
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.GATSBY_ONE_MAP_API_URL,
	}),
	refetchOnMountOrArgChange: true,
	endpoints: (builder) => ({
		searchLocation: builder.mutation<OneMapSearchResult, string>({
			query: (input) => ({
				url: `search?returnGeom=Y&getAddrDetails=Y&searchVal=${input}`,
				method: "GET",
			}),
		}),
	}),
});

export const selectMap = (state: RootState) => state[mapReducerName];
export const { useSearchLocationMutation } = mapApi;

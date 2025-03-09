import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonHeader } from "../utils/index.js";

export const reviewReducerName = "reviewApi";

export const reviewApi = createApi({
	reducerPath: reviewReducerName,
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.GATSBY_EVENT_MANAGER_API_URL,
		prepareHeaders: commonHeader,
	}),
	refetchOnMountOrArgChange: true,
	endpoints: (builder) => ({
		getEventReviews: builder.query({
			query: (eventId) => ({
				url: `api/event-manager/review/event/${eventId}`,
				method: "GET",
			}),
		}),
		postEventReview: builder.mutation({
			query: ({ eventId, userId, rating, comment }) => ({
				url: "api/event-manager/review/add",
				method: "POST",
				body: { eventId, userId, rating, comment },
			}),
		}),
	}),
});

export const { useGetEventReviewsQuery, usePostEventReviewMutation } = reviewApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonHeader } from "../utils";

export const eventReducerName = "eventApi";

interface EventHubEvent {
	eventId: string;
	eventName: string;
}

export const eventApi = createApi({
	reducerPath: eventReducerName,
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.GATSBY_EVENT_MANAGER_API_URL,
		prepareHeaders: commonHeader,
	}),
	refetchOnMountOrArgChange: true,
	endpoints: (builder) => ({
		getEventList: builder.query({
			query: () => ({
				url: "api/event-manager/event/all",
				method: "GET",
			}),
		}),
		getEventDetails: builder.query({
			query: (id) => ({
				url: `api/event-manager/event/details?eventid=${id}`,
				method: "GET",
			}),
		}),
		// getEventForEdit: builder.query({
		//   query: (id) => ({
		//     url: `api/event-manager/event/edit/${id}`,
		//     method: "GET",
		//   }),
		// }),
		addEvent: builder.mutation({
			query: (payload) => ({
				url: "api/event-manager/event/create",
				method: "POST",
				body: payload,
			}),
		}),
		deleteEvent: builder.mutation({
			query: (id) => ({
				url: `api/event-manager/event/delete/${id}`,
				method: "DELETE",
			}),
		}),
		updateEvent: builder.mutation({
			query: (payload) => ({
				url: "api/event-manager/event/update",
				method: "POST",
				body: payload,
			}),
		}),
		registerEvent: builder.mutation({
			query: ({ type, eventId, userId }) => ({
				url: `api/event-manager/event/registration/${type}/${eventId}/${userId}`,
				method: "GET",
			}),
		}),
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

export const selectEvent = (state) => state?.[eventReducerName];

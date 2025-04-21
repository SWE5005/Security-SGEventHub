import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { commonHeader } from '../utils/index';
import { RootState } from '../state/store';

export const reviewReducerName = 'reviewApi';

export const reviewApi = createApi({
  reducerPath: reviewReducerName,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.GATSBY_BACKEND_API_URL,
    prepareHeaders: commonHeader,
  }),
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    postEventReview: builder.mutation<SgehEventReview, SgehEventReviewReq>({
      query: ({ eventId, userId, rating, comment }) => ({
        url: 'api/event-manager/review/add',
        method: 'POST',
        body: { eventId, userId, rating, comment },
      }),
    }),
    getEventReviews: builder.query<SgehEventReview[], string>({
      query: eventId => ({
        url: `api/event-manager/review/event/${eventId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const selectReview = (state: RootState) => state[reviewReducerName];
export const { usePostEventReviewMutation, useGetEventReviewsQuery } = reviewApi;

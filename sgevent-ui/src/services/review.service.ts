import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQueryAuthMiddleware, commonHeader } from '../utils';
import { RootState } from '../state/store';

export const reviewReducerName = 'reviewApi';

export const reviewApi = createApi({
  reducerPath: reviewReducerName,
  baseQuery: fetchBaseQueryAuthMiddleware({
    baseUrl: process.env.GATSBY_BACKEND_API_URL + '/api/feedback',
    prepareHeaders: commonHeader,
    credentials: 'include',
  }),
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    postEventReview: builder.mutation<SgehEventReview, SgehEventReviewReq>({
      query: ({ eventId, rating, comment }) => ({
        url: '/create',
        method: 'POST',
        body: { eventId, rating, comment },
      }),
    }),
    getEventReviews: builder.query<SgehEventReview[], string>({
      query: eventId => ({
        url: `/${eventId}/list`,
        method: 'GET',
      }),
    }),
  }),
});

export const selectReview = (state: RootState) => state[reviewReducerName];
export const { usePostEventReviewMutation, useGetEventReviewsQuery } = reviewApi;

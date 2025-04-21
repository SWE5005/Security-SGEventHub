import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { commonHeader } from '../utils';
import { RootState } from '../state/store';

export const eventReducerName = 'eventApi';

interface SgehEventResult extends SgehEvent {
  registrationCount: number;
  isRegistered: boolean;
}

interface SgehEventDetails extends SgehEvent {
  userList: SgehEventRegistration[];
}

export const eventApi = createApi({
  reducerPath: eventReducerName,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.GATSBY_BACKEND_API_URL + '/api/event',
    prepareHeaders: commonHeader,
    credentials: 'include',
  }),
  tagTypes: ['EventList', 'EventDetails'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getEventList: builder.query<SgehEventResult[], void>({
      query: () => ({
        url: '/all',
        method: 'GET',
      }),
      providesTags: ['EventList'],
    }),
    getEventDetails: builder.query<SgehEventDetails, string>({
      query: id => ({
        url: `api/event-manager/event/details?eventid=${id}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
    }),
    addEvent: builder.mutation<SgehEventResult, SgehEvent>({
      query: payload => ({
        url: 'api/event-manager/event/create',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['EventList'],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: id => ({
        url: `api/event-manager/event/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EventList'],
    }),
    updateEvent: builder.mutation<void, SgehEvent>({
      query: payload => ({
        url: 'api/event-manager/event/update',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['EventList', 'EventDetails'],
    }),
    registerEvent: builder.mutation<void, { type: string; eventId: string; userId: string }>({
      query: ({ type, eventId, userId }) => ({
        url: `api/event-manager/event/registration/${type}/${eventId}/${userId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const selectEvent = (state: RootState) => state[eventReducerName];
export const {
  useGetEventListQuery,
  useGetEventDetailsQuery,
  useAddEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
  useRegisterEventMutation,
} = eventApi;

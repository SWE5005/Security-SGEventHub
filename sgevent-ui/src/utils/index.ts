import { type FetchBaseQueryArgs } from '@reduxjs/toolkit/query';
import { DATETIME_FORMAT } from '../constants/index';
import { AUTH_SLICE_NAME } from '../state/auth/slice';
import dayjs from 'dayjs';
import { RootState } from '../state/store';
import { navigate } from 'gatsby';
import { logout, setToken } from '../state/auth/slice';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

type TBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

type TFetchBaseQueryWithAuthToken = {
  baseUrl: string;
  prepareHeaders?: FetchBaseQueryArgs['prepareHeaders'];
  credentials?: string;
};

export const getFormattedTime = (timestamp: Date) => {
  return dayjs(timestamp).format(DATETIME_FORMAT);
};

export const toBase64 = (file: Blob, callback: Function) => {
  let reader = new FileReader();
  reader.onloadend = function (e: ProgressEvent<FileReader>) {
    callback(e.target?.result, e.target?.error);
  };
  reader.readAsDataURL(file);
};

export const commonHeader: FetchBaseQueryArgs['prepareHeaders'] = (headers, { getState }) => {
  const slices = getState() as RootState;
  const accessToken = slices[AUTH_SLICE_NAME].userInfo.access_token;
  const tokenType = slices[AUTH_SLICE_NAME].userInfo.token_type;

  if (accessToken) {
    headers.set('Authorization', tokenType + ' ' + accessToken);
  }
  return headers;
};

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: process.env.GATSBY_BACKEND_API_URL + '/api/auth',
  credentials: 'include',
});

export const baseQueryWithReauth =
  (baseQuery: TBaseQuery): TBaseQuery =>
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 406) {
      const refreshResult: any = await refreshBaseQuery(
        {
          url: '/refresh-token',
          method: 'POST',
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        api.dispatch(setToken(refreshResult.data));

        // retry original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // logout user + redirect to login page
        api.dispatch(logout());
        navigate('/login');
      }
    }

    return result;
  };

export const fetchBaseQueryWithAuthToken = ({ baseUrl, prepareHeaders }: TFetchBaseQueryWithAuthToken) => {
  return fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders,
  });
};

export const fetchBaseQueryAuthMiddleware = (params: TFetchBaseQueryWithAuthToken) => baseQueryWithReauth(fetchBaseQueryWithAuthToken(params));

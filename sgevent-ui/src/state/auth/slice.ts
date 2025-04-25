import { createSlice, Slice } from '@reduxjs/toolkit';
import { authApi } from '../../services/auth.service';
import { RootState } from '../store';

export const AUTH_SLICE_NAME = 'auth';

type AuthState = { userInfo: Partial<LoginResponse>; isLoggedIn: boolean };

const authSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState: {
    userInfo: {},
    isLoggedIn: false,
  } satisfies AuthState as AuthState,
  reducers: {
    logout: state => {
      state.userInfo = {};
      state.isLoggedIn = false;
    },
    setToken: (state, { payload }) => {
      state.userInfo = payload; // Update the userinfo with new access_token
    },
  },
  extraReducers: builder => {
    // Process login/registration success via RTK Query
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, actions) => {
        state.isLoggedIn = true;
        state.userInfo = actions.payload; // Assume that the payload directly contains user information
      })
      // Process login with Google success
      .addMatcher(authApi.endpoints.loginWithGoogle.matchFulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.userInfo = payload; // Assume that the payload directly contains user information
      })
      // The same process applies to successful registration
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.userInfo = payload;
      })
      // reset the state when logout is successful
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state, { payload }) => {
        state.isLoggedIn = false;
        state.userInfo = {};
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthSlice = (state: RootState) => state[AUTH_SLICE_NAME];
export const selectUserName = (state: RootState) => state[AUTH_SLICE_NAME].userInfo?.userName;

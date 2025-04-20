import { createSlice, Slice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth.service";
import { RootState } from "../store";

export const AUTH_SLICE_NAME = "auth";

const authSlice = createSlice({
	name: AUTH_SLICE_NAME,
	initialState: {
		userInfo: {},
		isLoggedIn: false,
	},
	reducers: {
		logout: (state) => {
			state.userInfo = {};
			state.isLoggedIn = false;
		},
	},
	extraReducers: (builder) => {
		// Process login/registration success via RTK Query
		builder
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
				state.isLoggedIn = true;
				state.userInfo = payload; // Assume that the payload directly contains user information
			})
			// The same process applies to successful registration
			.addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, { payload }) => {
				state.isLoggedIn = true;
				state.userInfo = payload;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthSlice = (state: RootState) => state[AUTH_SLICE_NAME];
export const selectUserName = (state: RootState) => state[AUTH_SLICE_NAME].userInfo?.userName;

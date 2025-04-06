import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth.service";

// Define slice name
export const authSliceName = "auth";

// Create slice
const authSlice = createSlice({
	name: authSliceName,
	initialState: {
		userInfo: null,
		isLoggedIn: false,
		isLoading: true,
	},
	reducers: {
		// Set loading state
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},

		// Clear auth state (used during logout)
		clearAuth: (state) => {
			state.userInfo = null;
			state.isLoggedIn = false;
		},
	},
	extraReducers: (builder) => {
		// Handle auth status check
		builder.addMatcher(authApi.endpoints.getAuthStatus.matchFulfilled, (state, { payload }) => {
			state.isLoggedIn = payload.isAuthenticated;
			state.isLoading = false;
		});

		// Handle auth status check error
		builder.addMatcher(authApi.endpoints.getAuthStatus.matchRejected, (state) => {
			state.isLoggedIn = false;
			state.isLoading = false;
		});

		// Handle user info fetch
		builder.addMatcher(authApi.endpoints.getUserInfo.matchFulfilled, (state, { payload }) => {
			state.userInfo = payload;
		});

		// Handle logout
		builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
			state.userInfo = null;
			state.isLoggedIn = false;
		});
	},
});

// Export actions and reducer
export const { setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// Export selectors
export const authSelector = (state) => state[authSliceName];
export const userNameSelector = (state) => {
	const user = state[authSliceName].userInfo;
	return user?.preferred_username || user?.name;
};

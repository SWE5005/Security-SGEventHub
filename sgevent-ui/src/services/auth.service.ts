import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const refreshExpiresIn: number = 86400; // 1 day in seconds

export const authReducerName = "authApi";

// Helper functions for handling OIDC auth
const isSSR = typeof window === "undefined";

// OIDC auth service
export const initiateLogin = () => {
	if (isSSR) return;

	// Redirect to the /api/auth/login endpoint which will handle the OIDC redirect
	window.location.href = "/api/auth/login";
};

export const logout = () => {
	if (isSSR) return;

	// Clear local state and redirect to the logout endpoint
	window.location.href = "/api/auth/logout";
};

export const getUserInfo = async () => {
	if (isSSR) return null;

	try {
		const response = await fetch("/api/auth/userinfo", {
			credentials: "include", // Important for cookies
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching user info:", error);
		return null;
	}
};

export const checkAuthStatus = async () => {
	if (isSSR) return false;

	try {
		const response = await fetch("/api/auth/status", {
			credentials: "include", // Important for cookies
		});

		if (!response.ok) {
			return false;
		}

		const data = await response.json();
		return data.isAuthenticated;
	} catch (error) {
		console.error("Error checking auth status:", error);
		return false;
	}
};

// RTK Query API for integration with Redux
export const authApi = createApi({
	reducerPath: authReducerName,
	baseQuery: fetchBaseQuery({
		baseUrl: "/",
		credentials: "include", // Important for cookies
	}),
	endpoints: (builder) => ({
		// Check authentication status
		getAuthStatus: builder.query({
			queryFn: async () => {
				try {
					const isAuthenticated = await checkAuthStatus();
					return { data: { isAuthenticated } };
				} catch (error) {
					return { error: error.message };
				}
			},
		}),

		// Get user info
		getUserInfo: builder.query({
			queryFn: async () => {
				try {
					const userInfo = await getUserInfo();
					return { data: userInfo };
				} catch (error) {
					return { error: error.message };
				}
			},
		}),

		// Logout - using invalidation for cache clearing
		logout: builder.mutation({
			queryFn: async () => {
				logout();
				return { data: { success: true } };
			},
			invalidatesTags: ["AuthStatus", "UserInfo"],
		}),
	}),
	tagTypes: ["AuthStatus", "UserInfo"],
});

export const selectAuth = (state) => state?.[authReducerName];

export const { useGetAuthStatusQuery, useGetUserInfoQuery, useLogoutMutation } = authApi;

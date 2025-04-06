import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer, { authSliceName } from "./auth/slice";
import { authApi } from "../services/auth.service";
import { userApi } from "../services/user.service";
import { roleApi } from "../services/role.service";
import { eventApi } from "../services/event.service";
import { mapApi } from "../services/map.service";

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
	return {
		getItem(_key: string) {
			return Promise.resolve(null);
		},
		setItem(_key: string, value: string) {
			return Promise.resolve(value);
		},
		removeItem(_key: string) {
			return Promise.resolve();
		},
	};
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
	key: "auth",
	storage,
	whitelist: [authSliceName],
};

const rootReducer = combineReducers({
	[authSliceName]: authReducer,
	[authApi.reducerPath]: authApi.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[roleApi.reducerPath]: roleApi.reducer,
	[eventApi.reducerPath]: eventApi.reducer,
	[mapApi.reducerPath]: mapApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(authApi.middleware, userApi.middleware, roleApi.middleware, eventApi.middleware, mapApi.middleware);
	},
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

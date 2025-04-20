import { type FetchBaseQueryArgs } from "@reduxjs/toolkit/query";
import { DATETIME_FORMAT } from "../constants/index";
import { AUTH_SLICE_NAME } from "../state/auth/slice";
import dayjs from "dayjs";

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
export const commonHeader: FetchBaseQueryArgs["prepareHeaders"] = (headers, { getState }) => {
	const slices = getState();
	const userid = slices[AUTH_SLICE_NAME].userInfo.userId;

	headers.set("userid", userid);
	return headers;
};

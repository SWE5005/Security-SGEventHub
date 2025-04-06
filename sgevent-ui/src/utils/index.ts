import { type FetchBaseQueryArgs } from "@reduxjs/toolkit/query";
import { DATETIME_FORMAT } from "../constants/index";
import { authSliceName } from "../state/auth/slice";
import dayjs from "dayjs";

export const getFormattedTime = (timestamp: Date) => {
	return dayjs(timestamp).format(DATETIME_FORMAT);
};

export const toBase64 = (file: Blob, callback: Function) => {
	let reader = new FileReader();
	reader.onloadend = function (e) {
		callback(e.target.result, e.target.error);
	};
	reader.readAsDataURL(file);
};
export const commonHeader: FetchBaseQueryArgs["prepareHeaders"] = (headers, { getState }) => {
	const userid = getState()[authSliceName].userInfo.userId;

	headers.set("userid", userid);
	return headers;
};

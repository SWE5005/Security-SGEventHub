import { DATETIME_FORMAT } from "../constants/index.js";
import { authSliceName } from "../state/auth/slice";
import dayjs from "dayjs";

export const getFormattedTime = (timestamp) => {
	return dayjs(timestamp).format(DATETIME_FORMAT);
};

export const toBase64 = (file, callback) => {
	var reader = new FileReader();
	reader.onloadend = function (e) {
		callback(e.target.result, e.target.error);
	};
	reader.readAsDataURL(file);
};

export const commonHeader = (headers, { getState }) => {
	const userid = getState()[authSliceName].userInfo.userId;

	headers.set("userid", userid);
	return headers;
};

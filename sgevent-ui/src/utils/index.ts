import { type FetchBaseQueryArgs } from "@reduxjs/toolkit/query";
import { DATETIME_FORMAT } from "../constants/index";
import { AUTH_SLICE_NAME } from "../state/auth/slice";
import dayjs from "dayjs";
import { RootState } from "../state/store";

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

export const commonHeader: FetchBaseQueryArgs["prepareHeaders"] = (
  headers,
  { getState }
) => {
  const slices = getState() as RootState;
  const accessToken = slices[AUTH_SLICE_NAME].userInfo.access_token;
  const tokenType = slices[AUTH_SLICE_NAME].userInfo.token_type;

  if (accessToken) {
    headers.set("Authorization", tokenType + " " + accessToken);
  }
  return headers;
};

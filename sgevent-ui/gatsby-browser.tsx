import React from "react";
import { Provider } from "react-redux";
import store from "./src/state/store";
import { type WrapRootElementBrowserArgs } from "gatsby";

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => {
	return <Provider store={store}>{element}</Provider>;
};

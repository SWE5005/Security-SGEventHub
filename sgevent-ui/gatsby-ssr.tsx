import React from "react";
import { Provider } from "react-redux";
import store, { persistor } from "./src/state/store";
import { PersistGate } from "redux-persist/integration/react";
import { type WrapRootElementNodeArgs } from "gatsby";

export const wrapRootElement: React.FC<WrapRootElementNodeArgs> = ({ element }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {element}
      </PersistGate>
    </Provider>
  );
};

"use client";

import { Provider as ReduxProvider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { LayoutProps } from "../types/layout";

const Provider = ({ children }: LayoutProps) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {children}
      </PersistGate>{" "}
    </ReduxProvider>
  );
};

export default Provider;

"use client";

import { store } from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import Wrapper from "./wrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <Wrapper>{children}</Wrapper>
    </ReduxProvider>
  );
}

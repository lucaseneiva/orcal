"use client";

import { createContext, useContext } from "react";

const StoreContext = createContext<any>(null);

export function StoreProvider({
  store,
  children,
}: {
  store: any;
  children: React.ReactNode;
}) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return ctx;
}

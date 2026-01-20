"use client";

import { createContext, useContext, ReactNode } from "react";
import { Database } from "@/src/lib/types/database.types";

// 1. Extraímos o tipo 'Row' da tabela 'stores' do seu banco de dados
export type Store = Database["public"]["Tables"]["stores"]["Row"];

// 2. Definimos o tipo do contexto (pode ser a Store ou null)
const StoreContext = createContext<Store | null>(null);

interface StoreProviderProps {
  store: Store; // Substituído 'any' por 'Store'
  children: ReactNode;
}

export function StoreProvider({
  store,
  children,
}: StoreProviderProps) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

// 3. O hook useStore agora retornará automaticamente o tipo Store
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    // Importante: este erro ajuda a debugar se você esqueceu o Provider
    throw new Error("useStore must be used inside StoreProvider");
  }
  return ctx;
}
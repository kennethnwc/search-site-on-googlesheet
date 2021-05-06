import create from "zustand";
import { combine } from "zustand/middleware";

export const useSearchQuery = create(
  combine(
    {
      query: "",
    },
    (set) => ({
      setQuery: (query: string) => set({ query }),
    })
  )
);

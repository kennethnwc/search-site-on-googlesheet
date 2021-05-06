import create from "zustand";
import { combine } from "zustand/middleware";

export const usePageStore = create(
  combine({ page: 1 }, (set) => ({
    setPage: (page: number) => set({ page }),
    resetPage: () => set({ page: 1 }),
  }))
);

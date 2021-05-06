import create from "zustand";
import { combine } from "zustand/middleware";

export type SearchResultState = {
  data: {
    items: any[];
    aggregations: any[];
  };
  pagination: any;
  timings: any;
};

export const useSearchResults = create(
  combine(
    {
      searchResult: {
        data: {
          items: [],
          aggregations: [],
        },
        pagination: "",
        timings: "",
      } as SearchResultState,
    },
    (set) => ({
      setSearchResult: (searchResult: SearchResultState) =>
        set({ searchResult }),
    })
  )
);

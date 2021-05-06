import create from "zustand";
import { combine } from "zustand/middleware";
import { init_config } from "../utils/config";

type FacetKeys = string | keyof typeof init_config.aggregations;
export type Facets = Record<FacetKeys, string[]>;

export const useFilterStore = create(
  combine(
    {
      filters: Object.keys(init_config.aggregations).reduce(
        (clone, key) => ({ [key]: [], ...clone }),
        {} as Facets
      ),
    },
    (set) => ({ setFilters: (filters: Facets) => set({ filters }) })
  )
);

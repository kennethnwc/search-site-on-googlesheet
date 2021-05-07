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
    (set) => ({
      setFilters: (filters: Facets) => set({ filters }),
      setFiltersWithField: (
        filterName: string,
        filterValue: string,
        actions?: "ADD" | "REMOVE"
      ) =>
        set(({ filters }) => {
          const oldFilters = filters;
          let newFilters = oldFilters;
          if (isIncludes(filters, filterName, filterValue)) {
            if (actions && actions === "REMOVE") {
              const index = newFilters[filterName].indexOf(filterValue);
              newFilters[filterName].splice(index, 1);
            }
          } else {
            if (actions && actions === "ADD") {
              newFilters[filterName].push(filterValue);
            }
          }
          return { filters: newFilters };
        }),
    })
  )
);

const isIncludes = (
  filters: Facets,
  filterName: string,
  filterValue: string
) => {
  return filterName in filters && filters[filterName].includes(filterValue);
};

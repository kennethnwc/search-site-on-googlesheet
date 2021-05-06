import React, { ChangeEvent } from "react";
import { usePageStore } from "../stores/usePage";

import { useSearchQuery } from "../stores/useSearchQuery";

export const SearchBar = React.memo(() => {
  const { query, setQuery } = useSearchQuery();
  const { resetPage } = usePageStore();

  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="relative md:px-12 md:py-2 ">
        <input
          type="search"
          className="w-full bg-purple-white shadow rounded border-0 p-3 "
          placeholder="Search by name..."
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            resetPage();
          }}
        />
        <div className="absolute pin-r pin-t mt-3 mr-4 text-purple-lighter"></div>
      </div>
    </nav>
  );
});

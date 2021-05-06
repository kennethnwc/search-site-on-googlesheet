import { ChangeEvent } from "react";
import { useFilterStore } from "../stores/useFilterStore";
import { SearchResultState, useSearchResults } from "../stores/useSearchResult";

type Props = {
  value: {
    name: string;
    title: string;
    buckets: { key: string; doc_count: number; selected: boolean }[];
  };
  getSearchResult: () => SearchResultState;
};
export const Filter: React.FC<Props> = ({ value, getSearchResult }) => {
  const { filters, setFilters } = useFilterStore();
  const { setSearchResult } = useSearchResults();

  const handleCheckbox = (filterName: string, filterValue: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const oldFilters = filters;
    let newFilters = oldFilters;
    let check = event.target.checked;
    if (check) {
      newFilters[filterName].push(filterValue);
      setFilters(newFilters);
      setSearchResult(getSearchResult());
    } else {
      var index = newFilters[filterName].indexOf(filterValue);
      if (index > -1) {
        newFilters[filterName].splice(index, 1);
        setFilters(newFilters);
        setSearchResult(getSearchResult());
      }
    }
  };

  return (
    <div style={{ width: "300px" }}>
      <h5 style={{ marginBottom: "5px" }}>
        <strong style={{ color: "#337ab7" }}>{value.title}</strong>
      </h5>

      <ul className="browse-list list-unstyled long-list">
        {Object.entries(value.buckets).map(([_, valueB]) => {
          return (
            <li key={valueB.key}>
              <div
                className="checkbox block"
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
              >
                <label>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={filters[value.name].indexOf(valueB.key) > -1}
                    onChange={handleCheckbox(value.name, valueB.key)}
                  />
                  {valueB.key} ({valueB.doc_count})
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

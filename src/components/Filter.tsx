import { ChangeEvent } from "react";

import { useFilterStore } from "../stores/useFilterStore";
import { usePageStore } from "../stores/usePage";
import { SearchResultState } from "../stores/useSearchResult";
import { CheckBox } from "./ui/CheckBox";

type Props = {
  value: {
    name: string;
    title: string;
    buckets: { key: string; doc_count: number; selected: boolean }[];
  };
  getSearchResult: () => SearchResultState;
};
export const Filter: React.FC<Props> = ({ value }) => {
  const { filters, setFiltersWithField } = useFilterStore();
  const { setPage } = usePageStore();

  const handleCheckbox = (filterName: string, filterValue: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let check = event.target.checked;
    setFiltersWithField(filterName, filterValue, check ? "ADD" : "REMOVE");
    setPage(1);
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
                <CheckBox
                  checkValue={valueB.key}
                  size="small"
                  checked={filters[value.name].indexOf(valueB.key) > -1}
                  onChange={handleCheckbox(value.name, valueB.key)}
                >
                  {valueB.key} ({valueB.doc_count})
                </CheckBox>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

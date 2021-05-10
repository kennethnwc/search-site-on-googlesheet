import { ChangeEvent, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

import { useFilterStore } from "../stores/useFilterStore";
import { usePageStore } from "../stores/usePage";
import { SearchResultState } from "../stores/useSearchResult";
import { classNames } from "./layout/helper";
import { CheckBox } from "./ui/CheckBox";
import { LinkButton } from "./ui/LinkButton";

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
  const hasMore = value.buckets.length > 5;
  const [showMore, setShowMore] = useState(true);

  const handleCheckbox = (filterName: string, filterValue: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let check = event.target.checked;
    setFiltersWithField(filterName, filterValue, check ? "ADD" : "REMOVE");
    setPage(1);
  };

  if (value.buckets.length === 0) {
    return null;
  }

  return (
    <div style={{ width: "300px" }}>
      <h5 style={{ marginBottom: "5px" }}>
        <strong style={{ color: "#337ab7" }}>{value.title}</strong>
      </h5>
      <ul className="browse-list list-unstyled long-list">
        {Object.entries(value.buckets).map(([_, valueB], i) => {
          return (
            <li key={valueB.key}>
              <div
                className={classNames(
                  "checkbox",
                  showMore && i > 5 ? "hidden" : "block"
                )}
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
      {hasMore && (
        <LinkButton
          onClick={(e) => {
            e.preventDefault();
            setShowMore((prev) => !prev);
          }}
        >
          <div className="flex" style={{ marginLeft: "-4px" }}>
            {showMore ? (
              <>
                <ChevronDownIcon className="block h-6 w-6" /> See More
              </>
            ) : (
              <>
                <ChevronUpIcon className="block h-6 w-6" /> See Less
              </>
            )}
          </div>
        </LinkButton>
      )}
    </div>
  );
};

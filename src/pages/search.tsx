import itemsjs from "itemsjs";
import lunr, { Index } from "lunr";
import { GetStaticProps } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { init_config } from "../utils/config";
import { customSearch } from "../utils/customSearch";
import { getData } from "../utils/getData";

require(`lunr-languages-zh/lunr.stemmer.support`)(lunr);
require(`lunr-languages-zh/lunr.zh`)(lunr);

type Props = { rows: any[]; l: lunr.Index; response: any };

const AboutPage: React.FC<Props> = ({ rows, l, response }) => {
  const idxRef = useRef(Index.load(l));
  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState(() => {
    let newFilters: { [key: string]: any[] } = {};
    Object.keys(init_config.aggregations).map((v) => (newFilters[v] = []));
    return newFilters;
  });

  const [itemsjsState] = useState(itemsjs(rows, init_config));

  const getSearchResult = () => {
    const search_result = customSearch({
      query: query,
      rows: rows,
      idx: idxRef.current,
    });
    const result = itemsjsState.search({
      ids: search_result.map((v) => v.ref),
      filters,
    });
    return result;
  };

  const [searchResult, setSearchResult] = useState(getSearchResult());

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

  const changeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setSearchResult(getSearchResult());
  }, [query]);

  return (
    <div className="mx-auto px-4">
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container px-4">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              Header
            </a>
          </div>
          <div id="navbar">
            <form className="navbar-form navbar-left">
              <div className="form-group">
                <input
                  type="text"
                  value={query}
                  onChange={changeQuery}
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </form>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>List of items ({searchResult.pagination.total})</h1>

        {/* <p className="text-muted">
          Search performed in {searchResult.timings.search} ms, facets in{" "}
          {searchResult.timings.facets} ms
        </p> */}
        <div className="flex flex-row">
          <div id="facet-list">
            {Object.entries<any>(searchResult.data.aggregations).map(
              ([key, value]) => {
                return (
                  <div key={key} style={{ width: "300px" }}>
                    <h5 style={{ marginBottom: "5px" }}>
                      <strong style={{ color: "#337ab7" }}>
                        {value.title}
                      </strong>
                    </h5>

                    <ul className="browse-list list-unstyled long-list">
                      {Object.entries<any>(value.buckets).map(([_, valueB]) => {
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
                                  checked={
                                    filters[value.name].indexOf(valueB.key) > -1
                                  }
                                  onChange={handleCheckbox(
                                    value.name,
                                    valueB.key
                                  )}
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
              }
            )}
          </div>
          <div className="">
            {Object.entries<any>(searchResult.data.items).map(([key, item]) => {
              return (
                <div
                  key={key}
                  className="shadow-xl bg-white rounded-lg p-6 my-6"
                >
                  {Object.entries(item).map(([a, b]) => (
                    <div key={a}>
                      {a} : {b}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

export const getStaticProps: GetStaticProps = async () => {
  const response = await getData(process.env.SPREADSHEET_ID!);
  let rows: { [key: string]: string }[] = [];

  if (response) {
    const header = response[0];
    const data = response.slice(1);
    for (let j = 0; j < data.length; j++) {
      let temp: any = {};
      for (let k = 0; k < data[j].length; k++) {
        const val = data[j][k];
        if (val === "") {
          continue;
        }
        if (header[k].toLowerCase() in temp) {
          const old = temp[header[k].toLowerCase()];
          if (typeof old === "string") {
            temp[header[k].toLowerCase()] = [old, val];
          } else {
            temp[header[k].toLowerCase()] = [...old, val];
          }
        } else {
          temp[header[k].toLowerCase()] = val;
        }
      }
      rows.push(temp);
    }
  }

  const l = lunr(function () {
    this.use((lunr as any).zh);
    this.ref("id");
    init_config.searchableFields.forEach((field) => {
      this.field(field);
    });
    rows.forEach((v) => {
      this.add(v);
    });
  });

  return {
    props: {
      response,
      rows,
      l: l.toJSON(),
    },
    revalidate: 10, // In seconds
  };
};

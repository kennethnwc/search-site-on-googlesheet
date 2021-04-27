import itemsjs from "itemsjs";
import lunr from "lunr";
import { GetStaticProps } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { customSearch } from "../utils/customSearch";
import { getData } from "../utils/getData";

const configuration = {
  native_search_enabled: false,
  searchableFields: [
    "title",
    "subjects",
    "author",
    "abstract",
    "title in chinese (if applicable)",
    "abstract in chinese",
  ],
  aggregations: {
    "subject level 1": {
      title: "subject level 1",
      size: 10,
    },
    "subject level 2": { title: "subject level 2", size: 10 },
    author: {
      title: "author",
      size: 10,
    },
  },
};

type Props = { rows: any[] };

const AboutPage: React.FC<Props> = ({ rows }) => {
  console.log(rows);

  const idxRef = useRef(
    lunr(function () {
      this.ref("id");
      configuration.searchableFields.forEach((field) => {
        this.field(field);
      });

      rows.forEach((v) => {
        this.add(v);
      });
    })
  );
  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState(() => {
    let newFilters: { [key: string]: any[] } = {};
    Object.keys(configuration.aggregations).map((v) => (newFilters[v] = []));
    return newFilters;
  });

  const [itemsjsState] = useState(itemsjs(rows, configuration));

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
              ItemsJS movies
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

      <div className="container" style={{ marginTop: "50px" }}>
        <h1>List of items ({searchResult.pagination.total})</h1>
        <p className="text-muted">
          Search performed in {searchResult.timings.search} ms, facets in{" "}
          {searchResult.timings.facets} ms
        </p>
        <div className="row">
          <div className="col-md-2 col-xs-2">
            {Object.entries<any>(searchResult.data.aggregations).map(
              ([key, value]) => {
                return (
                  <div key={key}>
                    <h5 style={{ marginBottom: "5px" }}>
                      <strong style={{ color: "#337ab7" }}>
                        {value.title}
                      </strong>
                    </h5>

                    <ul
                      className="browse-list list-unstyled long-list"
                      style={{ marginBottom: "0px" }}
                    >
                      {Object.entries<any>(value.buckets).map(
                        ([keyB, valueB]) => {
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
                                      filters[value.name].indexOf(valueB.key) >
                                      -1
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
                        }
                      )}
                    </ul>
                  </div>
                );
              }
            )}
          </div>
          <div className="col-md-10 col-xs-10">
            <div className="breadcrumbs"></div>
            <div className="clearfix"></div>
            <table className="table table-striped">
              <tbody>
                {Object.entries<any>(searchResult.data.items).map(
                  ([key, item]) => {
                    return (
                      <tr key={key}>
                        <td></td>
                        <td>
                          <b>{item.title}</b>
                          <br />
                          <div>{item.id}</div>
                          <pre>{JSON.stringify(item.author)}</pre>
                          <pre>{JSON.stringify(item.subjects)}</pre>
                        </td>
                        <td></td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await getData(process.env.SPREADSHEET_ID!);
  let rows: { [key: string]: string }[] = [];

  if (response) {
    const header = response[0];
    const data = response.slice(1);
    for (let j = 0; j < data.length; j++) {
      let temp: any = {};
      for (let k = 0; k < data[j].length; k++) {
        temp[header[k].toLowerCase()] = data[j][k];
      }
      rows.push(temp);
    }
  }

  return {
    props: {
      response,
      rows,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 10, // In seconds
  };
};

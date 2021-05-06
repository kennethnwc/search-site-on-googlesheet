import itemsjs from "itemsjs";
import lunr, { Index } from "lunr";
import { GetStaticProps } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Filter } from "../components/Filter";
import { ItemCard } from "../components/ItemCard";
import { Layout } from "../components/layout/Layout";
import { useFilterStore } from "../stores/useFilterStore";
import { SearchResultState, useSearchResults } from "../stores/useSearchResult";
import { init_config } from "../utils/config";
import { customSearch } from "../utils/customSearch";
import { getData } from "../utils/getData";

require(`lunr-languages-zh/lunr.stemmer.support`)(lunr);
require(`lunr-languages-zh/lunr.zh`)(lunr);

type Props = { rows: any[]; l: lunr.Index; response: any };

const AboutPage: React.FC<Props> = ({ rows, l, response }) => {
  const idxRef = useRef(Index.load(l));
  const [query, setQuery] = useState("");

  const { filters } = useFilterStore();

  const [itemsjsState] = useState(itemsjs(rows, init_config));
  const { searchResult, setSearchResult } = useSearchResults();

  useEffect(() => {
    setSearchResult(getSearchResult());
  }, []);

  const getSearchResult = (): SearchResultState => {
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

  const changeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setSearchResult(getSearchResult());
  }, [query]);

  return (
    <Layout title="Search">
      <div className="mx-auto px-4">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="relative md:px-12 md:py-2 ">
            <input
              type="search"
              className="w-full bg-purple-white shadow rounded border-0 p-3 "
              placeholder="Search by name..."
              value={query}
              onChange={changeQuery}
            />
            <div className="absolute pin-r pin-t mt-3 mr-4 text-purple-lighter"></div>
          </div>
        </nav>
        <section className="text-gray-600 body-font">
          <div className="container flex flex-wrap  mx-auto">
            <div className="md:w-1/4 md:pr-12 md:py-8 md:border-r md:border-b-0 mb-10 md:mb-0 pb-10 border-b border-gray-200">
              <div id="facet-list">
                {Object.entries<any>(searchResult.data.aggregations).map(
                  ([key, value]) => {
                    return (
                      <Filter
                        key={key}
                        value={value}
                        getSearchResult={getSearchResult}
                      />
                    );
                  }
                )}
              </div>
            </div>
            <div className="flex flex-col md:w-3/4 md:pl-12 md:pr-12 md:py-8">
              <div>List of items ({searchResult.pagination.total})</div>
              {Object.entries<any>(searchResult.data.items).map(
                ([key, item]) => {
                  return <ItemCard id={key} key={key} raw={item} />;
                }
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
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

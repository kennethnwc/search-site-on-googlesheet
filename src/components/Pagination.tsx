import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

import { classNames } from "../components/layout/helper";
import { usePageStore } from "../stores/usePage";

interface Props {
  totalPages?: number;
  isBottom?: boolean;
  numFounds: number;
  isTop?: boolean;
}

export const Pagination = ({ numFounds }: Props) => {
  const rows = 12;
  const { page: pageState, setPage } = usePageStore();
  let currentPage = pageState;

  const totalPages = Math.ceil((numFounds || 0) / rows);

  let pageList =
    totalPages < 8
      ? Array.from(new Array(totalPages), (__, index) => index + 1)
      : currentPage < 4
      ? [1, 2, 3, 0, totalPages]
      : currentPage > totalPages - 4
      ? [1, 0, totalPages - 2, totalPages - 1, totalPages]
      : [1, 0, currentPage - 1, currentPage, currentPage + 1, 0, totalPages];

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
        >
          Previous
        </a>
        <a
          href="#"
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(pageState - 1) * 12 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pageState * 12, numFounds!)}
            </span>{" "}
            of <span className="font-medium">{numFounds}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => {
                setPage(pageState - 1 >= 1 ? pageState - 1 : 1);
              }}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pageList.map((page, i) => {
              return (
                <button
                  key={`page-${i}`}
                  className={classNames(
                    "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium",
                    page === pageState
                      ? "bg-teal-500 text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => {
                    setPage(page);
                  }}
                >
                  {page >= 1 ? page : <span>&hellip;</span>}
                </button>
              );
            })}
            <button
              onClick={() => {
                setPage(
                  pageState + 1 <= totalPages ? pageState + 1 : totalPages
                );
              }}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export const init_config = {
  native_search_enabled: false,
  searchableFields: [
    "title",
    "abstract",
    "title in chinese (if applicable)",
    "abstract in chinese",
  ],
  aggregations: {
    subject: {
      title: "subject",
      size: 50,
    },
    year: {
      title: "Year",
      size: 10,
    },
    author: {
      title: "Author",
      size: 10,
    },
  },
};

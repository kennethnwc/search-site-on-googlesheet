export const init_config = {
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
        type: {
            title: "Type",
            size: 10,
        },
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
}
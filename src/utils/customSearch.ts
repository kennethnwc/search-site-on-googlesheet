type Params = {
    rows: any[]
    query?: string
    idx: lunr.Index
}
export const customSearch = ({ rows, query, idx }: Params) => {
    if (!query) {
        return rows.map(({ id }) => ({ ref: id }))
    }
    return idx.search(query)
}
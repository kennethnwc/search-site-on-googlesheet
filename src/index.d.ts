// export as namespace itemsjs
// export = itemsjs

declare module "itemsjs" {
  function itemsjs(items: any, configuration: any) {
    return {
      search: (input: {
        query?: string;
        filters?: any;
        ids?: any;
        page?: number;
        per_page?: number;
        sort?: string;
      }): {
        data: { items: any[]; aggregations: any[] };
        pagination: any;
        timings: any;
      } => ({ data, pagination, timings }),
    };
  }
  export default itemsjs;
}

declare module "lunr-languages-zh" {
  export = any;
}

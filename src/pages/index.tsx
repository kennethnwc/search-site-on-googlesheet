import { NextPage } from "next";
import React from "react";

import { Layout } from "../components/Layout";

type Props = {
  reasons: any[];
  response: any;
};

const IndexPage: NextPage<Props> = () => {
  return (
    <Layout title="About">
      <h1>Hello About! 👋</h1>
    </Layout>
  );
};

export default IndexPage;

import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";

import { getData } from "../utils/getData";

type Props = {
  reasons: any[];
  response: any;
};

const IndexPage: NextPage<Props> = ({ reasons }) => {
  return (
    <>
      <Link href="/search">Search</Link>
    </>
  );
};

export default IndexPage;

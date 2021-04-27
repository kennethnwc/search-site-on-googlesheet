import { NextPage } from "next";
import Link from "next/link";
import React from "react";

import nodejibea from "nodejieba";

type Props = {
  reasons: any[];
  response: any;
};

const IndexPage: NextPage<Props> = ({ reasons }) => {
  console.log(nodejibea.cut("hello my friend", true));
  return (
    <>
      <Link href="/search">Search</Link>
    </>
  );
};

export default IndexPage;

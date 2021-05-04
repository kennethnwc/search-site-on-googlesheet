import { NextPage } from "next";
import Link from "next/link";
import React from "react";

type Props = {
  reasons: any[];
  response: any;
};

const IndexPage: NextPage<Props> = () => {
  return (
    <>
      <Link href="/search">Search</Link>
    </>
  );
};

export default IndexPage;

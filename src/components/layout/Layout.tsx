import Head from "next/head";
import React from "react"; // we need this to make JSX compile

import { NavBar } from "./NavBar";

type LayoutProps = {
  title?: string;
};

const layoutStyle = {
  // margin: 20,
  // padding: 20,
  border: "1px solid #DDD",
};

export const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  title,
}) => (
  <div style={layoutStyle}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <NavBar />
    </header>
    {children}
  </div>
);

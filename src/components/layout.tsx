import type { PropsWithChildren } from "react";
import React from "react";
import Head from "next/head";
import { NavBar } from "./navbar";

interface LayoutProps {
  title: string;
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{`${title} | hr0`}</title>
        <meta name="description" content="Demo HR App built on Auth0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="items-center justify-center">{children}</main>
    </>
  );
};

import type { PropsWithChildren } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>{`${title} | hr0`}</title>
        <meta name="description" content="Demo HR App built on Auth0" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon mask-icon"
          href="https://cdn.auth0.com/website/auth0_favicon.svg"
          color="#000000"
        />
        <link
          rel="shortcut icon"
          href="https://cdn.auth0.com/website/new-homepage/dark-favicon.png"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Learn how to add user authentication to React apps easily."
        />
        <link rel="stylesheet" href="../public/output.css"></link>
      </Helmet>

      <NavBar />
      <main className="items-center justify-center">{children}</main>
    </>
  );
};

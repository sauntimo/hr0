import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "./providers/auth0-provider-with-navigate";
import { App } from "./routes";
import { HelmetProvider } from "react-helmet-async";

import "./state/app-state";
import { BreadcrumbProvider } from "./hooks/useBreadcrumbs";
import { SupabaseProvider } from "./hooks/useSupabase";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <HelmetProvider>
        <SupabaseProvider>
          <BreadcrumbProvider>
            <App />
          </BreadcrumbProvider>
        </SupabaseProvider>
      </HelmetProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
  // </React.StrictMode>
);

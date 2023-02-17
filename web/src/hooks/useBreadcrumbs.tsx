import { createContext, useEffect, useRef, useState } from "react";
import { removeTrailingSlash } from "../utils/string";
import { useLocation } from "react-router-dom";

interface BreadcrumbContext {
  setBreadcrumbs?: (items: BreadcrumbItem[]) => void;
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  to: string;
  text: string;
  link: boolean;
}

export const BreadcrumbContext = createContext<BreadcrumbContext>({
  breadcrumbs: [],
});

interface BreadcrumbProviderProps {
  children: JSX.Element;
}

export const BreadcrumbProvider = ({
  children,
}: BreadcrumbProviderProps): JSX.Element => {
  const location = useLocation();

  const [breadcrumbsFromApp, setBreadcrumbsFromApp] = useState<
    BreadcrumbItem[]
  >([]);
  const [breadcrumbsFromLocation, setBreadcrumbsFromLocation] = useState<
    BreadcrumbItem[]
  >([]);

  const setManually = useRef(false);

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    setBreadcrumbsFromApp(items);
    setBreadcrumbsFromLocation([]);
    setManually.current = true;
  };

  useEffect(() => {
    if (location.pathname === "/" && !setManually.current) {
      setBreadcrumbsFromApp([]);
      setBreadcrumbsFromLocation([]);
      return;
    }
    const paths = removeTrailingSlash(location.pathname).split("/");

    const breadcrumbs: BreadcrumbItem[] = paths.map((item, index, array) => {
      const items = array.slice(0, index + 1);
      const fullPath = items.map((item) => `${item}/`).join("");

      return {
        to: removeTrailingSlash(fullPath),
        text: item === "" ? "Home" : item,
        link: index < array.length - 1,
      };
    });

    if (!setManually.current) {
      setBreadcrumbsFromApp([]);
      setBreadcrumbsFromLocation(breadcrumbs);
    }
  }, [location.pathname]);

  useEffect(() => {
    setManually.current = false;
  }, [location.pathname]);

  return (
    <BreadcrumbContext.Provider
      value={{
        setBreadcrumbs,
        breadcrumbs:
          breadcrumbsFromApp.length > 0
            ? breadcrumbsFromApp
            : breadcrumbsFromLocation,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

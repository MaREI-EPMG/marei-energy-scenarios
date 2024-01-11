/*
This uses the matomo analytics package for websites

The main js file is served from AZPS's energynumbers.info site,
and the analytics data is held there in a mariaDB.

Ask AZPS for the login details to
https://energynumbers.info/matomo/index.php?module=CoreHome&action=index&idSite=34
to view the data.

*/

import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export function useMatomoPageView() {
  const location = useLocation();
  const timeoutRef = useRef(null);
  const [searchParams, unused] = useSearchParams();
  
  // prevent the tracker from being called more than once in less than 1000ms
  const debounce = (callback, delay) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

  };

  const recordPageView = () => {
    const thisPath = location.pathname
    window._paq.push(["setCustomUrl", thisPath]);
    window._paq.push(["setDocumentTitle", document.title]);

    const pathbits = thisPath.split("/");
    const project = (pathbits.length > 1) ? pathbits[1] : null;
    const page = (pathbits.length > 2) ? pathbits[2] : null;

    if (project) {
      window._paq.push([
        "setCustomVariable",
        1,
        "project",
        project,
        "page"
      ]);
      if (page === "results" && searchParams.has("scen1")) {
        // when we're viewing charts, track the scenarios & charts being viewed 
        window._paq.push([
            "setCustomVariable",
            2,
            "scenario1",
            project + ">" + searchParams.get("scen1"),
            "page"
        ]);
        if (searchParams.has("scen2")) {
          window._paq.push([
              "setCustomVariable",
              3,
              "scenario2",
              project + ">" + searchParams.get("scen2"),
              "page"
          ]);
        }
        const chartPage = (pathbits.length < 4) 
          ? null
          : (pathbits[3] + ">" +
              ((pathbits.length > 4) ? pathbits[4] : ""));

        if (chartPage) {
          window._paq.push([
              "setCustomVariable",
              4,
              "charts",
              chartPage,
              "page"
          ]);
        }

      }
    }

    window._paq.push(["trackPageView"]);
  };
  
  const debouncePageView = () => {
    debounce(recordPageView, 1000);
  }

  // track the page every time it changes
  useEffect(debouncePageView);
}

export default useMatomoPageView;

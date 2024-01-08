import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useMatomoPageView() {
  const location = useLocation();
  const timeoutRef = useRef(null);
  
  const debounce = (callback, delay) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

  };

  const recordPageView = () => {
    console.log("tracking");
    window._paq.push(["setCustomUrl", location.pathname]);
    window._paq.push(["setDocumentTitle", document.title]);
    /*
    window._paq.push([
        "setCustomVariable",
        1,
        "charts",
        location.search,
        "visit"
    ]);
    */
    window._paq.push(["trackPageView"]);
  };
  
  const debouncePageView = () => {
    debounce(recordPageView, 1000);
  }

  useEffect(debouncePageView);
}

export default useMatomoPageView;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If Lenis is active globally, reset scroll position using Lenis
    const globalWindow = window as any;
    if (globalWindow.lenis) {
      globalWindow.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

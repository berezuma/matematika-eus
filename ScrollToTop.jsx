import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Orrialdez aldatzen den bakoitzean (pathname aldatzean), gora igotzen da
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

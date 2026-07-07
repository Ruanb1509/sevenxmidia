import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ao trocar de rota, leva a página para o topo (instantâneo, ignorando o
 * scroll-behavior: smooth global). Se a URL tiver hash (ex.: /#pricing),
 * rola até o elemento correspondente depois que a página renderiza.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

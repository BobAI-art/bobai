import { useEffect } from "react";

export const useEndOfPage = (onEnd: () => void, disabled = false) => {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    const scrollTop = window.document.scrollingElement?.scrollTop || 0;
    const scrollHeight = window.document.scrollingElement?.scrollHeight || 0;
    const clientHeight = window.document.scrollingElement?.clientHeight || 0;
    if (!disabled && scrollTop > (scrollHeight - clientHeight) * 0.8) {
      window.removeEventListener("scroll", handleScroll);
      onEnd();
    }
  };
};

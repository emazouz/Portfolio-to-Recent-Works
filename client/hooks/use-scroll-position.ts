import { useEffect, useState } from "react";

export const useScrollPosition = (delay: number = 10) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Set initial scroll position
    setScrollY(window.scrollY);

    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout for debouncing
      timeoutId = setTimeout(() => {
        setScrollY(window.scrollY);
      }, delay);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [delay]);

  return scrollY;
};

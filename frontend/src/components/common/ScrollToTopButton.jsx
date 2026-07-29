import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) setIsVisible(true);
      else setIsVisible(false);

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className={`scroll-to-top hidden sm:block fixed bottom-22 sm:bottom-6 right-2.5 sm:right-6 p-3 rounded-full bg-accent text-white shadow-lg hover:bg-primary z-50 cursor-pointer transition-all duration-500 ${
          isAtBottom
            ? "opacity-0 pointer-events-none scale-50"
            : "opacity-100 scale-100"
        }`}
      >
        <ArrowUp size={22} />
      </button>
    )
  );
};

export default ScrollToTopButton;

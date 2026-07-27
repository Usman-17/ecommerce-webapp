import { useRef, useEffect } from "react";

export const useAutoFocus = (isOpen) => {
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return firstInputRef;
};

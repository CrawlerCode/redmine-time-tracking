import { RefObject, useEffect } from "react";

const useOnClickOutside = <T extends HTMLElement>(ref: RefObject<T | null>, handler: (event: Event) => void) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      if (event.target instanceof Element && event.target.shadowRoot) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;

import { useCallback, useEffect } from "react";

const useHotKey = (callback: () => void, hotkey: { key: string; ctrl?: boolean }, prevent = true) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === hotkey.key && (hotkey.ctrl ? e.ctrlKey : true)) {
        callback();
        if (prevent) e.preventDefault();
      }
    },
    [callback, hotkey, prevent]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

export default useHotKey;

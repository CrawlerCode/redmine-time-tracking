import { useCallback, useEffect } from "react";

const useHotKey = (callback: () => void, hotkey: { key?: string; code?: string; ctrl?: boolean }, prevent = true) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!e.key && !e.code) return;
      if ((hotkey.ctrl ? e.ctrlKey : true) && (e.key === hotkey.key || e.code === hotkey.code)) {
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

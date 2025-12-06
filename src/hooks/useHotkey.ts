import { useCallback, useEffect } from "react";

const useHotKey = (hotkey: { key?: string; code?: string; ctrl?: boolean }, callback: (e: KeyboardEvent) => void, enabled = true) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (!e.key && !e.code) return;
      if ((hotkey.ctrl ? e.ctrlKey : true) && (e.key === hotkey.key || e.code === hotkey.code)) {
        callback(e);
        e.preventDefault();
      }
    },
    [callback, hotkey, enabled]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

export default useHotKey;

import { useContext } from "react";
import { SettingsContext } from "../provider/SettingsProvider";

/**
 * Use settings context
 */
const useSettings = () => {
  return useContext(SettingsContext);
};

export default useSettings;

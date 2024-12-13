import { use } from "react";
import { SettingsContext } from "../provider/SettingsProvider";

/**
 * Use settings context
 */
const useSettings = () => {
  return use(SettingsContext);
};

export default useSettings;

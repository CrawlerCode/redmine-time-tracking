import deepmerge from "deepmerge";
import { useContext } from "react";
import { Settings, SettingsContext, defaultSettings } from "../provider/SettingsProvider";
import { getStorage } from "./useStorage";

/**
 * Use settings context
 */
const useSettings = () => {
  return useContext(SettingsContext);
};

/**
 * Get the settings from storage
 */
export const getSettings = async () => {
  const data = await getStorage<Settings>("settings", defaultSettings);
  return deepmerge<Settings>(defaultSettings, data);
};

export default useSettings;

import deepmerge from "deepmerge";
import { loadRedmineConfig } from "../api/axios.config";
import useStorage, { getChromeStorage } from "./useStorage";

export type Settings = {
  language: string;
  redmineURL: string;
  redmineApiKey: string;
  options: {
    autoPauseOnSwitch: boolean;
    extendedSearch: boolean;
    roundTimeNearestQuarterHour: boolean;
  };
};

const defaultSettings = {
  language: "browser",
  redmineURL: "",
  redmineApiKey: "",
  options: {
    autoPauseOnSwitch: true,
    extendedSearch: true,
    roundTimeNearestQuarterHour: false,
  },
};

const useSettings = () => {
  const { data, setData } = useStorage<Settings>("settings", defaultSettings);

  return {
    settings: deepmerge<Settings>(defaultSettings, data),
    setSettings: (data: Settings) => {
      setData(data);
      loadRedmineConfig();
    },
  };
};

export const getSettings = async () => {
  const data = await getChromeStorage<Settings>("settings", defaultSettings);
  return deepmerge<Settings>(defaultSettings, data);
};

export default useSettings;

import deepmerge from "deepmerge";
import { loadRedmineConfig } from "../api/axios.config";
import useStorage, { getStorage } from "./useStorage";

export type Settings = {
  redmineURL: string;
  redmineApiKey: string;
  options: {
    autoPauseOnSwitch: boolean;
  };
};

const defaultSettings = {
  redmineURL: "",
  redmineApiKey: "",
  options: {
    autoPauseOnSwitch: true,
  },
};

const useSettings = () => {
  const { data: settings, setData: setSettings } = useStorage<Settings>("settings", defaultSettings);

  return {
    settings: deepmerge<Settings>(defaultSettings, settings),
    setSettings: (data: Settings) => {
      setSettings(data);
      loadRedmineConfig();
    },
  };
};

export const getSettings = () => {
  return getStorage<Settings>("settings", defaultSettings);
};

export default useSettings;

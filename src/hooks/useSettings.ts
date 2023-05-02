import { loadRedmineConfig } from "../api/axios.config";
import useStorage, { getStorage } from "./useStorage";

export type Settings = {
  redmineURL: string;
  redmineApiKey: string;
};

const defaultSettings = { redmineURL: "", redmineApiKey: "" };

const useSettings = () => {
  const { data: settings, setData: setSettings } = useStorage<Settings>("settings", defaultSettings);

  return {
    settings,
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

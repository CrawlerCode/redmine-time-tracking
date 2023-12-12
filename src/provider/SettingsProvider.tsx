import deepmerge from "deepmerge";
import { ReactNode, createContext } from "react";
import { loadRedmineConfig } from "../api/axios.config";
import useStorage from "../hooks/useStorage";

export type Settings = {
  language: string;
  redmineURL: string;
  redmineApiKey: string;
  options: {
    autoPauseOnSwitch: boolean;
    extendedSearch: boolean;
    roundTimeNearestQuarterHour: boolean;
    addSpentTimeForOtherUsers: boolean;
    cacheComments: boolean;
    addNotes: boolean;
  };
};

export const defaultSettings: Settings = {
  language: "browser",
  redmineURL: "",
  redmineApiKey: "",
  options: {
    autoPauseOnSwitch: true,
    extendedSearch: true,
    roundTimeNearestQuarterHour: false,
    addSpentTimeForOtherUsers: false,
    cacheComments: true,
    addNotes: false,
  },
};

const SettingsContext = createContext({
  settings: defaultSettings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSettings: (_data: Settings) => undefined,
});

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, setData } = useStorage<Settings>("settings", defaultSettings);

  return (
    <SettingsContext.Provider
      value={{
        settings: deepmerge<Settings>(defaultSettings, data),
        setSettings: (data: Settings) => {
          setData(data);
          loadRedmineConfig();
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext };
export default SettingsProvider;

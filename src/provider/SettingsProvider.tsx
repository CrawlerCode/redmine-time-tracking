import deepmerge from "deepmerge";
import { ReactNode, createContext } from "react";
import useStorage from "../hooks/useStorage";

export type Settings = {
  language: string;
  redmineURL: string;
  redmineApiKey: string;
  features: {
    autoPauseOnSwitch: boolean;
    extendedSearch: boolean;
    roundTimeNearestQuarterHour: boolean;
    cacheComments: boolean;
    addNotes: boolean;
  };
  style: {
    stickyScroll: boolean;
    groupIssuesByVersion: boolean;
    showIssuesPriority: boolean;
    sortIssuesByPriority: boolean;
    pinTrackedIssues: boolean;
    showTooltips: boolean;
    timeFormat: "decimal" | "minutes";
  };
};

const defaultSettings: Settings = {
  language: "browser",
  redmineURL: "",
  redmineApiKey: "",
  features: {
    autoPauseOnSwitch: true,
    extendedSearch: true,
    roundTimeNearestQuarterHour: false,
    cacheComments: true,
    addNotes: false,
  },
  style: {
    stickyScroll: true,
    groupIssuesByVersion: true,
    showIssuesPriority: true,
    sortIssuesByPriority: true,
    pinTrackedIssues: false,
    showTooltips: true,
    timeFormat: "decimal",
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
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext };
export default SettingsProvider;

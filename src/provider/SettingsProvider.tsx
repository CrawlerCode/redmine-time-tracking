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
    roundTimeNearestQuarterHour?: boolean;
    roundToNearestInterval: boolean;
    roundingInterval: number;
    cacheComments: boolean;
    addNotes: boolean;
  };
  style: {
    displaySearchAlways: boolean;
    stickyScroll: boolean;
    groupIssuesByVersion: boolean;
    showIssuesPriority: boolean;
    sortIssuesByPriority: boolean;
    pinTrackedIssues: boolean;
    pinActiveTabIssue: boolean;
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
    roundToNearestInterval: false,
    roundingInterval: 15,
    cacheComments: true,
    addNotes: false,
  },
  style: {
    displaySearchAlways: false,
    stickyScroll: true,
    groupIssuesByVersion: true,
    showIssuesPriority: true,
    sortIssuesByPriority: true,
    pinTrackedIssues: false,
    pinActiveTabIssue: true,
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

  // Migrate old settings TODO: Remove in future
  if (data.features.roundTimeNearestQuarterHour === true) {
    data.features.roundTimeNearestQuarterHour = undefined;
    data.features.roundToNearestInterval = true;
    data.features.roundingInterval = 15;
    setData(data);
  }

  return (
    <SettingsContext
      value={{
        settings: deepmerge<Settings>(defaultSettings, data),
        setSettings: (data: Settings) => {
          setData(data);
        },
      }}
    >
      {children}
    </SettingsContext>
  );
};

export { SettingsContext };
export default SettingsProvider;

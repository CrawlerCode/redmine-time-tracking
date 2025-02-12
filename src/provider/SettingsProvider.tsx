import deepmerge from "deepmerge";
import { ReactNode, createContext, use } from "react";
import useStorage, { getStorage } from "../hooks/useStorage";

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
    showCurrentIssueTimer: boolean;
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
    showCurrentIssueTimer: true,
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

export const getSettings = async () => {
  const data = await getStorage<Partial<Settings>>("settings", defaultSettings);
  return deepmerge<Settings>(defaultSettings, data);
};

const SettingsContext = createContext({
  settings: defaultSettings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSettings: (_data: Settings) => undefined,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, setData } = useStorage<Partial<Settings>>("settings", defaultSettings);

  // Migrate old settings TODO: Remove in future
  if (data?.features?.roundTimeNearestQuarterHour === true) {
    data.features.roundTimeNearestQuarterHour = undefined;
    data.features.roundToNearestInterval = true;
    data.features.roundingInterval = 15;
    setData(data);
  }

  return (
    <SettingsContext
      value={{
        settings: deepmerge<Settings>(defaultSettings, data),
        setSettings: (newData: Settings) => {
          setData(newData);
          if (newData.redmineURL !== data.redmineURL) {
            chrome.runtime.sendMessage("settings-changed:redmineURL");
          }
          if (newData.features.showCurrentIssueTimer !== data.features?.showCurrentIssueTimer) {
            chrome.runtime.sendMessage("settings-changed:showCurrentIssueTimer");
          }
        },
      }}
    >
      {children}
    </SettingsContext>
  );
};

export const useSettings = () => use(SettingsContext);

export default SettingsProvider;

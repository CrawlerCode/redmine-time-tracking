import deepmerge from "deepmerge";
import { ReactNode, createContext, use } from "react";
import { browser } from "wxt/browser";
import { getStorage, useSuspenseStorage } from "../hooks/useStorage";

export type Settings = {
  language: string;
  redmineURL: string;
  redmineApiKey: string;
  features: {
    autoPauseOnSwitch: boolean;
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
  setSettings: (_data: Settings) => undefined,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, setData } = useSuspenseStorage<Partial<Settings>>("settings", defaultSettings);

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
            browser.runtime.sendMessage("settings-changed:redmineURL");
          }
          if (newData.features.showCurrentIssueTimer !== data.features?.showCurrentIssueTimer) {
            browser.runtime.sendMessage("settings-changed:showCurrentIssueTimer");
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

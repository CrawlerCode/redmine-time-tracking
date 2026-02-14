import deepmerge from "deepmerge";
import { ReactNode, createContext, use } from "react";
import { useIntl } from "react-intl";
import { browser } from "wxt/browser";
import { z } from "zod";
import { getStorage, setStorage, useStorage } from "../hooks/useStorage";
import { LANGUAGES } from "./IntlProvider";

export const settingsSchema = ({ formatMessage }: { formatMessage?: ReturnType<typeof useIntl>["formatMessage"] } = {}) =>
  z.object({
    language: z.enum(["browser", ...LANGUAGES]),
    redmineURL: z
      .string(formatMessage?.({ id: "settings.redmine.url.validation.required" }))
      .nonempty(formatMessage?.({ id: "settings.redmine.url.validation.required" }))
      .regex(/^(http|https):\/\/[\w\-.]+(\.\w+)*(:[0-9]+)?[\w\-/]*\/?$/, formatMessage?.({ id: "settings.redmine.url.validation.valid-url" })),
    redmineApiKey: z.string().nonempty(formatMessage?.({ id: "settings.redmine.api-key.validation.required" })),
    features: z.object({
      autoPauseOnSwitch: z.boolean(),
      roundTimeNearestQuarterHour: z.boolean().optional(), // ! Legacy
      roundToNearestInterval: z.boolean().optional(), // ! Legacy
      roundToInterval: z.boolean(),
      roundingMode: z.enum(["down", "nearest", "up"]),
      roundingInterval: z
        .int(formatMessage?.({ id: "settings.features.rounding-interval.validation.required" }))
        .min(1, formatMessage?.({ id: "settings.features.rounding-interval.validation.greater-than-zero" }))
        .max(60, formatMessage?.({ id: "settings.features.rounding-interval.validation.less-than-or-equals-sixty" })),
      addNotes: z.boolean().optional(), // ! Legacy
      cacheComments: z.boolean().optional(), // ! Legacy
      persistentComments: z.boolean(),
      showCurrentIssueTimer: z.boolean(),
    }),
    style: z.object({
      displaySearchAlways: z.boolean(),
      stickyScroll: z.boolean(),
      groupIssuesByVersion: z.boolean(),
      showIssuesPriority: z.boolean(),
      sortIssuesByPriority: z.boolean(),
      pinTrackedIssues: z.boolean(),
      pinActiveTabIssue: z.boolean(),
      showTooltips: z.boolean(),
      timeFormat: z.enum(["decimal", "minutes"]),
    }),
  });

export type Settings = z.infer<ReturnType<typeof settingsSchema>>;

const defaultSettings: Settings = {
  language: "browser",
  redmineURL: "",
  redmineApiKey: "",
  features: {
    autoPauseOnSwitch: true,
    roundToInterval: false,
    roundingMode: "nearest",
    roundingInterval: 15,
    persistentComments: true,
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

export const runSettingsMigration = async () => {
  const settingsData = await getStorage<Partial<Settings>>("settings", defaultSettings);
  const settings = deepmerge<Settings>(defaultSettings, settingsData);

  if (settings.features.roundTimeNearestQuarterHour === true) {
    settings.features.roundToInterval = true;
    settings.features.roundingMode = "nearest";
    settings.features.roundingInterval = 15;
    settings.features.roundTimeNearestQuarterHour = undefined;
  }

  if (settings.features.roundToNearestInterval === true) {
    settings.features.roundToInterval = true;
    settings.features.roundingMode = "nearest";
    settings.features.roundToNearestInterval = undefined;
  }

  if (typeof settings.features.cacheComments === "boolean") {
    settings.features.persistentComments = settings.features.cacheComments;
    settings.features.cacheComments = undefined;
  }

  if (typeof settings.features.addNotes === "boolean") {
    settings.features.addNotes = undefined;
  }

  if (JSON.stringify(settings) !== JSON.stringify(settingsData)) {
    await setStorage("settings", settings);
  }
};

export const getSettings = async () => {
  const settingsData = await getStorage<Partial<Settings>>("settings", defaultSettings);
  return deepmerge<Settings>(defaultSettings, settingsData);
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: (_data: Settings) => Promise.resolve(),
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { isPending, data: settingsData, setData: setSettingsData } = useStorage<Partial<Settings>>("settings", defaultSettings);
  const settings = deepmerge<Settings>(defaultSettings, settingsData);

  if (isPending) return null;

  return (
    <SettingsContext
      value={{
        settings: settings,
        setSettings: async (newSettings: Settings) => {
          await setSettingsData(newSettings);
          if (newSettings.redmineURL !== settings.redmineURL) {
            browser.runtime.sendMessage("settings-changed:redmineURL");
          }
          if (newSettings.features.showCurrentIssueTimer !== settings.features.showCurrentIssueTimer) {
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

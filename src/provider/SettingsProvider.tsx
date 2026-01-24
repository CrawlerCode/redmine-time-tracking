import deepmerge from "deepmerge";
import { ReactNode, createContext, use } from "react";
import { useIntl } from "react-intl";
import { browser } from "wxt/browser";
import { z } from "zod";
import { getStorage, setStorage, useSuspenseStorage } from "../hooks/useStorage";
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
      addNotes: z.boolean(),
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

export const runSettingsMigration = async () => {
  const rawSettings = await getStorage<Partial<Settings>>("settings", defaultSettings);
  const settings = deepmerge<Settings>(defaultSettings, rawSettings);

  if (settings.features.roundTimeNearestQuarterHour === true) {
    settings.features.roundTimeNearestQuarterHour = undefined;
    settings.features.roundToInterval = true;
    settings.features.roundingMode = "nearest";
    settings.features.roundingInterval = 15;
  }

  if (settings.features.roundToNearestInterval === true) {
    settings.features.roundToNearestInterval = undefined;
    settings.features.roundToInterval = true;
    settings.features.roundingMode = "nearest";
  }

  if (settings.features.cacheComments) {
    settings.features.cacheComments = undefined;
    settings.features.persistentComments = true;
  }

  if (JSON.stringify(settings) !== JSON.stringify(rawSettings)) {
    setStorage("settings", settings);
  }
};

export const getSettings = async () => {
  const rawSettings = await getStorage<Partial<Settings>>("settings", defaultSettings);
  return deepmerge<Settings>(defaultSettings, rawSettings);
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: (_data: Settings) => undefined,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data: rawSettings, setData } = useSuspenseStorage<Partial<Settings>>("settings", defaultSettings);
  const settings = deepmerge<Settings>(defaultSettings, rawSettings);

  return (
    <SettingsContext
      value={{
        settings: settings,
        setSettings: (newData: Settings) => {
          setData(newData);
          if (newData.redmineURL !== settings.redmineURL) {
            browser.runtime.sendMessage("settings-changed:redmineURL");
          }
          if (newData.features.showCurrentIssueTimer !== settings.features?.showCurrentIssueTimer) {
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

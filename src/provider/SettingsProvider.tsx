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
    /**
     * @deprecated Use `auth.apiKey` instead.
     */
    redmineApiKey: z.string().optional(),
    auth: z.object({
      method: z.enum(["apiKey", "oauth2"]),
      apiKey: z.string().optional(),
      oauth2: z
        .object({
          clientId: z.string(),
          clientSecret: z.string(),
          scopes: z.object({
            view_issues: z.boolean(),
            add_issues: z.boolean(),
            edit_issues: z.boolean(),
            edit_own_issues: z.boolean(),
            add_issue_notes: z.boolean(),
            set_notes_private: z.boolean(),
            view_time_entries: z.boolean(),
            log_time: z.boolean(),
            edit_own_time_entries: z.boolean(),
            log_time_for_other_users: z.boolean(),
          }),
        })
        .optional(),
    }),
    features: z.object({
      autoPauseOnSwitch: z.boolean(),
      /**
       * @deprecated Use `roundToInterval` with `roundingMode: "nearest"` and `roundingInterval: 15` instead.
       */
      roundTimeNearestQuarterHour: z.boolean().optional(),
      /**
       * @deprecated Use `roundToInterval` with `roundingMode: "nearest"` instead.
       */
      roundToNearestInterval: z.boolean().optional(),
      roundToInterval: z.boolean(),
      roundingMode: z.enum(["down", "nearest", "up"]),
      roundingInterval: z
        .int(formatMessage?.({ id: "settings.features.rounding-interval.validation.required" }))
        .min(1, formatMessage?.({ id: "settings.features.rounding-interval.validation.greater-than-zero" }))
        .max(60, formatMessage?.({ id: "settings.features.rounding-interval.validation.less-than-or-equals-sixty" })),
      /**
       * @deprecated This setting has no effect and will be removed in a future version.
       */
      addNotes: z.boolean().optional(),
      /**
       * @deprecated Use `persistentComments` instead.
       */
      cacheComments: z.boolean().optional(),
      persistentComments: z.boolean(),
      showCurrentIssueTimer: z.boolean(),
    }),
    style: z.object({
      displaySearchAlways: z.boolean(),
      stickyScroll: z.boolean(),
      groupIssuesByVersion: z.boolean(),
      sortIssuesByPriority: z.boolean(),
      showIssuesPriority: z.boolean().optional(), // ! Legacy
      showIssuePriority: z.boolean(),
      showIssueDoneRatio: z.boolean(),
      showIssueStatus: z.boolean(),
      showSessions: z.boolean(),
      pinTrackedIssues: z.boolean(),
      pinActiveTabIssue: z.boolean(),
      fullscreenSidebarScrollspy: z.boolean(), // ! Experimental
      showTooltips: z.boolean(),
      timeFormat: z.enum(["decimal", "minutes"]),
    }),
  });

export type Settings = z.infer<ReturnType<typeof settingsSchema>>;

const defaultSettings: Settings = {
  language: "browser",
  redmineURL: "",
  auth: {
    method: "apiKey",
    apiKey: "",
    oauth2: {
      clientId: "",
      clientSecret: "",
      scopes: {
        view_issues: true, // Always enabled
        add_issues: false,
        edit_issues: false,
        edit_own_issues: false,
        add_issue_notes: true,
        set_notes_private: false,
        view_time_entries: true, // Always enabled
        log_time: true, // Always enabled
        edit_own_time_entries: true,
        log_time_for_other_users: false,
      },
    },
  },
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
    sortIssuesByPriority: true,
    showIssuePriority: true,
    showIssueDoneRatio: true,
    showIssueStatus: true,
    showSessions: true,
    pinTrackedIssues: false,
    pinActiveTabIssue: true,
    fullscreenSidebarScrollspy: false,
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

  if (typeof settings.style.showIssuesPriority === "boolean") {
    settings.style.showIssuePriority = settings.style.showIssuesPriority;
    settings.style.showIssuesPriority = undefined;
  }

  if (settings.redmineApiKey) {
    settings.auth = {
      method: "apiKey",
      apiKey: settings.redmineApiKey,
    };
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

/* eslint-disable react/no-children-prop */
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DE, FlagComponent, FR, GB, RU } from "country-flag-icons/react/3x2";
import { BugIcon, GlobeIcon, InfoIcon, ServerIcon } from "lucide-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { browser } from "wxt/browser";
import { z } from "zod/v4";
import Indicator from "../components/general/Indicator";
import { Form, FormFieldset, FormGrid } from "../components/ui/form";
import { useAppForm } from "../hooks/useAppForm";
import useMyUser from "../hooks/useMyUser";
import { LANGUAGES } from "../provider/IntlProvider";
import { useSettings } from "../provider/SettingsProvider";
import { formatHoursUsually } from "../utils/date";

export const Route = createFileRoute("/settings")({
  component: PageComponent,
});

const LANGUAGE_FLAGS: Record<(typeof LANGUAGES)[number], FlagComponent> = {
  en: GB,
  de: DE,
  ru: RU,
  fr: FR,
};

function PageComponent() {
  const queryClient = useQueryClient();
  const { formatMessage, formatNumber } = useIntl();
  const { settings, setSettings } = useSettings();

  const form = useAppForm({
    defaultValues: settings,
    validators: {
      onChange: z.object({
        language: z.enum(["browser", ...LANGUAGES]),
        redmineURL: z
          .string(formatMessage({ id: "settings.redmine.url.validation.required" }))
          .nonempty(formatMessage({ id: "settings.redmine.url.validation.required" }))
          .regex(/^(http|https):\/\/[\w\-.]+(\.\w+)*(:[0-9]+)?[\w\-/]*\/?$/, formatMessage({ id: "settings.redmine.url.validation.valid-url" })),
        redmineApiKey: z.string().nonempty(formatMessage({ id: "settings.redmine.api-key.validation.required" })),
        features: z.object({
          autoPauseOnSwitch: z.boolean(),
          roundToNearestInterval: z.boolean(),
          roundingInterval: z
            .int(formatMessage({ id: "settings.features.rounding-interval.validation.required" }))
            .min(1, formatMessage({ id: "settings.features.rounding-interval.validation.greater-than-zero" }))
            .max(60, formatMessage({ id: "settings.features.rounding-interval.validation.less-than-or-equals-sixty" })),
          addNotes: z.boolean(),
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
      }),
    },
    onSubmit: ({ value }) => {
      value.redmineURL = value.redmineURL.replace(/\/$/, "");
      setSettings(value);
      queryClient.resetQueries();
      setEditRedmineInstance(false);
      toast.success(formatMessage({ id: "settings.settings-saved" }));
    },
  });

  const [editRedmineInstance, setEditRedmineInstance] = useState(settings.redmineURL === "");

  const myUser = useMyUser({ staleTime: 0, displayErrorToast: false });

  return (
    <>
      <Form onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-2">
          <FormFieldset legend={<FormattedMessage id="settings.general" />}>
            <FormGrid>
              <form.AppField
                name="language"
                children={(field) => (
                  <field.ComboboxField
                    title={formatMessage({ id: "settings.general.language" })}
                    placeholder={formatMessage({ id: "settings.general.language" })}
                    required
                    options={[
                      {
                        label: "Auto (Browser)",
                        icon: <GlobeIcon />,
                        value: "browser",
                      },
                      ...LANGUAGES.map((lang) => {
                        const FlagComponent = LANGUAGE_FLAGS[lang];
                        return {
                          label: formatMessage({ id: `settings.general.language.${lang}` }),
                          icon: <FlagComponent className="box-content inline-block h-3 align-[-0.125em]" />,
                          value: lang,
                        };
                      }),
                    ]}
                  />
                )}
              />

              <a href="https://github.com/CrawlerCode/redmine-time-tracking#supported-languages" target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
                <FormattedMessage id="settings.general.language.missing-hint" />
              </a>
            </FormGrid>
          </FormFieldset>

          <FormFieldset legend={<FormattedMessage id="settings.redmine" />}>
            <FormGrid>
              {(editRedmineInstance && (
                <>
                  <form.AppField
                    name="redmineURL"
                    children={(field) => <field.TextField title={formatMessage({ id: "settings.redmine.url" })} placeholder={formatMessage({ id: "settings.redmine.url" })} required />}
                  />

                  <form.AppField
                    name="redmineApiKey"
                    children={(field) => (
                      <field.TextField type="password" title={formatMessage({ id: "settings.redmine.api-key" })} placeholder={formatMessage({ id: "settings.redmine.api-key" })} required />
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => ({
                      redmineURL: state.values.redmineURL,
                      displayHint: !state.values.redmineApiKey && state.values.redmineURL && !state.errorMap.onChange?.redmineURL,
                    })}
                    children={({ redmineURL, displayHint }) =>
                      displayHint && (
                        <p className="flex items-center gap-2">
                          <InfoIcon className="size-4 text-yellow-500 dark:text-yellow-400" />
                          <FormattedMessage
                            id="settings.redmine.api-key.hint"
                            values={{
                              link: (children) => (
                                <a href={`${redmineURL}/my/account`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline" rel="noreferrer">
                                  {children}
                                </a>
                              ),
                            }}
                          />
                        </p>
                      )
                    }
                  />
                </>
              )) || (
                <div className="relative -mt-1.5 w-full">
                  <h3 className="flex items-center gap-2 truncate text-base">
                    <ServerIcon className="size-4 text-gray-800 dark:text-gray-200" />
                    {settings.redmineURL}
                  </h3>
                  <p className="flex items-center gap-x-1.5">
                    {myUser.isLoading ? (
                      <>
                        <Indicator variant="loading" />
                        <FormattedMessage id="settings.redmine.connecting" />
                      </>
                    ) : myUser.isError ? (
                      <>
                        <Indicator variant="danger" />
                        <FormattedMessage id="settings.redmine.connection-failed" />
                      </>
                    ) : myUser.data ? (
                      <>
                        <Indicator variant="success" />
                        <FormattedMessage id="settings.redmine.connection-successful" />
                      </>
                    ) : (
                      "Unknown status"
                    )}
                  </p>
                  {myUser.isError && myUser.error && <p className="text-red-500 dark:text-red-400">{myUser.error.message}</p>}
                  {myUser.data && (
                    <p>
                      <FormattedMessage
                        id="settings.redmine.hello-user"
                        values={{
                          firstName: myUser.data.firstname,
                          lastName: myUser.data.lastname,
                          accountName: myUser.data.login,
                          strong: (children) => <strong>{children}</strong>,
                        }}
                      />
                    </p>
                  )}
                  <Button className="absolute right-0 bottom-0" size="sm" onClick={() => setEditRedmineInstance(true)}>
                    <FormattedMessage id="settings.redmine.edit" />
                  </Button>
                </div>
              )}
            </FormGrid>
          </FormFieldset>

          <FormFieldset legend={<FormattedMessage id="settings.features" />}>
            <FormGrid cols={6}>
              <form.AppField
                name="features.autoPauseOnSwitch"
                children={(field) => (
                  <field.CheckboxField
                    title={formatMessage({ id: "settings.features.auto-pause-on-switch.title" })}
                    description={formatMessage({ id: "settings.features.auto-pause-on-switch.description" })}
                  />
                )}
              />
              <>
                <form.AppField
                  name="features.roundToNearestInterval"
                  children={(field) => (
                    <field.CheckboxField
                      title={formatMessage({ id: "settings.features.round-to-nearest-interval.title" })}
                      description={formatMessage({ id: "settings.features.round-to-nearest-interval.description" })}
                      className="col-span-5"
                    />
                  )}
                />
                <form.Subscribe
                  selector={(state) => state.values.features.roundToNearestInterval}
                  children={(roundToNearestInterval) =>
                    roundToNearestInterval && (
                      <form.AppField
                        name="features.roundingInterval"
                        children={(field) => (
                          <field.TextField
                            type="number"
                            min={1}
                            max={60}
                            step={1}
                            placeholder={formatMessage({ id: "settings.features.rounding-interval.placeholder" })}
                            className="col-span-1 w-12 self-center justify-self-end"
                            classNames={{
                              input: "appearance-none",
                            }}
                            fieldErrorVariant="tooltip"
                          />
                        )}
                      />
                    )
                  }
                />
              </>
              <form.AppField
                name="features.addNotes"
                children={(field) => (
                  <field.CheckboxField title={formatMessage({ id: "settings.features.add-notes.title" })} description={formatMessage({ id: "settings.features.add-notes.description" })} />
                )}
              />
              <form.AppField
                name="features.persistentComments"
                children={(field) => (
                  <field.CheckboxField
                    title={formatMessage({ id: "settings.features.persistent-comments.title" })}
                    description={formatMessage({ id: "settings.features.persistent-comments.description" })}
                  />
                )}
              />
              <form.AppField
                name="features.showCurrentIssueTimer"
                children={(field) => (
                  <field.CheckboxField
                    title={formatMessage({ id: "settings.features.show-current-issue-timer.title" })}
                    description={formatMessage({ id: "settings.features.show-current-issue-timer.description" })}
                  />
                )}
              />
            </FormGrid>
          </FormFieldset>

          <FormFieldset legend={<FormattedMessage id="settings.style" />}>
            <FormGrid>
              <form.AppField name="style.displaySearchAlways" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.display-search-always.title" })} />} />
              <form.AppField name="style.stickyScroll" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.sticky-scroll.title" })} />} />
              <form.AppField name="style.groupIssuesByVersion" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.group-issues-by-version.title" })} />} />
              <form.AppField name="style.showIssuesPriority" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.show-issues-priority.title" })} />} />
              <form.AppField name="style.sortIssuesByPriority" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.sort-issues-by-priority.title" })} />} />
              <form.AppField name="style.pinTrackedIssues" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.pin-tracked-issues.title" })} />} />
              <form.AppField name="style.pinActiveTabIssue" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.pin-active-tab-issue.title" })} />} />
              <form.AppField name="style.showTooltips" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.show-tooltips.title" })} />} />
              <form.AppField
                name="style.timeFormat"
                children={(field) => (
                  <field.ToggleGroupField
                    title={formatMessage({ id: "settings.style.time-format.title" })}
                    options={[
                      {
                        value: "decimal",
                        name: formatMessage(
                          { id: "format.hours" },
                          {
                            hours: formatNumber(0.75),
                          }
                        ),
                      },
                      {
                        value: "minutes",
                        name: formatMessage(
                          { id: "format.hours" },
                          {
                            hours: formatHoursUsually(0.75),
                          }
                        ),
                      },
                    ]}
                  />
                )}
              />
            </FormGrid>
          </FormFieldset>

          <form.AppForm>
            <form.SubmitButton children={formatMessage({ id: "settings.save-settings" })} />
          </form.AppForm>
        </div>
      </Form>
      <Info />
    </>
  );
}

const Info = () => {
  const { name, version, version_name } = browser.runtime.getManifest();

  return (
    <FormFieldset
      className="mt-10"
      legend={
        <>
          <a href="https://chrome.google.com/webstore/detail/redmine-time-tracking/ldcanhhkffokndenejhafhlkapflgcjg" target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
            {name}
          </a>
          <span className="mx-1 text-xs">-</span>
          <a href="https://github.com/CrawlerCode/redmine-time-tracking/releases" target="_blank" tabIndex={-1} className="hover:underline" rel="noreferrer">
            v{version_name || version}
          </a>
        </>
      }
    >
      <div className="flex items-center justify-around p-3">
        <a href="https://github.com/CrawlerCode/redmine-time-tracking" target="_blank" tabIndex={-1} className="flex items-center gap-2 hover:underline" rel="noreferrer">
          <svg className="col size-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>{" "}
          GitHub
        </a>

        <a href="https://github.com/CrawlerCode/redmine-time-tracking/issues" target="_blank" tabIndex={-1} className="flex items-center gap-2 hover:underline" rel="noreferrer">
          <BugIcon className="size-4" />
          <FormattedMessage id="settings.info.report-an-issue" />
        </a>
      </div>
    </FormFieldset>
  );
};

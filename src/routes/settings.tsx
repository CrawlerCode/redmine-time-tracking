/* eslint-disable react/no-children-prop */
import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { Portal } from "@/components/general/Portal";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useTestRedmineConnection } from "@/hooks/useTestRedmineConnection";
import { useStore as useFormStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DE, FlagComponent, FR, GB, RU } from "country-flag-icons/react/3x2";
import {
  ArrowDownIcon,
  ArrowDownUpIcon,
  ArrowUpIcon,
  BugIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  GlobeIcon,
  Loader2Icon,
  PaletteIcon,
  PencilIcon,
  ServerIcon,
  SignalIcon,
  UserIcon,
  Wand2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { browser } from "wxt/browser";
import { Form } from "../components/ui/form";
import { useAppForm, withForm } from "../hooks/useAppForm";
import { LANGUAGES } from "../provider/IntlProvider";
import { Settings, settingsSchema, useSettings } from "../provider/SettingsProvider";
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
      onChange: settingsSchema({ formatMessage }),
    },
    onSubmit: async ({ value }) => {
      value.redmineURL = value.redmineURL.replace(/\/$/, "");
      await setSettings(value);
      toast.success(formatMessage({ id: "settings.settings-saved" }), {
        duration: 1000,
      });
      queryClient.resetQueries();
    },
  });

  return (
    <Form onSubmit={form.handleSubmit}>
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <GlobeIcon className="text-muted-foreground size-4" />
              {formatMessage({ id: "settings.general" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="language"
              children={(field) => (
                <field.SelectField
                  title={formatMessage({ id: "settings.general.language" })}
                  placeholder={formatMessage({ id: "settings.general.language" })}
                  required
                  items={[
                    {
                      label: "Auto (Browser)",
                      icon: <GlobeIcon />,
                      value: "browser",
                    },
                    ...LANGUAGES.map((lang) => {
                      const FlagComponent = LANGUAGE_FLAGS[lang];
                      return {
                        label: formatMessage({ id: `settings.general.language.${lang}` }),
                        icon: <FlagComponent className="h-3" />,
                        value: lang,
                      };
                    }),
                  ]}
                >
                  <FieldDescription>
                    <a href="https://github.com/CrawlerCode/redmine-time-tracking#supported-languages" target="_blank" tabIndex={-1} rel="noreferrer">
                      {formatMessage({ id: "settings.general.language.missing-hint" })}
                    </a>
                  </FieldDescription>
                </field.SelectField>
              )}
            />
          </CardContent>
        </Card>

        <RedmineServerSection form={form} />

        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Wand2Icon className="text-muted-foreground size-4" />
              {formatMessage({ id: "settings.features" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup data-slot="checkbox-group">
              <form.AppField
                name="features.autoPauseOnSwitch"
                children={(field) => (
                  <field.SwitchField
                    title={formatMessage({ id: "settings.features.auto-pause-on-switch.title" })}
                    description={formatMessage({ id: "settings.features.auto-pause-on-switch.description" })}
                  />
                )}
              />

              <form.AppField
                name="features.roundToInterval"
                children={(field) => (
                  <>
                    <field.SwitchField
                      title={formatMessage({ id: "settings.features.round-to-interval.title" })}
                      description={formatMessage({ id: "settings.features.round-to-interval.description" })}
                    />
                    {field.state.value && (
                      <div className="ml-11 flex items-center justify-between gap-2">
                        <form.AppField
                          name="features.roundingMode"
                          children={(field) => (
                            <field.ToggleGroupField
                              title={formatMessage({ id: "settings.features.rounding-mode.title" })}
                              required
                              items={[
                                {
                                  value: "down",
                                  icon: <ArrowDownIcon className="text-red-800 max-[360px]:hidden dark:text-red-400" />,
                                  label: formatMessage({ id: "settings.features.rounding-mode.down" }),
                                },
                                {
                                  value: "nearest",
                                  icon: <ArrowDownUpIcon className="text-blue-800 max-[360px]:hidden dark:text-blue-400" />,
                                  label: formatMessage({ id: "settings.features.rounding-mode.nearest" }),
                                },
                                {
                                  value: "up",
                                  icon: <ArrowUpIcon className="text-green-700 max-[360px]:hidden dark:text-green-400" />,
                                  label: formatMessage({ id: "settings.features.rounding-mode.up" }),
                                },
                              ]}
                              className="w-auto"
                            />
                          )}
                        />
                        <form.AppField
                          name="features.roundingInterval"
                          children={(field) => (
                            <field.TextField
                              type="number"
                              title={formatMessage({ id: "settings.features.rounding-interval.title" })}
                              placeholder={formatMessage({ id: "settings.features.rounding-interval.title" })}
                              min={1}
                              max={60}
                              step={1}
                              className="w-18 min-w-14"
                              classNames={{
                                input: "appearance-none text-center",
                              }}
                              fieldErrorVariant="tooltip"
                            />
                          )}
                        />
                      </div>
                    )}
                  </>
                )}
              />

              <form.AppField
                name="features.persistentComments"
                children={(field) => (
                  <field.SwitchField
                    title={formatMessage({ id: "settings.features.persistent-comments.title" })}
                    description={formatMessage({ id: "settings.features.persistent-comments.description" })}
                  />
                )}
              />
              <form.AppField
                name="features.showCurrentIssueTimer"
                children={(field) => (
                  <field.SwitchField
                    title={formatMessage({ id: "settings.features.show-current-issue-timer.title" })}
                    description={formatMessage({ id: "settings.features.show-current-issue-timer.description" })}
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <PaletteIcon className="text-muted-foreground size-4" />
              {formatMessage({ id: "settings.style" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup data-slot="checkbox-group">
              <form.AppField name="style.displaySearchAlways" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.display-search-always.title" })} />} />
              <form.AppField name="style.stickyScroll" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.sticky-scroll.title" })} />} />
              <form.AppField name="style.groupIssuesByVersion" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.group-issues-by-version.title" })} />} />
              <form.AppField name="style.showIssuesPriority" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.show-issues-priority.title" })} />} />
              <form.AppField name="style.sortIssuesByPriority" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.sort-issues-by-priority.title" })} />} />
              <form.AppField name="style.pinTrackedIssues" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.pin-tracked-issues.title" })} />} />
              <form.AppField name="style.pinActiveTabIssue" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.pin-active-tab-issue.title" })} />} />
              <form.AppField name="style.fullscreenSidebarScrollspy" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.fullscreen-sidebar-scrollspy.title" })} />} />
              <form.AppField name="style.showTooltips" children={(field) => <field.CheckboxField title={formatMessage({ id: "settings.style.show-tooltips.title" })} />} />
              <form.AppField
                name="style.timeFormat"
                children={(field) => (
                  <field.ToggleGroupField
                    title={formatMessage({ id: "settings.style.time-format.title" })}
                    required
                    items={[
                      {
                        value: "decimal",
                        label: formatMessage(
                          { id: "format.hours" },
                          {
                            hours: formatNumber(0.75),
                          }
                        ),
                      },
                      {
                        value: "minutes",
                        label: formatMessage(
                          { id: "format.hours" },
                          {
                            hours: formatHoursUsually(0.75),
                          }
                        ),
                      },
                    ]}
                    orientation="horizontal"
                    className="justify-between"
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <InfoSection />

        <Portal container={() => document.getElementById("footer")}>
          <form.AppForm>
            <form.SubmitButton size="lg" className="w-full sm:w-auto" children={formatMessage({ id: "settings.save-settings" })} onClick={form.handleSubmit} />
          </form.AppForm>
        </Portal>
      </div>
    </Form>
  );
}

const RedmineServerSection = withForm({
  defaultValues: {} as Settings,
  validators: {
    onChange: settingsSchema(),
  },
  render: function Render({ form }) {
    const { formatMessage } = useIntl();

    const [editRedmineInstance, setEditRedmineInstance] = useState(!form.state.values.redmineURL);
    const [redmineApiClient, setRedmineApiClient] = useState<RedmineApiClient | undefined>(undefined);
    const redmineConnection = useTestRedmineConnection(redmineApiClient);

    const isSubmitted = useFormStore(form.store, (state) => state.isSubmitted);
    useEffect(() => {
      if (isSubmitted) {
        setEditRedmineInstance(false);
        setRedmineApiClient(undefined);
      }
    }, [isSubmitted]);

    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ServerIcon className="text-muted-foreground size-4" />
            {formatMessage({ id: "settings.redmine" })}
          </CardTitle>
          <CardAction>
            {editRedmineInstance ? (
              <form.Subscribe
                selector={(state) => ({
                  isValid: !!state.values.redmineURL && !!state.values.redmineApiKey && !state.errorMap.onChange?.redmineURL,
                })}
                children={({ isValid }) => (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!isValid}
                    onClick={() => {
                      setRedmineApiClient(new RedmineApiClient(form.state.values.redmineURL, form.state.values.redmineApiKey));
                      setEditRedmineInstance(false);
                    }}
                  >
                    {formatMessage({ id: "settings.redmine.test-connection" })}
                  </Button>
                )}
              />
            ) : (
              <Button type="button" size="sm" variant="outline" onClick={() => setEditRedmineInstance(true)}>
                <PencilIcon />
                {formatMessage({ id: "settings.redmine.edit" })}
              </Button>
            )}
          </CardAction>
        </CardHeader>
        <CardContent>
          {editRedmineInstance ? (
            <FieldGroup>
              <form.AppField
                name="redmineURL"
                children={(field) => <field.TextField title={formatMessage({ id: "settings.redmine.url" })} placeholder={formatMessage({ id: "settings.redmine.url" })} required />}
              />

              <form.AppField
                name="redmineApiKey"
                children={(field) => (
                  <field.TextField type="password" title={formatMessage({ id: "settings.redmine.api-key" })} placeholder={formatMessage({ id: "settings.redmine.api-key" })} required>
                    <form.Subscribe
                      selector={(state) => ({
                        redmineURL: state.values.redmineURL,
                        displayHint: !state.values.redmineApiKey && state.values.redmineURL && !state.errorMap.onChange?.redmineURL,
                      })}
                      children={({ redmineURL, displayHint }) =>
                        displayHint && (
                          <FieldDescription className="font-semibold">
                            {formatMessage(
                              {
                                id: "settings.redmine.api-key.hint",
                              },
                              {
                                link: (children) => (
                                  <a href={`${redmineURL}/my/account`} target="_blank" tabIndex={-1} rel="noreferrer" className="font-bold">
                                    {children}
                                  </a>
                                ),
                              }
                            )}
                          </FieldDescription>
                        )
                      }
                    />
                  </field.TextField>
                )}
              />
            </FieldGroup>
          ) : (
            <ItemGroup className="gap-2">
              <Item variant="muted" className="flex-nowrap">
                <ItemMedia variant="icon" className="bg-muted text-muted-foreground size-8 overflow-hidden rounded-sm border">
                  {redmineConnection.isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : redmineConnection.isError ? (
                    <SignalIcon className="text-destructive" />
                  ) : redmineConnection.data ? (
                    <>{redmineConnection.data.avatar_url ? <img src={redmineConnection.data.avatar_url} alt="User Avatar" className="size-full" /> : <UserIcon />}</>
                  ) : (
                    <ServerIcon />
                  )}
                </ItemMedia>
                <ItemContent className="overflow-hidden">
                  <ItemTitle>{form.state.values.redmineURL}</ItemTitle>
                  {redmineConnection.isLoading ? (
                    <ItemDescription>{formatMessage({ id: "settings.redmine.connecting" })}</ItemDescription>
                  ) : redmineConnection.isError ? (
                    <>
                      <ItemDescription className="text-destructive font-semibold">{formatMessage({ id: "settings.redmine.connection-failed" })}</ItemDescription>
                      {redmineConnection.error && <ItemDescription className="text-destructive/80">{redmineConnection.error.message}</ItemDescription>}
                    </>
                  ) : redmineConnection.data ? (
                    <>
                      <ItemDescription className="text-green-600">{formatMessage({ id: "settings.redmine.connection-successful" })}</ItemDescription>
                      <ItemDescription>
                        {formatMessage(
                          {
                            id: "settings.redmine.hello-user",
                          },
                          {
                            firstName: redmineConnection.data.firstname,
                            lastName: redmineConnection.data.lastname,
                            accountName: redmineConnection.data.login,
                            strong: (children) => <strong>{children}</strong>,
                          }
                        )}
                      </ItemDescription>
                    </>
                  ) : undefined}
                </ItemContent>
              </Item>
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    );
  },
});

const InfoSection = () => {
  const { formatMessage } = useIntl();
  const { name, version, version_name } = browser.runtime.getManifest();

  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <img src="/icon/16.png" alt="Redmine Time Tracking Icon" className="size-8" />
        </ItemMedia>
        <ItemContent>
          <CardTitle>{name}</CardTitle>
          <CardDescription>v{version_name || version}</CardDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm" render={<a href="https://github.com/CrawlerCode/redmine-time-tracking" target="_blank" tabIndex={-1} rel="noreferrer" />}>
        <ItemMedia variant="icon" className="bg-muted size-8 rounded-sm border">
          <svg className="size-4 dark:fill-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>GitHub</ItemTitle>
          <ItemDescription className="text-xs">CrawlerCode/redmine-time-tracking</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon className="size-4" />
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" render={<a href="https://github.com/CrawlerCode/redmine-time-tracking/issues" target="_blank" tabIndex={-1} rel="noreferrer" />}>
        <ItemMedia variant="icon" className="bg-muted size-8 rounded-sm border">
          <BugIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{formatMessage({ id: "settings.info.report-an-issue" })}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Item>
    </ItemGroup>
  );
};

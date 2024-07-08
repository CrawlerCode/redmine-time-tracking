import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBug, faGlobe, faInfoCircle, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { DE, FlagComponent, GB, RU } from "country-flag-icons/react/3x2";
import { Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import Button from "../components/general/Button";
import CheckBox from "../components/general/CheckBox";
import Fieldset from "../components/general/Fieldset";
import Indicator from "../components/general/Indicator";
import InputField from "../components/general/InputField";
import ReactSelectFormik from "../components/general/ReactSelectFormik";
import Switch from "../components/general/Switch";
import Toast from "../components/general/Toast";
import useMyAccount from "../hooks/useMyAccount";
import useSettings from "../hooks/useSettings";
import { LANGUAGES } from "../provider/IntlProvider";
import { Settings } from "../provider/SettingsProvider";
import { formatHoursUsually } from "../utils/date";

const LANGUAGE_FLAGS: Record<(typeof LANGUAGES)[number], FlagComponent> = {
  en: GB,
  de: DE,
  ru: RU,
};

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { formatMessage, formatNumber } = useIntl();
  const { settings, setSettings } = useSettings();

  const formik = useRef<FormikProps<Settings>>(null);

  const [editRedmineInstance, setEditRedmineInstance] = useState(false);
  const [saved, setSaved] = useState(false);

  const myAccount = useMyAccount({ staleTime: 1000 * 10 });

  useEffect(() => {
    formik.current?.setValues(settings);
    if (settings.redmineURL === "") {
      setEditRedmineInstance(true);
    }
  }, [settings]);

  return (
    <>
      <Formik
        innerRef={formik}
        initialValues={settings}
        validationSchema={Yup.object({
          redmineURL: Yup.string()
            .required(formatMessage({ id: "settings.redmine.url.validation.required" }))
            .matches(/^(http|https):\/\/[\w\-.]+(\.\w+)*(:[0-9]+)?[\w\-/]*\/?$/, formatMessage({ id: "settings.redmine.url.validation.valid-url" })),
          redmineApiKey: Yup.string().required(formatMessage({ id: "settings.redmine.api-key.validation.required" })),
        })}
        onSubmit={(values, { setSubmitting }) => {
          values.redmineURL = values.redmineURL.replace(/\/$/, "");
          //console.log("onSubmit", values);
          setSettings(values);
          queryClient.clear();
          setSubmitting(false);
          setSaved(true);
          setEditRedmineInstance(false);
        }}
      >
        {({ isSubmitting, touched, errors, values }) => (
          <>
            <Form>
              <div className="flex flex-col gap-y-1">
                <Fieldset legend={<FormattedMessage id="settings.general" />}>
                  <div className="flex flex-col gap-y-2">
                    <Field
                      type="select"
                      name="language"
                      title={formatMessage({ id: "settings.general.language" })}
                      placeholder={formatMessage({ id: "settings.general.language" })}
                      required
                      as={ReactSelectFormik}
                      options={[
                        {
                          label: "Auto (Browser)",
                          icon: <FontAwesomeIcon icon={faGlobe} />,
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

                    <a href="https://github.com/CrawlerCode/redmine-time-tracking#supported-languages" target="_blank" tabIndex={-1} className="hover:underline">
                      <FormattedMessage id="settings.general.language.missing-hint" />
                    </a>
                  </div>
                </Fieldset>

                <Fieldset legend={<FormattedMessage id="settings.redmine" />}>
                  <div className="flex flex-col gap-y-2">
                    {(editRedmineInstance && (
                      <>
                        <Field
                          type="text"
                          name="redmineURL"
                          title={formatMessage({ id: "settings.redmine.url" })}
                          placeholder={formatMessage({ id: "settings.redmine.url" })}
                          required
                          as={InputField}
                          error={touched.redmineURL && errors.redmineURL}
                        />
                        <Field
                          type="password"
                          name="redmineApiKey"
                          title={formatMessage({ id: "settings.redmine.api-key" })}
                          placeholder={formatMessage({ id: "settings.redmine.api-key" })}
                          required
                          as={InputField}
                          error={touched.redmineApiKey && errors.redmineApiKey}
                        />
                        {values.redmineURL && !errors.redmineURL && !values.redmineApiKey && (
                          <p>
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-yellow-500 dark:text-yellow-400" />
                            <FormattedMessage
                              id="settings.redmine.api-key.hint"
                              values={{
                                link: (children) => (
                                  <a href={`${values.redmineURL}/my/account`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline">
                                    {children}
                                  </a>
                                ),
                              }}
                            />
                          </p>
                        )}
                      </>
                    )) || (
                      <>
                        <div className="flex items-center gap-x-2">
                          <div className="relative w-full">
                            <h3 className="max-w-[285px] truncate text-base">
                              <FontAwesomeIcon icon={faServer} className="mr-1 text-gray-800 dark:text-gray-200" />
                              {settings.redmineURL}
                            </h3>
                            <p className="flex items-center gap-x-1.5">
                              {myAccount.isLoading ? (
                                <>
                                  <Indicator variant="loading" />
                                  <FormattedMessage id="settings.redmine.connecting" />
                                </>
                              ) : myAccount.isError ? (
                                <>
                                  <Indicator variant="danger" />
                                  <FormattedMessage id="settings.redmine.connection-failed" />
                                </>
                              ) : myAccount.data ? (
                                <>
                                  <Indicator variant="success" />
                                  <FormattedMessage id="settings.redmine.connection-successful" />
                                </>
                              ) : (
                                "Unknown status"
                              )}
                            </p>
                            {myAccount.data && (
                              <p>
                                <FormattedMessage
                                  id="settings.redmine.hello-user"
                                  values={{
                                    firstName: myAccount.data.firstname,
                                    lastName: myAccount.data.lastname,
                                    accountName: myAccount.data.login,
                                    strong: (children) => <strong>{children}</strong>,
                                  }}
                                />
                              </p>
                            )}
                            <Button className="absolute bottom-0 right-0" size="sm" onClick={() => setEditRedmineInstance(true)}>
                              <FormattedMessage id="settings.redmine.edit" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Fieldset>

                <Fieldset legend={<FormattedMessage id="settings.features" />}>
                  <div className="flex flex-col gap-y-2">
                    <Field
                      type="checkbox"
                      name="features.autoPauseOnSwitch"
                      title={formatMessage({ id: "settings.features.auto-pause-on-switch.title" })}
                      description={formatMessage({ id: "settings.features.auto-pause-on-switch.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="features.extendedSearch"
                      title={formatMessage({ id: "settings.features.extended-search.title" })}
                      description={formatMessage({ id: "settings.features.extended-search.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="features.roundTimeNearestQuarterHour"
                      title={formatMessage({ id: "settings.features.round-time-nearest-quarter-hour.title" })}
                      description={formatMessage({ id: "settings.features.round-time-nearest-quarter-hour.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="features.addSpentTimeForOtherUsers"
                      title={formatMessage({ id: "settings.features.add-spent-time-for-other-users.title" })}
                      description={formatMessage({ id: "settings.features.add-spent-time-for-other-users.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="features.addNotes"
                      title={formatMessage({ id: "settings.features.add-notes.title" })}
                      description={formatMessage({ id: "settings.features.add-notes.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="features.cacheComments"
                      title={formatMessage({ id: "settings.features.cache-comments.title" })}
                      description={formatMessage({ id: "settings.features.cache-comments.description" })}
                      as={CheckBox}
                    />
                  </div>
                </Fieldset>

                <Fieldset legend={<FormattedMessage id="settings.style" />}>
                  <div className="flex flex-col gap-y-2">
                    <Field type="checkbox" name="style.stickyScroll" title={formatMessage({ id: "settings.style.sticky-scroll.title" })} as={CheckBox} />
                    <Field type="checkbox" name="style.groupIssuesByVersion" title={formatMessage({ id: "settings.style.group-issues-by-version.title" })} as={CheckBox} />
                    <Field type="checkbox" name="style.showIssuesPriority" title={formatMessage({ id: "settings.style.show-issues-priority.title" })} as={CheckBox} />
                    <Field type="checkbox" name="style.sortIssuesByPriority" title={formatMessage({ id: "settings.style.sort-issues-by-priority.title" })} as={CheckBox} />
                    <Field type="checkbox" name="style.pinTrackedIssues" title={formatMessage({ id: "settings.style.pin-tracked-issues.title" })} as={CheckBox} />
                    <Field type="checkbox" name="style.showTooltips" title={formatMessage({ id: "settings.style.show-tooltips.title" })} as={CheckBox} />
                    <Field
                      name="style.timeFormat"
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
                      as={Switch}
                    />
                  </div>
                </Fieldset>

                <Button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0} className="mt-2">
                  <FormattedMessage id="settings.save-settings" />
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <Info />
      {saved && <Toast type="success" message={formatMessage({ id: "settings.settings-saved" })} onClose={() => setSaved(false)} />}
    </>
  );
};

const Info = () => {
  const { name, version, version_name } = chrome.runtime.getManifest();

  return (
    <>
      <div className="mt-10">
        <Fieldset
          legend={
            <>
              <a href="https://chrome.google.com/webstore/detail/redmine-time-tracking/ldcanhhkffokndenejhafhlkapflgcjg" target="_blank" tabIndex={-1} className="hover:underline">
                {name}
              </a>
              <span className="mx-1 text-xs">-</span>
              <a href="https://github.com/CrawlerCode/redmine-time-tracking/releases" target="_blank" tabIndex={-1} className="hover:underline">
                v{version_name || version}
              </a>
            </>
          }
        >
          <div className="flex items-center justify-around p-3">
            <a href="https://github.com/CrawlerCode/redmine-time-tracking" target="_blank" tabIndex={-1} className="hover:underline">
              <FontAwesomeIcon icon={faGithub} className="mr-1" />
              GitHub
            </a>

            <a href="https://github.com/CrawlerCode/redmine-time-tracking/issues" target="_blank" tabIndex={-1} className="hover:underline">
              <FontAwesomeIcon icon={faBug} className="mr-1" />
              <FormattedMessage id="settings.info.report-an-issue" />
            </a>
          </div>
        </Fieldset>
      </div>
    </>
  );
};

export default SettingsPage;

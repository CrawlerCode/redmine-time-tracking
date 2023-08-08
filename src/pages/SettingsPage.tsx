import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { LANGUAGES } from "../IntlProvider";
import Button from "../components/general/Button";
import CheckBox from "../components/general/CheckBox";
import Indicator from "../components/general/Indicator";
import InputField from "../components/general/InputField";
import SelectField from "../components/general/SelectField";
import Toast from "../components/general/Toast";
import useMyAccount from "../hooks/useMyAccount";
import useSettings, { Settings } from "../hooks/useSettings";

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const { settings, setSettings } = useSettings();

  const formik = useRef<FormikProps<Settings>>(null);

  useEffect(() => {
    formik.current?.setValues(settings);
  }, [settings]);

  const [saved, setSaved] = useState(false);

  const myAccount = useMyAccount();

  return (
    <>
      <Formik
        innerRef={formik}
        initialValues={settings}
        validationSchema={Yup.object({
          redmineURL: Yup.string()
            .required(formatMessage({ id: "settings.redmine.url.validation.required" }))
            .matches(/^(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?.*?$/, formatMessage({ id: "settings.redmine.url.validation.valid-url" })),
          redmineApiKey: Yup.string().required(formatMessage({ id: "settings.redmine.api-key.validation.required" })),
        })}
        onSubmit={(values, { setSubmitting }) => {
          //console.log("onSubmit", values);
          setSettings(values);
          queryClient.clear();
          setSubmitting(false);
          setSaved(true);
        }}
      >
        {({ submitForm, touched, errors, values }) => (
          <>
            <Form>
              <div className="flex flex-col gap-y-1">
                <fieldset className="rounded-lg border border-gray-300 p-1.5 dark:border-gray-600">
                  <legend className="px-2 text-base font-semibold">
                    <FormattedMessage id="settings.general" />
                  </legend>
                  <div className="flex flex-col gap-y-2">
                    <Field
                      type="select"
                      name="language"
                      title={formatMessage({ id: "settings.general.language" })}
                      placeholder={formatMessage({ id: "settings.general.language" })}
                      required
                      as={SelectField}
                    >
                      <option value="browser">Auto (Browser)</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          <FormattedMessage id={`settings.general.language.${lang}`} />
                        </option>
                      ))}
                    </Field>
                    <a href="https://github.com/CrawlerCode/redmine-time-tracking#supported-languages" target="_blank" tabIndex={-1} className="hover:underline">
                      <FormattedMessage id="settings.general.language.missing-hint" />
                    </a>
                  </div>
                </fieldset>

                <fieldset className="rounded-lg border border-gray-300 p-1.5 dark:border-gray-600">
                  <legend className="px-2 text-base font-semibold">
                    <FormattedMessage id="settings.redmine" />
                  </legend>
                  <div className="flex flex-col gap-y-2">
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
                    <div className="flex items-center gap-x-2">
                      {myAccount.isLoading && (
                        <>
                          <Indicator variant="primary" />
                          <p>
                            <FormattedMessage id="settings.redmine.connecting" />
                          </p>
                        </>
                      )}
                      {myAccount.isError && (
                        <>
                          <Indicator variant="danger" />
                          <p>
                            <FormattedMessage id="settings.redmine.connection-failed" />
                          </p>
                        </>
                      )}
                      {!myAccount.isLoading && !myAccount.isError && myAccount.data && (
                        <>
                          <Indicator variant="success" />
                          <div>
                            <p>
                              <FormattedMessage id="settings.redmine.connection-successful" />
                            </p>
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
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="rounded-lg border border-gray-300 p-1.5 dark:border-gray-600">
                  <legend className="px-2 text-base font-semibold">
                    <FormattedMessage id="settings.options" />
                  </legend>
                  <div className="flex flex-col gap-y-2">
                    <Field
                      type="checkbox"
                      name="options.autoPauseOnSwitch"
                      title={formatMessage({ id: "settings.options.auto-pause-on-switch.title" })}
                      description={formatMessage({ id: "settings.options.auto-pause-on-switch.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="options.extendedSearch"
                      title={formatMessage({ id: "settings.options.extended-search.title" })}
                      description={formatMessage({ id: "settings.options.extended-search.description" })}
                      as={CheckBox}
                    />
                    <Field
                      type="checkbox"
                      name="options.roundTimeNearestQuarterHour"
                      title={formatMessage({ id: "settings.options.round-time-nearest-quarter-hour.title" })}
                      description={formatMessage({ id: "settings.options.round-time-nearest-quarter-hour.description" })}
                      as={CheckBox}
                    />
                  </div>
                </fieldset>

                <Button onClick={submitForm} className="mt-2">
                  <FormattedMessage id="settings.save-settings" />
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <div className="mt-3 flex w-full flex-col items-center p-2">
        <a href="https://chrome.google.com/webstore/detail/redmine-time-tracking/ldcanhhkffokndenejhafhlkapflgcjg" target="_blank" tabIndex={-1} className="hover:underline">
          {chrome.runtime.getManifest().name}
        </a>
        <p>Version: {chrome.runtime.getManifest().version}</p>
      </div>
      {saved && <Toast type="success" message={formatMessage({ id: "settings.settings-saved" })} onClose={() => setSaved(false)} />}
    </>
  );
};

export default SettingsPage;

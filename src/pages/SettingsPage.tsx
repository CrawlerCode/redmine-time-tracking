import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import CheckBox from "../components/general/CheckBox";
import InputField from "../components/general/InputField";
import Toast from "../components/general/Toast";
import useSettings, { Settings } from "../hooks/useSettings";

const SettingsPage = () => {
  const formik = useRef<FormikProps<Settings>>(null);
  const queryClient = useQueryClient();

  const { settings, setSettings } = useSettings();

  useEffect(() => {
    formik.current?.setValues(settings);
  }, [settings]);

  const [saved, setSaved] = useState(false);

  return (
    <>
      <Formik
        innerRef={formik}
        initialValues={settings}
        validationSchema={Yup.object({
          redmineURL: Yup.string()
            .required("URL is required")
            .matches(/^(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?.*?$/, "Enter a valid URL"),
          redmineApiKey: Yup.string().required("API-Key is required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          //console.log("onSubmit", values);
          setSettings(values);
          queryClient.clear();
          setSubmitting(false);
          setSaved(true);
        }}
      >
        {({ submitForm, touched, errors }) => (
          <>
            <Form>
              <div className="flex flex-col gap-y-2">
                <Field type="text" name="redmineURL" title="Redmine URL" placeholder="Redmine URL" required as={InputField} error={touched.redmineURL && errors.redmineURL} />
                <Field type="password" name="redmineApiKey" title="Redmine API-Key" placeholder="Redmine API-Key" required as={InputField} error={touched.redmineApiKey && errors.redmineApiKey} />
                <h2 className="text-lg font-semibold">Options:</h2>
                <Field type="checkbox" name="options.autoPauseOnSwitch" title="Auto pause" description="Automatic pause timers when changing issue" as={CheckBox} />
                <Field type="checkbox" name="options.extendedSearch" title="Extended search" description="Allows to search issues that are not assigned to you" as={CheckBox} />
                <Field type="checkbox" name="options.roundTimeNearestQuarterHour" title="Round to nearest 15 min" description="Round timer to nearest quarter hour" as={CheckBox} />
                <button
                  type="button"
                  className={clsx(
                    "text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 dark:bg-primary-600 dark:hover:bg-primary-700",
                    "focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800"
                  )}
                  onClick={submitForm}
                >
                  Save Settings
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <div className="absolute bottom-0 w-full flex flex-col items-center p-2">
        <g>{chrome.runtime.getManifest().name}</g>
        <p>Version: {chrome.runtime.getManifest().version}</p>
      </div>
      {saved && <Toast type="success" message="Settings saved!" onClose={() => setSaved(false)} />}
    </>
  );
};

export default SettingsPage;

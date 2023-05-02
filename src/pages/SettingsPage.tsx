import { Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import InputField from "../components/general/InputField";
import Toast from "../components/general/Toast";
import useSettings, { Settings } from "../hooks/useSettings";

const SettingsPage = () => {
  const formik = useRef<FormikProps<Settings>>(null);

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
                <button
                  type="button"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  onClick={submitForm}
                >
                  Save
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
      {saved && <Toast type="success" message="Settings saved!" onClose={() => setSaved(false)} />}
    </>
  );
};

export default SettingsPage;

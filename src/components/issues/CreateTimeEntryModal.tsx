import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import clsx from "clsx";
import { Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { createTimeEntry, getTimeEntryActivities, updateIssue } from "../../api/redmine";
import useSettings from "../../hooks/useSettings";
import { TCreateTimeEntry, TIssue, TRedmineError } from "../../types/redmine";
import InputField from "../general/InputField";
import Modal from "../general/Modal";
import SelectField from "../general/SelectField";
import Toast from "../general/Toast";
import DoneSlider from "./DoneSlider";

type PropTypes = {
  issue: TIssue;
  time: number;
  onClose: () => void;
  onSuccess: () => void;
};

const CreateTimeEntryModal = ({ issue, time, onClose, onSuccess }: PropTypes) => {
  const { settings } = useSettings();
  const queryClient = useQueryClient();
  const formik = useRef<FormikProps<TCreateTimeEntry>>(null);

  const timeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: getTimeEntryActivities,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    formik.current?.setFieldValue("activity_id", timeEntryActivitiesQuery.data?.find((entry) => entry.is_default)?.id ?? undefined);
  }, [timeEntryActivitiesQuery.data]);

  const createTimeEntryMutation = useMutation({
    mutationFn: (entry: TCreateTimeEntry) => createTimeEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["additionalIssues"]);
      onSuccess();
    },
  });

  const [doneRatio, setDoneRatio] = useState(issue.done_ratio);
  const updateIssueMutation = useMutation({
    mutationFn: (data: { done_ratio: number }) => updateIssue(issue.id, data),
  });

  return (
    <>
      <Modal title="Add time spent" onClose={onClose}>
        <Formik
          innerRef={formik}
          initialValues={{
            issue_id: issue.id,
            activity_id: undefined,
            hours: time / 1000 / 60 / 60,
            comments: "",
          }}
          validationSchema={Yup.object({
            activity_id: Yup.number().required("Activity is required"),
            hours: Yup.number().required("Hours is required").min(0.01, "Must be greater than 0"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            //console.log("onSubmit", values);
            if (issue.done_ratio !== doneRatio) {
              await updateIssueMutation.mutateAsync({ done_ratio: doneRatio });
            }
            await createTimeEntryMutation.mutateAsync(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <>
              <Form>
                <div className="flex flex-col gap-y-2">
                  <h1 className="mb-1 truncate">
                    <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline">
                      #{issue.id}
                    </a>{" "}
                    {issue.subject}
                  </h1>
                  <DoneSlider name="done_ratio" value={doneRatio} onChange={(e) => setDoneRatio(e.target.valueAsNumber)} className="mb-1" />
                  <Field type="number" name="hours" title="Hours" placeholder="Hours" min="0" step="0.01" required as={InputField} size="sm" error={touched.hours && errors.hours} autoComplete="off" />
                  <Field type="text" name="comments" title="Comments" placeholder="Comments" as={InputField} size="sm" error={touched.comments && errors.comments} autoFocus />
                  <Field type="select" name="activity_id" title="Activity" placeholder="Activity" required as={SelectField} size="sm" error={touched.activity_id && errors.activity_id}>
                    {timeEntryActivitiesQuery.data?.map((activity) => (
                      <>
                        <option key={activity.id} value={activity.id}>
                          {activity.name}
                        </option>
                      </>
                    ))}
                  </Field>

                  <button
                    type="submit"
                    className={clsx(
                      "text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-1.5 mt-2 dark:bg-primary-600 dark:hover:bg-primary-700",
                      "focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800"
                    )}
                    disabled={isSubmitting}
                  >
                    Create
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Modal>
      {createTimeEntryMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={isAxiosError(createTimeEntryMutation.error) ? ((createTimeEntryMutation.error as AxiosError).response?.data as TRedmineError)?.errors.join(", ") : (createTimeEntryMutation.error as Error).message}
        />
      )}
    </>
  );
};

export default CreateTimeEntryModal;

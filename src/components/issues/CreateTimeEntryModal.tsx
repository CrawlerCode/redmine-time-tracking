import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { startOfDay } from "date-fns";
import { Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { createTimeEntry, getTimeEntryActivities, updateIssue } from "../../api/redmine";
import useSettings from "../../hooks/useSettings";
import { TCreateTimeEntry, TIssue, TRedmineError } from "../../types/redmine";
import { formatHours } from "../../utils/date";
import Button from "../general/Button";
import DateField from "../general/DateField";
import InputField from "../general/InputField";
import Modal from "../general/Modal";
import SelectField from "../general/SelectField";
import Toast from "../general/Toast";
import TimeEntryPreview from "../time/TimeEntryPreview";
import DoneSlider from "./DoneSlider";

type PropTypes = {
  issue: TIssue;
  time: number;
  onClose: () => void;
  onSuccess: () => void;
};

const CreateTimeEntryModal = ({ issue, time, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
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
      <Modal title={formatMessage({ id: "issues.modal.add-spent-time.title" })} onClose={onClose}>
        <Formik
          innerRef={formik}
          initialValues={{
            issue_id: issue.id,
            spent_on: new Date(),
            activity_id: undefined,
            hours: time / 1000 / 60 / 60,
            comments: "",
          }}
          validationSchema={Yup.object({
            spent_on: Yup.date().max(new Date(), formatMessage({ id: "issues.modal.add-spent-time.date.validation.in-future" })),
            hours: Yup.number()
              .required(formatMessage({ id: "issues.modal.add-spent-time.hours.validation.required" }))
              .min(0.01, formatMessage({ id: "issues.modal.add-spent-time.hours.validation.greater-than-zero" })),
            activity_id: Yup.number().required(formatMessage({ id: "issues.modal.add-spent-time.activity.validation.required" })),
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
          {({ isSubmitting, touched, errors, values }) => (
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

                  {values.spent_on && <TimeEntryPreview date={startOfDay(values.spent_on)} previewHours={values.hours} />}

                  <Field
                    type="date"
                    name="spent_on"
                    title={formatMessage({ id: "issues.modal.add-spent-time.date" })}
                    placeholder={formatMessage({ id: "issues.modal.add-spent-time.date" })}
                    required
                    as={DateField}
                    size="sm"
                    error={touched.spent_on && errors.spent_on}
                    options={{ maxDate: new Date() }}
                  />
                  <Field
                    type="number"
                    name="hours"
                    title={formatMessage({ id: "issues.modal.add-spent-time.hours" })}
                    placeholder={formatMessage({ id: "issues.modal.add-spent-time.hours" })}
                    min="0"
                    step="0.01"
                    required
                    as={InputField}
                    size="sm"
                    extraText={formatHours(values.hours) + " h"}
                    error={touched.hours && errors.hours}
                    autoComplete="off"
                  />
                  <Field
                    type="text"
                    name="comments"
                    title={formatMessage({ id: "issues.modal.add-spent-time.comments" })}
                    placeholder={formatMessage({ id: "issues.modal.add-spent-time.comments" })}
                    as={InputField}
                    size="sm"
                    error={touched.comments && errors.comments}
                    autoFocus
                  />
                  <Field
                    type="select"
                    name="activity_id"
                    title={formatMessage({ id: "issues.modal.add-spent-time.activity" })}
                    placeholder={formatMessage({ id: "issues.modal.add-spent-time.activity" })}
                    required
                    as={SelectField}
                    size="sm"
                    error={touched.activity_id && errors.activity_id}
                  >
                    {timeEntryActivitiesQuery.data?.map((activity) => (
                      <>
                        <option key={activity.id} value={activity.id}>
                          {activity.name}
                        </option>
                      </>
                    ))}
                  </Field>

                  <Button type="submit" disabled={isSubmitting}>
                    <FormattedMessage id="issues.modal.add-spent-time.submit" />
                  </Button>
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
          message={
            isAxiosError(createTimeEntryMutation.error)
              ? (createTimeEntryMutation.error as AxiosError<TRedmineError>).response?.data?.errors.join(", ") ?? (createTimeEntryMutation.error as AxiosError).message
              : (createTimeEntryMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default CreateTimeEntryModal;

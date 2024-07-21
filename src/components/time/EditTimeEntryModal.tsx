import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { parseISO } from "date-fns";
import { FastField, Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import useIssue from "../../hooks/useIssue";
import useSettings from "../../hooks/useSettings";
import useTimeEntryActivities from "../../hooks/useTimeEntryActivities";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { TRedmineError, TTimeEntry, TUpdateTimeEntry } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import { formatHoursUsually } from "../../utils/date";
import Button from "../general/Button";
import DateField from "../general/DateField";
import InputField from "../general/InputField";
import LoadingSpinner from "../general/LoadingSpinner";
import Modal from "../general/Modal";
import ReactSelectFormik, { shouldUpdate } from "../general/ReactSelectFormik";
import TimeField from "../general/TimeField";
import Toast from "../general/Toast";

type PropTypes = {
  entry: TTimeEntry;
  onClose: () => void;
  onSuccess: () => void;
};

type TUpdateTimeEntryForm = Required<Omit<TUpdateTimeEntry, "project_id" | "issue_id" | "user_id">>;

const EditTimeEntryModal = ({ entry, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const formik = useRef<FormikProps<TUpdateTimeEntryForm>>(null);

  const issue = useIssue(entry.issue?.id ?? 0, {
    enabled: !!entry.issue,
  });
  const timeEntryActivities = useTimeEntryActivities(entry.project.id);

  const updateTimeEntryMutation = useMutation({
    mutationFn: (data: TUpdateTimeEntry) => redmineApi.updateTimeEntry(entry.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeEntries"],
      });
    },
  });

  return (
    <>
      <Modal title={formatMessage({ id: "time.modal.edit-time-entry.title" })} onClose={onClose}>
        <Formik<TUpdateTimeEntryForm>
          innerRef={formik}
          initialValues={
            {
              hours: entry.hours,
              spent_on: parseISO(entry.spent_on),
              comments: entry.comments,
              activity_id: entry.activity.id,
            } satisfies TUpdateTimeEntryForm
          }
          validationSchema={Yup.object({
            hours: Yup.number()
              .required(formatMessage({ id: "time.time-entry.field.hours.validation.required" }))
              .min(0.01, formatMessage({ id: "time.time-entry.field.hours.validation.greater-than-zero" }))
              .max(24, formatMessage({ id: "time.time-entry.field.hours.validation.less-than-24" })),
            spent_on: Yup.date().max(new Date(), formatMessage({ id: "time.time-entry.field.spent-on.validation.in-future" })),
            comments: Yup.string(),
            activity_id: Yup.number().required(formatMessage({ id: "time.time-entry.field.activity.validation.required" })),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            //console.log("onSubmit", values);
            await updateTimeEntryMutation.mutateAsync(values);
            setSubmitting(false);
            if (!updateTimeEntryMutation.isError) {
              onSuccess();
            }
          }}
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              <div className="flex flex-col gap-y-2">
                <InputField
                  name="project_id"
                  title={formatMessage({ id: "time.time-entry.field.project" })}
                  placeholder={formatMessage({ id: "time.time-entry.field.project" })}
                  required
                  disabled
                  size="sm"
                  value={entry.project.name}
                />

                {issue.data && (
                  <InputField
                    name="issue_id"
                    title={formatMessage({ id: "time.time-entry.field.issue" })}
                    placeholder={formatMessage({ id: "time.time-entry.field.issue" })}
                    required
                    disabled
                    size="sm"
                    value={`${issue.data.tracker.name} #${issue.data.id}: ${issue.data.subject}`}
                  />
                )}

                <div
                  className={clsxm("grid grid-cols-4 gap-x-2", {
                    "grid-cols-5": settings.style.timeFormat === "decimal",
                  })}
                >
                  {settings.style.timeFormat === "decimal" ? (
                    <FastField
                      type="number"
                      name="hours"
                      title={formatMessage({ id: "time.time-entry.field.hours" })}
                      placeholder={formatMessage({ id: "time.time-entry.field.hours" })}
                      error={touched.hours && errors.hours}
                      min="0"
                      step="0.01"
                      max="24"
                      required
                      as={InputField}
                      size="sm"
                      inputClassName="appearance-none"
                      extraText={
                        values.hours >= 0 && values.hours <= 24
                          ? formatMessage(
                              { id: "format.hours" },
                              {
                                hours: formatHoursUsually(values.hours),
                              }
                            )
                          : undefined
                      }
                      autoComplete="off"
                      className="col-span-3"
                    />
                  ) : (
                    <FastField
                      type="number"
                      name="hours"
                      title={formatMessage({ id: "time.time-entry.field.hours" })}
                      placeholder={formatMessage({ id: "time.time-entry.field.hours" })}
                      error={touched.hours && errors.hours}
                      required
                      as={TimeField}
                      size="sm"
                      autoComplete="off"
                      className="col-span-2"
                    />
                  )}

                  <FastField
                    type="date"
                    name="spent_on"
                    title={formatMessage({ id: "time.time-entry.field.spent-on" })}
                    placeholder={formatMessage({ id: "time.time-entry.field.spent-on" })}
                    error={touched.spent_on && errors.spent_on}
                    required
                    as={DateField}
                    size="sm"
                    options={{
                      maxDate: new Date(),
                    }}
                    className="col-span-2"
                  />
                </div>

                <FastField
                  type="text"
                  name="comments"
                  title={formatMessage({ id: "time.time-entry.field.comments" })}
                  placeholder={formatMessage({ id: "time.time-entry.field.comments" })}
                  error={touched.comments && errors.comments}
                  as={InputField}
                  size="sm"
                  autoFocus
                />

                <FastField
                  type="select"
                  name="activity_id"
                  title={formatMessage({ id: "time.time-entry.field.activity" })}
                  placeholder={formatMessage({ id: "time.time-entry.field.activity" })}
                  noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
                  error={touched.activity_id && errors.activity_id}
                  required
                  as={ReactSelectFormik}
                  size="sm"
                  options={timeEntryActivities.data?.map((activity) => ({
                    label: activity.name,
                    value: activity.id,
                  }))}
                  isLoading={timeEntryActivities.isLoading}
                  shouldUpdate={shouldUpdate}
                />

                <Button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-x-2">
                  <FormattedMessage id="time.modal.edit-time-entry.submit" />
                  {isSubmitting && <LoadingSpinner />}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      {updateTimeEntryMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(updateTimeEntryMutation.error)
              ? (updateTimeEntryMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (updateTimeEntryMutation.error as AxiosError).message
              : (updateTimeEntryMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default EditTimeEntryModal;

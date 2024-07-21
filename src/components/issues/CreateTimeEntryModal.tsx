import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { startOfDay } from "date-fns";
import { FastField, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useMyUser from "../../hooks/useMyUser";
import useProject from "../../hooks/useProject";
import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import useTimeEntryActivities from "../../hooks/useTimeEntryActivities";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { TCreateTimeEntry, TIssue, TRedmineError, TUpdateIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import { formatHoursUsually } from "../../utils/date";
import Button from "../general/Button";
import DateField from "../general/DateField";
import Fieldset from "../general/Fieldset";
import InputField from "../general/InputField";
import LoadingSpinner from "../general/LoadingSpinner";
import Modal from "../general/Modal";
import ReactSelectFormik, { shouldUpdate } from "../general/ReactSelectFormik";
import TextareaField from "../general/TextareaField";
import TimeField from "../general/TimeField";
import Toast from "../general/Toast";
import Toggle from "../general/Toggle";
import TimeEntryPreview from "../time/TimeEntryPreview";
import DoneSlider from "./DoneSlider";
import SpentVsEstimatedTime from "./SpentVsEstimatedTime";
import TimeEntryUsersField from "./fields/TimeEntryUsersField";

type PropTypes = {
  issue: TIssue;
  time: number;
  onClose: () => void;
  onSuccess: () => void;
};

type TCreateTimeEntryForm = Omit<TCreateTimeEntry, "user_id"> &
  Pick<TUpdateIssue, "done_ratio" | "notes"> & {
    user_id?: number[];
    add_notes?: boolean;
  };

const _defaultCachedComments = {};

const CreateTimeEntryModal = ({ issue, time, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const formik = useRef<FormikProps<TCreateTimeEntryForm>>(null);

  const myUser = useMyUser();
  const project = useProject(issue.project.id);
  const projectRoles = useMyProjectRoles([issue.project.id]);
  const timeEntryActivities = useTimeEntryActivities(issue.project.id);

  const cachedComments = useStorage<Record<number, string | undefined>>("cachedComments", _defaultCachedComments);

  useEffect(() => {
    formik.current?.setFieldValue("activity_id", timeEntryActivities.defaultActivity?.id);
  }, [timeEntryActivities.defaultActivity]);

  useEffect(() => {
    if (myUser.data?.id) {
      formik.current?.setFieldValue("user_id", [myUser.data.id]);
    }
  }, [myUser.data?.id]);

  useEffect(() => {
    if (!settings.features.cacheComments) return;
    // load cached comment to formik
    const comments = cachedComments.data[issue.id];
    if (comments) {
      formik.current?.setFieldValue("comments", comments);
    }
  }, [settings.features.cacheComments, issue.id, cachedComments.data]);

  const createTimeEntryMutation = useMutation({
    mutationFn: (entry: TCreateTimeEntry) => redmineApi.createTimeEntry(entry),
    onSuccess: (_, entry) => {
      // if entry created for me => invalidate query
      if (!entry.user_id || entry.user_id === myUser.data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["timeEntries"],
        });
      }
    },
  });

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => redmineApi.updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["additionalIssues"] });
    },
  });

  return (
    <>
      <Modal
        title={formatMessage({ id: "issues.modal.add-spent-time.title" })}
        onClose={() => {
          if (settings.features.cacheComments) {
            // if comment or already cached => save/update comment
            const comments = formik.current?.values.comments;
            if (comments || cachedComments.data[issue.id]) {
              cachedComments.setData({ ...cachedComments.data, [issue.id]: comments });
            }
          }
          onClose();
        }}
      >
        <Formik<TCreateTimeEntryForm>
          innerRef={formik}
          initialValues={
            {
              issue_id: issue.id,
              done_ratio: issue.done_ratio,
              hours: Number((time / 1000 / 60 / 60).toFixed(2)),
              spent_on: new Date(),
              user_id: undefined,
              comments: "",
              activity_id: undefined,
              add_notes: false,
              notes: "",
            } satisfies Partial<TCreateTimeEntryForm> as unknown as TCreateTimeEntryForm
          }
          validationSchema={Yup.object({
            done_ratio: Yup.number().min(0).max(100),
            hours: Yup.number()
              .required(formatMessage({ id: "time.time-entry.field.hours.validation.required" }))
              .min(0.01, formatMessage({ id: "time.time-entry.field.hours.validation.greater-than-zero" }))
              .max(24, formatMessage({ id: "time.time-entry.field.hours.validation.less-than-24" })),
            spent_on: Yup.date().max(new Date(), formatMessage({ id: "time.time-entry.field.spent-on.validation.in-future" })),
            user_id: Yup.array(Yup.number()),
            comments: Yup.string(),
            activity_id: Yup.number().required(formatMessage({ id: "time.time-entry.field.activity.validation.required" })),
            add_notes: Yup.boolean(),
            notes: Yup.string(),
          })}
          onSubmit={async (originalValues, { setSubmitting }) => {
            const values = { ...originalValues };
            //console.log("onSubmit", values);
            if (values.done_ratio !== issue.done_ratio || (values.add_notes && values.notes)) {
              await updateIssueMutation.mutateAsync({ done_ratio: values.done_ratio !== issue.done_ratio ? values.done_ratio : undefined, notes: values.add_notes ? values.notes : undefined });
            }
            delete values.done_ratio;
            delete values.add_notes;
            delete values.notes;
            if (values.user_id && Array.isArray(values.user_id) && values.user_id.length > 0) {
              // create for multiple users
              for (const userId of values.user_id) {
                await createTimeEntryMutation.mutateAsync({ ...values, user_id: userId });
              }
            } else {
              // create for me
              await createTimeEntryMutation.mutateAsync({ ...values, user_id: undefined as never });
            }
            setSubmitting(false);
            if (!createTimeEntryMutation.isError) {
              if (settings.features.cacheComments) {
                // if has cached comment => remove it
                if (cachedComments.data[issue.id]) {
                  cachedComments.setData({ ...cachedComments.data, [issue.id]: undefined });
                }
              }
              onSuccess();
            }
          }}
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              <div className="flex flex-col gap-y-2">
                <h1 className="mb-1 truncate">
                  <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline">
                    #{issue.id}
                  </a>{" "}
                  {issue.subject}
                </h1>

                <div className="flex justify-between gap-x-3">
                  <FastField type="range" name="done_ratio" as={DoneSlider} className="mb-1" />

                  {issue.estimated_hours && <SpentVsEstimatedTime issue={issue} previewHours={values.hours ? values.hours : 0} />}
                </div>

                {values.spent_on && <TimeEntryPreview date={startOfDay(values.spent_on)} previewHours={values.hours ? values.hours : 0} />}

                <Fieldset className="flex flex-col gap-y-2">
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

                  {projectRoles.hasProjectPermission(project.data ?? issue.project, "log_time_for_other_users") && (
                    <FastField
                      type="select"
                      name="user_id"
                      error={touched.user_id && errors.user_id}
                      as={TimeEntryUsersField}
                      projectId={issue.project.id}
                      size="sm"
                      isMulti
                      closeMenuOnSelect={false}
                      shouldUpdate={shouldUpdate}
                    />
                  )}

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
                </Fieldset>

                {settings.features.addNotes &&
                  projectRoles.hasProjectPermission(project.data ?? issue.project, "add_issue_notes") &&
                  (!values.add_notes ? (
                    <FastField type="checkbox" name="add_notes" title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} as={Toggle} error={touched.add_notes && errors.add_notes} />
                  ) : (
                    <Fieldset legend={formatMessage({ id: "issues.issue.field.notes" })} className="flex flex-col gap-y-2">
                      <FastField type="checkbox" name="add_notes" title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} as={Toggle} error={touched.add_notes && errors.add_notes} />

                      {values.add_notes && (
                        <FastField type="textarea" name="notes" placeholder={formatMessage({ id: "issues.issue.field.notes" })} as={TextareaField} size="sm" error={touched.notes && errors.notes} />
                      )}
                    </Fieldset>
                  ))}

                <Button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-x-2">
                  <FormattedMessage id="issues.modal.add-spent-time.submit" />
                  {isSubmitting && <LoadingSpinner />}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      {createTimeEntryMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(createTimeEntryMutation.error)
              ? (createTimeEntryMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (createTimeEntryMutation.error as AxiosError).message
              : (createTimeEntryMutation.error as Error).message
          }
        />
      )}
      {updateIssueMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(updateIssueMutation.error)
              ? (updateIssueMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (updateIssueMutation.error as AxiosError).message
              : (updateIssueMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default CreateTimeEntryModal;

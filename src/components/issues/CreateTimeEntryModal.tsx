import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { startOfDay } from "date-fns";
import { FastField, Form, Formik, FormikProps, getIn } from "formik";
import { useEffect, useMemo, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { createTimeEntry, updateIssue } from "../../api/redmine";
import useMyAccount from "../../hooks/useMyAccount";
import useProjectUsers from "../../hooks/useProjectUsers";
import useSettings from "../../hooks/useSettings";
import useStorage from "../../hooks/useStorage";
import useTimeEntryActivities from "../../hooks/useTimeEntryActivities";
import { TCreateTimeEntry, TIssue, TRedmineError, TUpdateIssue } from "../../types/redmine";
import { formatHoursUsually } from "../../utils/date";
import { getGroupedUsers } from "../../utils/user";
import Button from "../general/Button";
import DateField from "../general/DateField";
import Fieldset from "../general/Fieldset";
import InputField from "../general/InputField";
import LoadingSpinner from "../general/LoadingSpinner";
import Modal from "../general/Modal";
import ReactSelectFormik from "../general/ReactSelectFormik";
import SelectField from "../general/SelectField";
import TextareaField from "../general/TextareaField";
import Toast from "../general/Toast";
import Toggle from "../general/Toggle";
import TimeEntryPreview from "../time/TimeEntryPreview";
import DoneSlider from "./DoneSlider";
import SpentVsEstimatedTime from "./SpentVsEstimatedTime";

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
  const { formatMessage, formatDate } = useIntl();
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const formik = useRef<FormikProps<TCreateTimeEntryForm>>(null);

  const myAccount = useMyAccount();
  const timeEntryActivities = useTimeEntryActivities();
  const users = useProjectUsers(issue.project.id, { enabled: settings.features.addSpentTimeForOtherUsers });

  const cachedComments = useStorage<Record<number, string | undefined>>("cachedComments", _defaultCachedComments);

  useEffect(() => {
    formik.current?.setFieldValue("activity_id", timeEntryActivities.data.find((entry) => entry.is_default)?.id ?? undefined);
  }, [timeEntryActivities.data]);

  useEffect(() => {
    if (!settings.features.cacheComments) return;
    // load cached comment to formik
    const comments = cachedComments.data[issue.id];
    if (comments) {
      formik.current?.setFieldValue("comments", comments);
    }
  }, [settings.features.cacheComments, issue.id, cachedComments.data]);

  const createTimeEntryMutation = useMutation({
    mutationFn: (entry: TCreateTimeEntry) => createTimeEntry(entry),
    onSuccess: (_, entry) => {
      // if entry created for me => invalidate query
      if (!entry.user_id || entry.user_id === myAccount.data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["timeEntries"],
        });
      }
    },
  });

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["additionalIssues"] });
    },
  });

  const groupedUsers = useMemo(() => getGroupedUsers(users.data), [users.data]);

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
        <Formik
          innerRef={formik}
          initialValues={{
            issue_id: issue.id,
            done_ratio: issue.done_ratio,
            hours: Number((time / 1000 / 60 / 60).toFixed(2)),
            spent_on: new Date(),
            user_id: undefined,
            comments: "",
            activity_id: undefined,
            add_notes: false,
            notes: "",
          }}
          validationSchema={Yup.object({
            done_ratio: Yup.number().min(0).max(100),
            hours: Yup.number()
              .required(formatMessage({ id: "issues.modal.add-spent-time.hours.validation.required" }))
              .min(0.01, formatMessage({ id: "issues.modal.add-spent-time.hours.validation.greater-than-zero" }))
              .max(24, formatMessage({ id: "issues.modal.add-spent-time.hours.validation.less-than-24" })),
            spent_on: Yup.date().max(new Date(), formatMessage({ id: "issues.modal.add-spent-time.date.validation.in-future" })),
            user_id: Yup.array(Yup.number()),
            comments: Yup.string(),
            activity_id: Yup.number().required(formatMessage({ id: "issues.modal.add-spent-time.activity.validation.required" })),
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
              await createTimeEntryMutation.mutateAsync({ ...values, user_id: undefined });
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
                  <div className="grid grid-cols-5 gap-x-2">
                    <FastField
                      type="number"
                      name="hours"
                      title={formatMessage({ id: "issues.modal.add-spent-time.hours" })}
                      placeholder={formatMessage({ id: "issues.modal.add-spent-time.hours" })}
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
                      error={touched.hours && errors.hours}
                      autoComplete="off"
                      className="col-span-3"
                    />

                    <FastField
                      type="date"
                      name="spent_on"
                      title={formatMessage({ id: "issues.modal.add-spent-time.date" })}
                      placeholder={formatMessage({ id: "issues.modal.add-spent-time.date" })}
                      required
                      as={DateField}
                      size="sm"
                      error={touched.spent_on && errors.spent_on}
                      options={{
                        maxDate: new Date(),
                        altInput: true,
                        formatDate: (date: Date) => formatDate(date),
                      }}
                      className="col-span-2"
                    />
                  </div>

                  {settings.features.addSpentTimeForOtherUsers && (
                    <FastField
                      type="select"
                      name="user_id"
                      title={formatMessage({ id: "issues.modal.add-spent-time.user" })}
                      placeholder={formatMessage({ id: "issues.modal.add-spent-time.user" })}
                      noOptionsMessage={() => formatMessage({ id: "issues.modal.add-spent-time.user.no-users" })}
                      as={ReactSelectFormik}
                      options={groupedUsers.map(({ role, users }) => ({
                        label: role.name,
                        options: users.map((user) => ({
                          value: user.id,
                          label: user.id === myAccount.data?.id ? `${user.name} (${formatMessage({ id: "issues.modal.add-spent-time.user.me" })})` : user.name,
                        })),
                      }))}
                      error={touched.user_id && errors.user_id}
                      isClearable
                      isMulti
                      closeMenuOnSelect={false}
                      maxMenuHeight={200}
                      isLoading={users.isLoading}
                      // update the FastField component if isLoading or options changed
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      shouldUpdate={(nextProps: any, currentProps: any) =>
                        nextProps.isLoading !== currentProps.isLoading ||
                        nextProps.options !== currentProps.options ||
                        // formik's default shouldUpdate
                        nextProps.name !== currentProps.name ||
                        nextProps.formik.isSubmitting !== currentProps.formik.isSubmitting ||
                        Object.keys(nextProps).length !== Object.keys(currentProps).length ||
                        getIn(nextProps.formik.values, currentProps.name) !== getIn(currentProps.formik.values, currentProps.name) ||
                        getIn(nextProps.formik.errors, currentProps.name) !== getIn(currentProps.formik.errors, currentProps.name) ||
                        getIn(nextProps.formik.touched, currentProps.name) !== getIn(currentProps.formik.touched, currentProps.name)
                      }
                    />
                  )}

                  <FastField
                    type="text"
                    name="comments"
                    title={formatMessage({ id: "issues.modal.add-spent-time.comments" })}
                    placeholder={formatMessage({ id: "issues.modal.add-spent-time.comments" })}
                    as={InputField}
                    size="sm"
                    error={touched.comments && errors.comments}
                    autoFocus
                  />

                  <FastField
                    type="select"
                    name="activity_id"
                    title={formatMessage({ id: "issues.modal.add-spent-time.activity" })}
                    placeholder={formatMessage({ id: "issues.modal.add-spent-time.activity" })}
                    required
                    as={SelectField}
                    size="sm"
                    error={touched.activity_id && errors.activity_id}
                  >
                    {timeEntryActivities.data.map((activity) => (
                      <>
                        <option key={activity.id} value={activity.id}>
                          {activity.name}
                        </option>
                      </>
                    ))}
                  </FastField>
                </Fieldset>

                {settings.features.addNotes &&
                  (!values.add_notes ? (
                    <FastField type="checkbox" name="add_notes" title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} as={Toggle} error={touched.add_notes && errors.add_notes} />
                  ) : (
                    <Fieldset legend={formatMessage({ id: "issues.modal.add-spent-time.notes" })} className="flex flex-col gap-y-2">
                      <FastField type="checkbox" name="add_notes" title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} as={Toggle} error={touched.add_notes && errors.add_notes} />

                      {values.add_notes && (
                        <FastField
                          type="textarea"
                          name="notes"
                          placeholder={formatMessage({ id: "issues.modal.add-spent-time.notes" })}
                          as={TextareaField}
                          size="sm"
                          error={touched.notes && errors.notes}
                        />
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
    </>
  );
};

export default CreateTimeEntryModal;

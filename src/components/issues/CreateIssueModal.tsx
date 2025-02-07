import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { FastField, Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import useIssuePriorities from "../../hooks/useIssuePriorities";
import useIssueTrackers from "../../hooks/useIssueTrackers";
import useMyUser from "../../hooks/useMyUser";
import useProject from "../../hooks/useProject";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { useSettings } from "../../provider/SettingsProvider";
import { TCreateIssue, TRedmineError } from "../../types/redmine";
import Button from "../general/Button";
import DateField, { shouldUpdate as shouldUpdateDateField } from "../general/DateField";
import DismissibleWarning from "../general/DismissableWarning";
import InputField from "../general/InputField";
import LoadingSpinner from "../general/LoadingSpinner";
import Modal from "../general/Modal";
import ReactSelectFormik, { shouldUpdate as shouldUpdateReactSelect } from "../general/ReactSelectFormik";
import TextareaField from "../general/TextareaField";
import TimeField from "../general/TimeField";
import Toast from "../general/Toast";
import AssigneeField from "./fields/AssigneeField";
import CategoryField from "./fields/CategoryField";
import DoneRatioField from "./fields/DoneRatioField";
import PriorityField from "./fields/PriorityField";
import VersionField from "./fields/VersionField";

type PropTypes = {
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
};

const CreateIssueModal = ({ projectId, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const formik = useRef<FormikProps<TCreateIssue>>(null);

  const myUser = useMyUser();
  const project = useProject(projectId);
  const issueTrackers = useIssueTrackers(projectId);
  const issuePriorities = useIssuePriorities();

  useEffect(() => {
    formik.current?.setFieldValue("tracker_id", issueTrackers.defaultTracker?.id);
  }, [issueTrackers.defaultTracker]);

  useEffect(() => {
    formik.current?.setFieldValue("priority_id", issuePriorities.defaultPriority?.id);
  }, [issuePriorities.defaultPriority]);

  useEffect(() => {
    formik.current?.setFieldValue("assigned_to_id", myUser.data?.id);
  }, [myUser.data?.id]);

  useEffect(() => {
    formik.current?.setFieldValue("fixed_version_id", project.data?.default_version?.id);
  }, [project.data?.default_version?.id]);

  const createIssueMutation = useMutation({
    mutationFn: (issue: TCreateIssue) => redmineApi.createIssue(issue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onSuccess();
    },
  });

  return (
    <>
      <Modal title={formatMessage({ id: "issues.modal.add-issue.title" })} onClose={onClose}>
        <Formik<TCreateIssue>
          innerRef={formik}
          initialValues={
            {
              project_id: projectId,
            } satisfies Partial<TCreateIssue> as TCreateIssue
          }
          validationSchema={Yup.object({
            tracker_id: Yup.number().required(formatMessage({ id: "issues.issue.field.tracker.validation.required" })),
            status_id: Yup.number().required(formatMessage({ id: "issues.issue.field.status.validation.required" })),
            subject: Yup.string().required(formatMessage({ id: "issues.issue.field.subject.validation.required" })),
            description: Yup.string(),
            priority_id: Yup.number().required(formatMessage({ id: "issues.issue.field.priority.validation.required" })),
            assigned_to_id: Yup.number().nullable(),
            category_id: Yup.number().nullable(),
            fixed_version_id: Yup.number().nullable(),
            start_date: Yup.date().nullable(),
            due_date: Yup.date()
              .nullable()
              .when("start_date", ([start_date], schema) => (start_date ? schema.min(start_date, formatMessage({ id: "issues.issue.field.due-date.validation.greater-than-start-date" })) : schema)),
            estimated_hours: Yup.number()
              .nullable()
              .min(0.01, formatMessage({ id: "issues.issue.field.estimated-hours.validation.greater-than-zero" })),
            done_ratio: Yup.number().nullable().min(0).max(100),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            await createIssueMutation.mutateAsync(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, values, touched, errors, setFieldValue }) => {
            const selectedTracker = issueTrackers.data?.find((tracker) => tracker.id === values.tracker_id);
            const hasTrackerNoEnabledFields = selectedTracker && selectedTracker.enabled_standard_fields === undefined;
            if (selectedTracker && values.status_id !== selectedTracker.default_status?.id) {
              setFieldValue("status_id", selectedTracker.default_status?.id);
            }
            return (
              <Form>
                <div className="flex flex-col gap-y-2">
                  <div className="grid grid-cols-2 gap-x-2">
                    <Field
                      type="select"
                      name="tracker_id"
                      title={formatMessage({ id: "issues.issue.field.tracker" })}
                      placeholder={formatMessage({ id: "issues.issue.field.tracker" })}
                      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
                      error={touched.tracker_id && errors.tracker_id}
                      required
                      as={ReactSelectFormik}
                      size="sm"
                      options={issueTrackers.data?.map((tracker) => ({
                        label: tracker.name,
                        value: tracker.id,
                      }))}
                      isLoading={issueTrackers.isLoading}
                      shouldUpdate={shouldUpdateReactSelect}
                    />

                    <FastField
                      type="select"
                      name="status_id"
                      title={formatMessage({ id: "issues.issue.field.status" })}
                      placeholder={formatMessage({ id: "issues.issue.field.status" })}
                      noOptionsMessage={() => formatMessage({ id: "general.no-options" })}
                      error={touched.status_id && errors.status_id}
                      required
                      isDisabled
                      as={ReactSelectFormik}
                      size="sm"
                      options={
                        selectedTracker?.default_status
                          ? [
                              {
                                label: selectedTracker.default_status.name,
                                value: selectedTracker.default_status.id,
                              },
                            ]
                          : []
                      }
                      shouldUpdate={shouldUpdateReactSelect}
                    />
                  </div>

                  <FastField
                    type="text"
                    name="subject"
                    title={formatMessage({ id: "issues.issue.field.subject" })}
                    placeholder={formatMessage({ id: "issues.issue.field.subject" })}
                    error={touched.subject && errors.subject}
                    required
                    as={InputField}
                    size="sm"
                    autoFocus
                  />

                  {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("description")) && (
                    <FastField
                      type="textarea"
                      name="description"
                      title={formatMessage({ id: "issues.issue.field.description" })}
                      placeholder={formatMessage({ id: "issues.issue.field.description" })}
                      error={touched.description && errors.description}
                      as={TextareaField}
                      size="sm"
                      rows={1}
                    />
                  )}

                  <div className="grid grid-cols-2 gap-x-2">
                    <div className="flex flex-col gap-y-2">
                      <FastField type="select" name="priority_id" error={touched.priority_id && errors.priority_id} required as={PriorityField} size="sm" shouldUpdate={shouldUpdateReactSelect} />

                      {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("assigned_to_id")) && (
                        <FastField
                          type="select"
                          name="assigned_to_id"
                          error={touched.assigned_to_id && errors.assigned_to_id}
                          as={AssigneeField}
                          size="sm"
                          projectId={projectId}
                          shouldUpdate={shouldUpdateReactSelect}
                        />
                      )}

                      {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("category_id")) && (
                        <FastField
                          type="select"
                          name="category_id"
                          error={touched.category_id && errors.category_id}
                          as={CategoryField}
                          size="sm"
                          projectId={projectId}
                          shouldUpdate={shouldUpdateReactSelect}
                        />
                      )}

                      {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("fixed_version_id")) && (
                        <FastField
                          type="select"
                          name="fixed_version_id"
                          error={touched.fixed_version_id && errors.fixed_version_id}
                          as={VersionField}
                          size="sm"
                          projectId={projectId}
                          shouldUpdate={shouldUpdateReactSelect}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("start_date")) && (
                        <FastField
                          type="date"
                          name="start_date"
                          title={formatMessage({ id: "issues.issue.field.start-date" })}
                          placeholder={formatMessage({ id: "issues.issue.field.start-date" })}
                          error={touched.start_date && errors.start_date}
                          as={DateField}
                          size="sm"
                          options={{
                            maxDate: values.due_date,
                          }}
                          shouldUpdate={shouldUpdateDateField}
                        />
                      )}

                      {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("due_date")) && (
                        <FastField
                          type="date"
                          name="due_date"
                          title={formatMessage({ id: "issues.issue.field.due-date" })}
                          placeholder={formatMessage({ id: "issues.issue.field.due-date" })}
                          error={touched.due_date && errors.due_date}
                          as={DateField}
                          size="sm"
                          options={{
                            minDate: values.start_date,
                          }}
                          shouldUpdate={shouldUpdateDateField}
                        />
                      )}

                      {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("estimated_hours")) &&
                        (settings.style.timeFormat === "decimal" ? (
                          <FastField
                            type="number"
                            name="estimated_hours"
                            title={formatMessage({ id: "issues.issue.field.estimated-hours" })}
                            placeholder={formatMessage({ id: "issues.issue.field.estimated-hours" })}
                            error={touched.estimated_hours && errors.estimated_hours}
                            min="0"
                            step="0.01"
                            as={InputField}
                            size="sm"
                            inputClassName="appearance-none"
                            autoComplete="off"
                          />
                        ) : (
                          <FastField
                            type="number"
                            name="estimated_hours"
                            title={formatMessage({ id: "issues.issue.field.estimated-hours" })}
                            placeholder={formatMessage({ id: "issues.issue.field.estimated-hours" })}
                            error={touched.estimated_hours && errors.estimated_hours}
                            as={TimeField}
                            size="sm"
                            autoComplete="off"
                          />
                        ))}

                      {hasTrackerNoEnabledFields ||
                        (selectedTracker?.enabled_standard_fields?.includes("done_ratio") && (
                          <FastField type="select" name="done_ratio" error={touched.done_ratio && errors.done_ratio} as={DoneRatioField} size="sm" />
                        ))}
                    </div>
                  </div>

                  {hasTrackerNoEnabledFields && (
                    <DismissibleWarning name="trackerNoEnabledFields">
                      <FormattedMessage id="issues.modal.add-issue.tracker-with-no-enabled-fields.warning" />
                    </DismissibleWarning>
                  )}

                  <DismissibleWarning name="unknownWorkflowPermissions">
                    <FormattedMessage id="issues.modal.add-issue.unknown-workflow-permissions.warning" />
                  </DismissibleWarning>

                  <Button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-x-2">
                    <FormattedMessage id="issues.modal.add-issue.submit" />
                    {isSubmitting && <LoadingSpinner />}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
      {createIssueMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(createIssueMutation.error)
              ? ((createIssueMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (createIssueMutation.error as AxiosError).message)
              : (createIssueMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default CreateIssueModal;

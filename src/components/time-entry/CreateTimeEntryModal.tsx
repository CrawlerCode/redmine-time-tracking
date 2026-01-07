/* eslint-disable react/no-children-prop */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfDay } from "date-fns";
import { useIntl } from "react-intl";
import z from "zod/v4";
import { TCreateTimeEntry, TIssue, TUpdateIssue } from "../../api/redmine/types";
import { useAppForm } from "../../hooks/useAppForm";
import useCachedComments from "../../hooks/useCachedComments";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useMyUser from "../../hooks/useMyUser";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { useSettings } from "../../provider/SettingsProvider";
import ActivityField from "../issue/form/fields/ActivityField";
import { DoneSliderField } from "../issue/form/fields/DoneSliderField";
import IssueTitle from "../issue/IssueTitle";
import SpentVsEstimatedTime from "../issue/SpentVsEstimatedTime";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormFieldset, FormGrid } from "../ui/form";
import UserField from "./form/fields/UserField";
import TimeEntryPreview from "./TimeEntryPreview";

type PropTypes = {
  issue: TIssue;
  initialValues?: Partial<TCreateTimeEntryForm>;
  onClose: () => void;
  onSuccess: () => void;
};

const createTimeEntryFormSchema = ({ formatMessage }: { formatMessage: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z.object({
    issue_id: z.int(),
    user_id: z.array(z.int()).optional(),
    hours: z
      .number(formatMessage({ id: "time.time-entry.field.hours.validation.required" }))
      .min(0.01, formatMessage({ id: "time.time-entry.field.hours.validation.greater-than-zero" }))
      .max(24, formatMessage({ id: "time.time-entry.field.hours.validation.less-than-24" })),
    spent_on: z.date(formatMessage({ id: "time.time-entry.field.spent-on.validation.required" })).max(new Date(), formatMessage({ id: "time.time-entry.field.spent-on.validation.in-future" })),
    comments: z.string().optional(),
    activity_id: z.int(formatMessage({ id: "time.time-entry.field.activity.validation.required" })),
    done_ratio: z.number().min(0).max(100).optional(),
    add_notes: z.boolean().optional(),
    notes: z.string().optional(),
  });

type TCreateTimeEntryForm = z.infer<ReturnType<typeof createTimeEntryFormSchema>>;

const CreateTimeEntryModal = ({ issue, initialValues, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const myUser = useMyUser();
  const projectRoles = useMyProjectRoles([issue.project.id]);

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
    meta: {
      successMessage: formatMessage({ id: "issues.modal.add-spent-time.success" }),
    },
  });

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => redmineApi.updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      issue_id: issue.id,
      user_id: myUser.data?.id ? [myUser.data.id] : undefined,
      hours: 0,
      spent_on: new Date(),
      comments: undefined,
      activity_id: undefined,
      done_ratio: undefined,
      add_notes: false,
      notes: undefined,
      ...initialValues,
    } satisfies Partial<TCreateTimeEntryForm> as TCreateTimeEntryForm,
    validators: {
      onChange: createTimeEntryFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value: originalValue }) => {
      const { done_ratio, add_notes, notes, ...value } = { ...originalValue };

      // Update issue done_ratio and notes
      const updatedDoneRatio = done_ratio && done_ratio !== issue.done_ratio ? done_ratio : undefined;
      const addNotes = add_notes && notes ? notes : undefined;
      if (updatedDoneRatio || addNotes) {
        await updateIssueMutation.mutateAsync({
          done_ratio: updatedDoneRatio,
          notes: addNotes,
        });
      }

      // Create time entry
      if (value.user_id && Array.isArray(value.user_id) && value.user_id.length > 0) {
        // create for multiple users
        for (const userId of value.user_id) {
          try {
            await createTimeEntryMutation.mutateAsync({ ...value, user_id: userId });
          } catch (_) {
            continue; // continue on other users
          }
        }
      } else {
        // create for me
        await createTimeEntryMutation.mutateAsync({ ...value, user_id: undefined as never });
      }

      if (!createTimeEntryMutation.isError) {
        // if has cached comment => remove it
        if (cachedComments.isEnabled && cachedComments.isCached) {
          cachedComments.removeComment();
        }

        onSuccess();
      }
    },
  });

  const cachedComments = useCachedComments({
    identifier: issue.id,
    enabled: settings.features.cacheComments,
    onLoad: (comment) => {
      form.setFieldValue("comments", comment);
    },
  });

  return (
    <>
      <Dialog
        open
        onOpenChange={() => {
          // if comment exist => save/update comment
          const comment = form.state.values.comments;
          if (cachedComments.isEnabled && (comment || cachedComments.isCached)) {
            cachedComments.saveComment(comment);
          }

          onClose();
        }}
      >
        <DialogContent>
          <Form onSubmit={form.handleSubmit}>
            <DialogHeader>
              <DialogTitle>{formatMessage({ id: "issues.modal.add-spent-time.title" })}</DialogTitle>
            </DialogHeader>
            <IssueTitle issue={issue} />
            <FormGrid cols={2}>
              <form.AppField name="done_ratio" children={() => <DoneSliderField className="col-span-1 self-center" />} />

              <form.Subscribe selector={(state) => state.values.hours} children={(hours) => <SpentVsEstimatedTime issue={issue} previewHours={hours} className="col-span-1 justify-self-end" />} />

              <form.Subscribe
                selector={(state) => ({
                  hours: state.values.hours,
                  spent_on: state.values.spent_on,
                })}
                children={({ hours, spent_on }) => <TimeEntryPreview date={startOfDay(spent_on)} previewHours={hours} />}
              />

              <FormFieldset>
                <FormGrid cols={2}>
                  <form.AppField
                    name="hours"
                    children={(field) => (
                      <field.HoursField
                        title={formatMessage({ id: "time.time-entry.field.hours" })}
                        placeholder={formatMessage({ id: "time.time-entry.field.hours" })}
                        required
                        {...(settings.style.timeFormat === "decimal" && {
                          max: "24",
                        })}
                        autoFocus={field.state.value === 0}
                        className="col-span-1"
                      />
                    )}
                  />

                  <form.AppField
                    name="spent_on"
                    children={(field) => (
                      <field.DateField
                        title={formatMessage({ id: "time.time-entry.field.spent-on" })}
                        placeholder={formatMessage({ id: "time.time-entry.field.spent-on" })}
                        required
                        disabledDates={{
                          after: new Date(),
                        }}
                        className="col-span-1"
                      />
                    )}
                  />

                  {projectRoles.hasProjectPermission(issue.project.id, "log_time_for_other_users") && (
                    <form.AppField name="user_id" children={() => <UserField projectId={issue.project.id} mode="multiple" />} />
                  )}

                  <form.AppField
                    name="comments"
                    children={(field) => (
                      <field.TextField
                        title={formatMessage({ id: "time.time-entry.field.comments" })}
                        placeholder={formatMessage({ id: "time.time-entry.field.comments" })}
                        autoFocus={field.form.state.values.hours > 0}
                      />
                    )}
                  />

                  <form.AppField
                    name="activity_id"
                    children={(field) => <ActivityField projectId={issue.project.id} onDefaultActivityChange={(activityId) => field.setValue(activityId)} required />}
                  />
                </FormGrid>
              </FormFieldset>

              {settings.features.addNotes && projectRoles.hasProjectPermission(issue.project.id, "add_issue_notes") && (
                <form.Subscribe
                  selector={(state) => state.values.add_notes}
                  children={(add_notes) =>
                    !add_notes ? (
                      <form.AppField name="add_notes" children={(field) => <field.ToggleField title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} />} />
                    ) : (
                      <FormFieldset legend={formatMessage({ id: "issues.issue.field.notes" })}>
                        <FormGrid>
                          <form.AppField name="add_notes" children={(field) => <field.ToggleField title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} />} />
                          <form.AppField name="notes" children={(field) => <field.TextareaField placeholder={formatMessage({ id: "issues.issue.field.notes" })} />} />
                        </FormGrid>
                      </FormFieldset>
                    )
                  }
                />
              )}
            </FormGrid>
            <DialogFooter>
              <form.AppForm>
                <form.SubmitButton children={formatMessage({ id: "issues.modal.add-spent-time.submit" })} />
              </form.AppForm>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTimeEntryModal;

/* eslint-disable react/no-children-prop */
import { usePersistentComments } from "@/hooks/usePersistentComments";
import { TimerController } from "@/hooks/useTimers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfDay } from "date-fns";
import { useIntl } from "react-intl";
import { z } from "zod";
import { TCreateTimeEntry, TIssue, TUpdateIssue } from "../../api/redmine/types";
import { useAppForm } from "../../hooks/useAppForm";
import useMyUser from "../../hooks/useMyUser";
import { usePermissions } from "../../provider/PermissionsProvider";
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
  timer: TimerController;
  issue: TIssue;
  initialValues: Partial<TCreateTimeEntryForm>;
  onClose: () => void;
  onSuccess: () => void;
};

const createTimeEntryFormSchema = ({ formatMessage }: { formatMessage?: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z.object({
    issue_id: z.int(),
    user_id: z.array(z.int()),
    hours: z
      .number(formatMessage?.({ id: "time.time-entry.field.hours.validation.required" }))
      .min(0.01, formatMessage?.({ id: "time.time-entry.field.hours.validation.greater-than-zero" }))
      .max(24, formatMessage?.({ id: "time.time-entry.field.hours.validation.less-than-24" })),
    spent_on: z.date(formatMessage?.({ id: "time.time-entry.field.spent-on.validation.required" })).max(new Date(), formatMessage?.({ id: "time.time-entry.field.spent-on.validation.in-future" })),
    comments: z.string().nullable(),
    activity_id: z.int(formatMessage?.({ id: "time.time-entry.field.activity.validation.required" })),
    issue: z.object({
      done_ratio: z.number().min(0).max(100),
      _add_notes: z.boolean(),
      notes: z.string().nullable(),
    }),
  });

type TCreateTimeEntryForm = z.infer<ReturnType<typeof createTimeEntryFormSchema>>;

const CreateTimeEntryModal = ({ timer, issue, initialValues, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const myUser = useMyUser();
  const { hasProjectPermission } = usePermissions();

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

  const persistentComments = usePersistentComments({
    identifier: timer.id,
    enabled: settings.features.persistentComments,
  });

  const form = useAppForm({
    defaultValues: {
      issue_id: issue.id,
      user_id: myUser.data?.id ? [myUser.data.id] : [],
      hours: 0,
      spent_on: new Date(),
      comments: null,
      activity_id: undefined,
      issue: {
        done_ratio: issue.done_ratio,
        _add_notes: false,
        notes: null,
      },
      ...initialValues,
      ...(persistentComments.isEnabled &&
        persistentComments.isPersisted && {
          comments: persistentComments.comment,
        }),
    } satisfies Partial<TCreateTimeEntryForm> as TCreateTimeEntryForm,
    validators: {
      onChange: createTimeEntryFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value: originalValue }) => {
      const { issue: updateIssue, ...value } = { ...originalValue };

      // Update issue done_ratio and notes
      const updatedDoneRatio = updateIssue.done_ratio !== issue.done_ratio ? updateIssue.done_ratio : undefined;
      const addNotes = updateIssue._add_notes && updateIssue.notes ? updateIssue.notes : undefined;
      if (updatedDoneRatio !== undefined || addNotes) {
        await updateIssueMutation.mutateAsync({
          done_ratio: updatedDoneRatio,
          notes: addNotes,
        });
      }

      // Create time entry
      if (Array.isArray(value.user_id) && value.user_id.length > 0) {
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
        await createTimeEntryMutation.mutateAsync({ ...value, user_id: undefined });
      }

      if (!createTimeEntryMutation.isError) {
        if (persistentComments.isEnabled && persistentComments.isPersisted) {
          persistentComments.removeComment();
        }

        onSuccess();
      }
    },
  });

  return (
    <>
      <Dialog
        open
        onOpenChange={() => {
          const comment = form.state.values.comments;
          if (persistentComments.isEnabled && ((comment && comment != initialValues.comments) || persistentComments.isPersisted)) {
            persistentComments.saveComment(comment ?? undefined);
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
              <form.AppField name="issue.done_ratio" children={() => <DoneSliderField className="col-span-1 self-center" />} />

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

                  {hasProjectPermission(issue.project.id, "log_time_for_other_users") && <form.AppField name="user_id" children={() => <UserField projectId={issue.project.id} mode="multiple" />} />}

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

              {hasProjectPermission(issue.project.id, "add_issue_notes") && (
                <form.Subscribe
                  selector={(state) => state.values.issue._add_notes}
                  children={(add_notes) =>
                    !add_notes ? (
                      <form.AppField name="issue._add_notes" children={(field) => <field.SwitchField title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} />} />
                    ) : (
                      <FormFieldset legend={formatMessage({ id: "issues.issue.field.notes" })}>
                        <FormGrid>
                          <form.AppField name="issue._add_notes" children={(field) => <field.SwitchField title={formatMessage({ id: "issues.modal.add-spent-time.add-notes" })} />} />
                          <form.AppField name="issue.notes" children={(field) => <field.TextareaField placeholder={formatMessage({ id: "issues.issue.field.notes" })} />} />
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

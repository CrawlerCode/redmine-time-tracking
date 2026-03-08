/* eslint-disable react/no-children-prop */
import { useRedmineIssue } from "@/api/redmine/hooks/useRedmineIssue";
import { redmineTimeEntriesQueries } from "@/api/redmine/queries/timeEntries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import { useIntl } from "react-intl";
import { z } from "zod";
import { TTimeEntry, TUpdateTimeEntry } from "../../api/redmine/types";
import { useAppForm } from "../../hooks/useAppForm";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { useSettings } from "../../provider/SettingsProvider";
import ActivityField from "../issue/form/fields/ActivityField";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Form, FormGrid } from "../ui/form";
import { Input } from "../ui/input";

type PropTypes = {
  entry: TTimeEntry;
  onClose: () => void;
  onSuccess: () => void;
};

const editTimeEntryFormSchema = ({ formatMessage }: { formatMessage: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z.object({
    hours: z
      .number(formatMessage({ id: "time.time-entry.field.hours.validation.required" }))
      .min(0.01, formatMessage({ id: "time.time-entry.field.hours.validation.greater-than-zero" }))
      .max(24, formatMessage({ id: "time.time-entry.field.hours.validation.less-than-24" })),
    spent_on: z.date(formatMessage({ id: "time.time-entry.field.spent-on.validation.required" })).max(new Date(), formatMessage({ id: "time.time-entry.field.spent-on.validation.in-future" })),
    comments: z.string().nullable(),
    activity_id: z.int(formatMessage({ id: "time.time-entry.field.activity.validation.required" })),
  });

type TEditTimeEntryForm = z.infer<ReturnType<typeof editTimeEntryFormSchema>>;

const EditTimeEntryModal = ({ entry, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const issueQuery = useRedmineIssue(entry.issue?.id ?? 0, {
    enabled: !!entry.issue,
  });

  const updateTimeEntryMutation = useMutation({
    mutationFn: (data: TUpdateTimeEntry) => redmineApi.updateTimeEntry(entry.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(redmineTimeEntriesQueries);
    },
    meta: {
      successMessage: formatMessage({ id: "time.modal.edit-time-entry.success" }),
    },
  });

  const form = useAppForm({
    defaultValues: {
      hours: entry.hours,
      spent_on: parseISO(entry.spent_on),
      comments: entry.comments,
      activity_id: entry.activity.id,
    } satisfies TEditTimeEntryForm as TEditTimeEntryForm,
    validators: {
      onChange: editTimeEntryFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value }) => {
      await updateTimeEntryMutation.mutateAsync(value);
      if (!updateTimeEntryMutation.isError) {
        onSuccess();
      }
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <Form onSubmit={form.handleSubmit}>
          <DialogHeader>
            <DialogTitle>{formatMessage({ id: "time.modal.edit-time-entry.title" })}</DialogTitle>
          </DialogHeader>
          <FormGrid cols={2}>
            <Field>
              <FieldLabel required>{formatMessage({ id: "time.time-entry.field.project" })}</FieldLabel>
              <Input name="project_id" placeholder={formatMessage({ id: "time.time-entry.field.project" })} value={entry.project.name} disabled />
            </Field>

            {issueQuery.data && (
              <Field>
                <FieldLabel required>{formatMessage({ id: "time.time-entry.field.issue" })}</FieldLabel>
                <Input
                  name="issue_id"
                  placeholder={formatMessage({ id: "time.time-entry.field.issue" })}
                  value={`${issueQuery.data.tracker.name} #${issueQuery.data.id}: ${issueQuery.data.subject}`}
                  disabled
                />
              </Field>
            )}

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

            <form.AppField
              name="comments"
              children={(field) => <field.TextField title={formatMessage({ id: "time.time-entry.field.comments" })} placeholder={formatMessage({ id: "time.time-entry.field.comments" })} autoFocus />}
            />

            <form.AppField name="activity_id" children={() => <ActivityField projectId={entry.project.id} required />} />
          </FormGrid>
          <DialogFooter>
            <form.AppForm>
              <form.SubmitButton children={formatMessage({ id: "time.modal.edit-time-entry.submit" })} />
            </form.AppForm>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeEntryModal;

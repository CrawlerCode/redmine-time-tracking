/* eslint-disable react/no-children-prop */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import clsx from "clsx";
import { parseISO } from "date-fns";
import { useIntl } from "react-intl";
import { z } from "zod/v4";
import { useAppForm } from "../../hooks/useAppForm";
import useIssue from "../../hooks/useIssue";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { useSettings } from "../../provider/SettingsProvider";
import { TRedmineError, TTimeEntry, TUpdateTimeEntry } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import Modal from "../general/Modal";
import TextInput from "../general/TextInput";
import Toast from "../general/Toast";
import ActivityField from "../issue/form/fields/ActivityField";

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
    comments: z.string().optional(),
    activity_id: z.int(formatMessage({ id: "time.time-entry.field.activity.validation.required" })),
  });

type TEditTimeEntryForm = z.infer<ReturnType<typeof editTimeEntryFormSchema>>;

const EditTimeEntryModal = ({ entry, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const issue = useIssue(entry.issue?.id ?? 0, {
    enabled: !!entry.issue,
  });

  const updateTimeEntryMutation = useMutation({
    mutationFn: (data: TUpdateTimeEntry) => redmineApi.updateTimeEntry(entry.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeEntries"],
      });
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
    <>
      <Modal title={formatMessage({ id: "time.modal.edit-time-entry.title" })} onClose={onClose}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-y-2">
            <TextInput
              name="project_id"
              title={formatMessage({ id: "time.time-entry.field.project" })}
              placeholder={formatMessage({ id: "time.time-entry.field.project" })}
              required
              disabled
              size="sm"
              value={entry.project.name}
            />

            {issue.data && (
              <TextInput
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
              className={clsxm("grid gap-x-2", {
                "grid-cols-5": settings.style.timeFormat === "decimal",
                "grid-cols-4": settings.style.timeFormat === "minutes",
              })}
            >
              <form.AppField
                name="hours"
                children={(field) => (
                  <field.HoursField
                    title={formatMessage({ id: "time.time-entry.field.hours" })}
                    placeholder={formatMessage({ id: "time.time-entry.field.hours" })}
                    required
                    size="sm"
                    className={clsx({
                      "col-span-3": settings.style.timeFormat === "decimal",
                      "col-span-2": settings.style.timeFormat === "minutes",
                    })}
                    {...(settings.style.timeFormat === "decimal" && {
                      max: "24",
                    })}
                    autoFocus={field.state.value === 0}
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
                    size="sm"
                    options={{
                      maxDate: new Date(),
                    }}
                    className="col-span-2"
                  />
                )}
              />
            </div>

            <form.AppField
              name="comments"
              children={(field) => (
                <field.TextField title={formatMessage({ id: "time.time-entry.field.comments" })} placeholder={formatMessage({ id: "time.time-entry.field.comments" })} size="sm" autoFocus />
              )}
            />

            <form.AppField name="activity_id" children={() => <ActivityField projectId={entry.project.id} required size="sm" />} />

            <form.AppForm>
              <form.SubmitButton children={formatMessage({ id: "time.modal.edit-time-entry.submit" })} />
            </form.AppForm>
          </div>
        </form>
      </Modal>
      {updateTimeEntryMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(updateTimeEntryMutation.error)
              ? ((updateTimeEntryMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (updateTimeEntryMutation.error as AxiosError).message)
              : (updateTimeEntryMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default EditTimeEntryModal;

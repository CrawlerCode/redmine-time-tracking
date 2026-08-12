/* eslint-disable react/no-children-prop */
import { useRedmineMultipleProjectTimeEntryActivities } from "@/api/redmine/hooks/useRedmineProjectTimeEntryActivities";
import { redmineTimeEntriesQueries } from "@/api/redmine/queries/timeEntries";
import { TCreateTimeEntry, TIssue } from "@/api/redmine/types";
import ActivityField from "@/components/issue/form/fields/ActivityField";
import { IssueTitle } from "@/components/issue/IssueTitle";
import { TimerProject } from "@/components/timer/ProjectTimersGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormFieldset, FormGrid } from "@/components/ui/form";
import { useAppForm } from "@/hooks/useAppForm";
import { calculateTimerTotalElapsedTime, Timer } from "@/hooks/useTimers";
import { omitUndefinedFilter } from "@/lib/utils";
import { usePermissions } from "@/provider/PermissionsProvider";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { roundMillisecondsToInterval } from "@/utils/date";
import { getErrorMessage } from "@/utils/error";
import { groupTimers, ProjectTimersGroup } from "@/utils/groupTimers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { z } from "zod";

type PropTypes = {
  timers: Timer[];
  issues: TIssue[];
  onClose: () => void;
};

type SubmitTimerGroup = Pick<ProjectTimersGroup, "key" | "type" | "project"> & {
  items: TimerItem[];
  invalid: InvalidTimerItem[];
};

type TimerItem = { timer: Timer; issue: TIssue; hours: number; index: number };

type InvalidTimerItem = {
  timer: Timer;
  issue?: TIssue;
  reason: "unknown-issue" | "no-permission";
};

const submitTimersFormSchema = ({ formatMessage }: { formatMessage: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z.object({
    spent_on: z.date(formatMessage({ id: "time.time-entry.field.spent-on.validation.required" })).max(new Date(), formatMessage({ id: "time.time-entry.field.spent-on.validation.in-future" })),
    entries: z
      .array(
        z.discriminatedUnion("_included", [
          z.object({
            _timer_id: z.string(),
            _included: z.literal(false),
            issue_id: z.int(),
            hours: z.number().nullable(),
            activity_id: z.int().nullable(),
            comments: z.string().nullable(),
          }),
          z.object({
            _timer_id: z.string(),
            _included: z.literal(true),
            issue_id: z.int(),
            hours: z
              .number(formatMessage({ id: "time.time-entry.field.hours.validation.required" }))
              .min(0.01, formatMessage({ id: "time.time-entry.field.hours.validation.greater-than-zero" }))
              .max(24, formatMessage({ id: "time.time-entry.field.hours.validation.less-than-24" })),
            activity_id: z.int(formatMessage({ id: "time.time-entry.field.activity.validation.required" })),
            comments: z.string().nullable(),
          }),
        ])
      )
      .refine((entries) => entries.some((entry) => entry._included), formatMessage({ id: "timers.modal.submit-timers.validation.at-least-one-required" })),
  });

type TSubmitTimersForm = z.infer<ReturnType<typeof submitTimersFormSchema>>;

const SubmitTimersModal = ({ timers, issues, onClose }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const redmineApi = useRedmineApi();
  const timerApi = useTimerApi();
  const queryClient = useQueryClient();

  const { hasProjectPermission } = usePermissions();

  const [groups] = useState(() => {
    let entryIndex = 0;
    return groupTimers(timers, issues).map<SubmitTimerGroup>((group) => ({
      key: group.key,
      type: group.type,
      project: group.project,
      ...group.items.reduce(
        (acc, { timer, issue }) => {
          if (!issue) {
            acc.invalid.push({ timer, reason: "unknown-issue" });
            return acc;
          }

          if (!hasProjectPermission(issue.project.id, "log_time")) {
            acc.invalid.push({ timer, issue, reason: "no-permission" });
            return acc;
          }

          const totalElapsedTime = calculateTimerTotalElapsedTime(timer);
          const time = settings.features.roundToInterval ? roundMillisecondsToInterval(totalElapsedTime, settings.features.roundingInterval, settings.features.roundingMode) : totalElapsedTime;
          const hours = Number((time / 1000 / 60 / 60).toFixed(2));
          acc.items.push({ timer, issue, hours, index: entryIndex++ });
          return acc;
        },
        { items: [] as TimerItem[], invalid: [] as InvalidTimerItem[] }
      ),
    }));
  });

  const projectIds = Array.from(new Set(groups.map(({ project }) => project?.id).filter(omitUndefinedFilter)));
  const { projectTimeEntryActivitiesMap } = useRedmineMultipleProjectTimeEntryActivities(projectIds);

  const createTimeEntryMutation = useMutation({
    mutationFn: (entry: TCreateTimeEntry) => redmineApi.createTimeEntry(entry),
  });
  const [submitResults, setSubmitResults] = useState<Record<string, { submitted?: boolean; error?: string }>>({});

  const form = useAppForm({
    defaultValues: {
      spent_on: new Date(),
      entries: groups
        .flatMap((group) => group.items)
        .map(
          ({ timer, issue, hours }) =>
            ({
              _timer_id: timer.id,
              _included: (hours > 0) as true,
              issue_id: issue.id,
              hours,
              activity_id: projectTimeEntryActivitiesMap[issue.project.id]?.defaultActivity?.id,
              comments: timer.name ?? null,
            }) satisfies Partial<Exclude<TSubmitTimersForm["entries"][number], { _included: false }>> as TSubmitTimersForm["entries"][number]
        ),
    } satisfies TSubmitTimersForm as TSubmitTimersForm,
    validators: {
      onChange: submitTimersFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value }) => {
      let hasError = false;
      let submittedCount = 0;

      for (const [index, entry] of value.entries.entries()) {
        if (!entry._included) continue;

        try {
          const { _timer_id, _included, ...entryData } = entry;
          await createTimeEntryMutation.mutateAsync({
            spent_on: value.spent_on,
            ...entryData,
          });
        } catch (error) {
          hasError = true;
          setSubmitResults((prev) => ({ ...prev, [entry._timer_id]: { error: getErrorMessage(error) } }));
          continue;
        }

        submittedCount++;
        setSubmitResults((prev) => ({ ...prev, [entry._timer_id]: { submitted: true } }));
        form.setFieldValue(`entries[${index}]._included`, false);
        await timerApi.deleteTimer({ id: entry._timer_id });
      }

      if (submittedCount > 0) {
        queryClient.invalidateQueries(redmineTimeEntriesQueries);
      }

      if (!hasError) {
        toast.success(formatMessage({ id: "timers.modal.submit-timers.success" }, { count: submittedCount }));
        onClose();
      }
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formatMessage({ id: "timers.modal.submit-timers.title" })}</DialogTitle>
          <DialogDescription>{formatMessage({ id: "timers.modal.submit-timers.description" })}</DialogDescription>
        </DialogHeader>
        <Form onSubmit={form.handleSubmit}>
          <FormGrid cols={2}>
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
          </FormGrid>

          <div className="flex min-w-0 flex-col gap-y-4">
            {groups.map((projectGroup) => (
              <div key={projectGroup.key} className="flex flex-col gap-y-2">
                <TimerProject type={projectGroup.type} project={projectGroup.project} forceNoSticky />
                {projectGroup.items.map((item) => {
                  const { timer, issue, index } = item;
                  const submitResult = submitResults[timer.id];

                  if (submitResult?.submitted) return null;

                  return (
                    <FormFieldset key={timer.id}>
                      <div className="flex items-center gap-2">
                        <form.Field
                          name={`entries[${index}]._included`}
                          children={(field) => <Checkbox checked={field.state.value} onCheckedChange={(checked) => field.handleChange(!!checked)} onBlur={field.handleBlur} />}
                        />
                        <IssueTitle issue={issue} />
                      </div>
                      <form.Subscribe
                        selector={(state) => state.values.entries[index]?._included}
                        children={(included) => (
                          <FormGrid cols={2} className={clsx("mt-2", !included && "opacity-50")}>
                            <form.AppField
                              name={`entries[${index}].hours`}
                              children={(field) => (
                                <field.HoursField
                                  title={formatMessage({ id: "time.time-entry.field.hours" })}
                                  placeholder={formatMessage({ id: "time.time-entry.field.hours" })}
                                  required
                                  disabled={!included}
                                  {...(settings.style.timeFormat === "decimal" && {
                                    max: "24",
                                  })}
                                  className="col-span-1"
                                />
                              )}
                            />
                            <form.AppField
                              name={`entries[${index}].activity_id`}
                              children={() => <ActivityField projectId={issue.project.id} required disabled={!included} className="col-span-1" />}
                            />
                            <form.AppField
                              name={`entries[${index}].comments`}
                              children={(field) => (
                                <field.TextField
                                  title={formatMessage({ id: "time.time-entry.field.comments" })}
                                  placeholder={formatMessage({ id: "time.time-entry.field.comments" })}
                                  disabled={!included}
                                />
                              )}
                            />
                          </FormGrid>
                        )}
                      />
                      {submitResult?.error && <p className="mt-2 text-sm text-destructive">{submitResult.error}</p>}
                    </FormFieldset>
                  );
                })}
                {projectGroup.invalid.map((item) => (
                  <FormFieldset key={item.timer.id} className="min-w-0 overflow-hidden opacity-50">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={false} disabled />
                      {item.issue ? <IssueTitle issue={item.issue} className="min-w-0 grow" /> : <h1 className="min-w-0 grow truncate text-gray-500 line-through">#{item.timer.issueId}</h1>}
                      <span className="shrink-0 text-xs text-muted-foreground">
                        <FormattedMessage id={`timers.modal.submit-timers.invalid.${item.reason}`} />
                      </span>
                    </div>
                  </FormFieldset>
                ))}
              </div>
            ))}
          </div>

          <DialogFooter>
            <form.Subscribe
              selector={(state) => state.values.entries.filter((entry) => entry._included).length}
              children={(count) => (
                <form.AppForm>
                  <form.SubmitButton children={formatMessage({ id: "timers.modal.submit-timers.submit" }, { count })} />
                </form.AppForm>
              )}
            />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitTimersModal;

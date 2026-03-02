/* eslint-disable react/no-children-prop */
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormGrid } from "@/components/ui/form";
import { useIssueStatuses } from "@/hooks/useIssueStatuses";
import { parseISO } from "date-fns";
import { useIntl } from "react-intl";
import { z } from "zod";
import { TIssue } from "../../../api/redmine/types";
import { useAppForm } from "../../../hooks/useAppForm";
import { useIssuePriorities } from "../../../hooks/useIssuePriorities";
import useIssueTrackers from "../../../hooks/useIssueTrackers";
import useMyUser from "../../../hooks/useMyUser";
import useProject from "../../../hooks/useProject";
import DismissibleWarning from "../../general/DismissableWarning";
import AssigneeField from "./fields/AssigneeField";
import CategoryField from "./fields/CategoryField";
import DoneRatioField from "./fields/DoneRatioField";
import PriorityField from "./fields/PriorityField";
import VersionField from "./fields/VersionField";

type PropTypes =
  | {
      action: "create";
      projectId: number;
      onSubmit: (data: TCreateOrEditIssueForm) => Promise<void>;
    }
  | {
      action: "edit";
      issue: TIssue;
      onSubmit: (data: TCreateOrEditIssueForm) => Promise<void>;
    };

const createOrEditIssueFormSchema = ({ formatMessage }: { formatMessage: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z
    .object({
      project_id: z.int(),
      tracker_id: z.int(formatMessage({ id: "issues.issue.field.tracker.validation.required" })),
      status_id: z.int(formatMessage({ id: "issues.issue.field.status.validation.required" })),
      subject: z.string().nonempty(formatMessage({ id: "issues.issue.field.subject.validation.required" })),
      description: z.string().nullable(),
      priority_id: z.int(formatMessage({ id: "issues.issue.field.priority.validation.required" })),
      assigned_to_id: z.int().nullable(),
      category_id: z.int().nullable(),
      fixed_version_id: z.int().nullable(),
      start_date: z.date().nullable(),
      due_date: z.date().nullable(),
      estimated_hours: z.number().nullable(),
      done_ratio: z.int().min(0).max(100),
    })
    .check((ctx) => {
      if (ctx.value.start_date && ctx.value.due_date && ctx.value.start_date > ctx.value.due_date) {
        ctx.issues.push({
          code: "custom",
          input: ctx.value.start_date,
          path: ["due_date"],
          message: formatMessage({ id: "issues.issue.field.due-date.validation.greater-than-start-date" }),
        });
      }
    });

type TCreateOrEditIssueForm = z.infer<ReturnType<typeof createOrEditIssueFormSchema>>;

export const IssueForm = (props: PropTypes) => {
  const { formatMessage } = useIntl();

  const projectId = props.action === "create" ? props.projectId : props.issue.project.id;

  const myUser = useMyUser();
  const project = useProject(projectId);
  const issueTrackers = useIssueTrackers(projectId);
  const issuePriorities = useIssuePriorities();
  const issueStatuses = useIssueStatuses(props.action === "edit" ? props.issue.id : 0, {
    enabled: props.action === "edit",
    issueStaleTime: 0,
  });

  const form = useAppForm({
    defaultValues:
      props.action === "create"
        ? ({
            project_id: projectId,
            tracker_id: issueTrackers.defaultTracker?.id,
            status_id: issueTrackers.defaultTracker?.default_status?.id,
            subject: "",
            description: null,
            priority_id: issuePriorities.defaultPriority?.id,
            assigned_to_id: myUser.data?.id ?? null,
            category_id: null,
            fixed_version_id: project.data?.default_version?.id ?? null,
            start_date: null,
            due_date: null,
            estimated_hours: null,
            done_ratio: 0,
          } satisfies Partial<TCreateOrEditIssueForm> as TCreateOrEditIssueForm)
        : ({
            project_id: props.issue.project.id,
            tracker_id: props.issue.tracker.id,
            status_id: props.issue.status.id,
            subject: props.issue.subject,
            description: props.issue.description ?? null,
            priority_id: props.issue.priority.id,
            assigned_to_id: props.issue.assigned_to?.id ?? null,
            category_id: props.issue.category?.id ?? null,
            fixed_version_id: props.issue.fixed_version?.id ?? null,
            start_date: props.issue.start_date ? parseISO(props.issue.start_date) : null,
            due_date: props.issue.due_date ? parseISO(props.issue.due_date) : null,
            estimated_hours: props.issue.estimated_hours ?? null,
            done_ratio: props.issue.done_ratio,
          } satisfies TCreateOrEditIssueForm as TCreateOrEditIssueForm),
    validators: {
      onChange: createOrEditIssueFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  });

  return (
    <Form onSubmit={form.handleSubmit}>
      <form.Subscribe
        selector={(state) => {
          const selectedTracker = issueTrackers.data?.find((tracker) => tracker.id === state.values.tracker_id);
          const hasTrackerNoEnabledFields = selectedTracker && selectedTracker.enabled_standard_fields === undefined;
          return {
            selectedTracker,
            hasTrackerNoEnabledFields,
          };
        }}
        children={({ selectedTracker, hasTrackerNoEnabledFields }) => (
          <>
            <FormGrid cols={2}>
              <form.AppField
                name="tracker_id"
                children={(field) => (
                  <field.ComboboxField
                    title={formatMessage({ id: "issues.issue.field.tracker" })}
                    placeholder={formatMessage({ id: "issues.issue.field.tracker" })}
                    required
                    items={
                      issueTrackers.data?.map((tracker) => ({
                        label: tracker.name,
                        value: tracker.id,
                      })) ?? []
                    }
                    isLoading={issueTrackers.isLoading}
                    className="col-span-1"
                  />
                )}
                listeners={{
                  onChange: ({ value }) => {
                    if (props.action === "create") {
                      const selectedTracker = issueTrackers.data?.find((tracker) => tracker.id === value);
                      form.setFieldValue("status_id", selectedTracker?.default_status?.id ?? 0);
                    }
                  },
                }}
              />

              <form.AppField
                name="status_id"
                children={(field) => (
                  <field.ComboboxField
                    title={formatMessage({ id: "issues.issue.field.status" })}
                    placeholder={formatMessage({ id: "issues.issue.field.status" })}
                    required
                    disabled={props.action === "edit" ? props.issue.allowed_statuses?.length === 0 : true}
                    items={
                      props.action === "create"
                        ? selectedTracker?.default_status
                          ? [
                              {
                                label: selectedTracker.default_status.name,
                                value: selectedTracker.default_status.id,
                              },
                            ]
                          : []
                        : (issueStatuses.data?.map((status) => ({
                            label: status.name,
                            value: status.id,
                          })) ?? [])
                    }
                    className="col-span-1"
                  />
                )}
              />

              <form.AppField
                name="subject"
                children={(field) => (
                  <field.TextField title={formatMessage({ id: "issues.issue.field.subject" })} placeholder={formatMessage({ id: "issues.issue.field.subject" })} required autoFocus />
                )}
              />

              {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("description")) && (
                <form.AppField
                  name="description"
                  children={(field) => (
                    <field.TextareaField title={formatMessage({ id: "issues.issue.field.description" })} placeholder={formatMessage({ id: "issues.issue.field.description" })} rows={1} />
                  )}
                />
              )}

              <FormGrid className="col-span-1">
                <form.AppField name="priority_id" children={() => <PriorityField required />} />

                {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("assigned_to_id")) && (
                  <form.AppField name="assigned_to_id" children={() => <AssigneeField projectId={projectId} />} />
                )}

                {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("category_id")) && (
                  <form.AppField name="category_id" children={() => <CategoryField projectId={projectId} />} />
                )}

                {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("fixed_version_id")) && (
                  <form.AppField name="fixed_version_id" children={() => <VersionField projectId={projectId} />} />
                )}
              </FormGrid>

              <FormGrid className="col-span-1">
                {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("start_date")) && (
                  <form.Subscribe
                    selector={(state) => ({
                      due_date: state.values.due_date,
                    })}
                    children={({ due_date }) => (
                      <form.AppField
                        name="start_date"
                        children={(field) => (
                          <field.DateField
                            title={formatMessage({ id: "issues.issue.field.start-date" })}
                            placeholder={formatMessage({ id: "issues.issue.field.start-date" })}
                            disabledDates={
                              due_date
                                ? {
                                    after: due_date,
                                  }
                                : undefined
                            }
                          />
                        )}
                      />
                    )}
                  />
                )}

                {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("due_date")) && (
                  <form.Subscribe
                    selector={(state) => ({
                      start_date: state.values.start_date,
                    })}
                    children={({ start_date }) => (
                      <form.AppField
                        name="due_date"
                        children={(field) => (
                          <field.DateField
                            title={formatMessage({ id: "issues.issue.field.due-date" })}
                            placeholder={formatMessage({ id: "issues.issue.field.due-date" })}
                            disabledDates={
                              start_date
                                ? {
                                    before: start_date,
                                  }
                                : undefined
                            }
                          />
                        )}
                      />
                    )}
                  />
                )}

                {(hasTrackerNoEnabledFields || selectedTracker?.enabled_standard_fields?.includes("estimated_hours")) && (
                  <form.AppField
                    name="estimated_hours"
                    children={(field) => (
                      <field.HoursField title={formatMessage({ id: "issues.issue.field.estimated-hours" })} placeholder={formatMessage({ id: "issues.issue.field.estimated-hours" })} />
                    )}
                  />
                )}

                {hasTrackerNoEnabledFields || (selectedTracker?.enabled_standard_fields?.includes("done_ratio") && <form.AppField name="done_ratio" children={() => <DoneRatioField required />} />)}
              </FormGrid>
            </FormGrid>

            {props.action === "create" && issueStatuses.hasIssueNoAllowedStatuses && (
              <DismissibleWarning name="issueNoAllowedStatuses">{formatMessage({ id: "issues.modal.edit-issue.issue-with-no-allowed-statuses.warning" })}</DismissibleWarning>
            )}

            {hasTrackerNoEnabledFields && (
              <DismissibleWarning name="trackerNoEnabledFields">{formatMessage({ id: "issues.modal.add-issue.tracker-with-no-enabled-fields.warning" })}</DismissibleWarning>
            )}

            <DismissibleWarning name="unknownWorkflowPermissions">{formatMessage({ id: "issues.modal.add-issue.unknown-workflow-permissions.warning" })}</DismissibleWarning>
          </>
        )}
      />
      <DialogFooter>
        <form.AppForm>
          <form.SubmitButton children={formatMessage({ id: props.action === "create" ? "issues.modal.add-issue.submit" : "issues.modal.edit-issue.submit" })} />
        </form.AppForm>
      </DialogFooter>
    </Form>
  );
};

import { parseISO } from "date-fns";
import { ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TIssue } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  issue: TIssue;
  children?: ReactNode;
};

const IssueInfoTooltip = ({ issue, children }: PropTypes) => {
  const { formatDate } = useIntl();
  const formatHours = useFormatHours();

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="flex max-w-[17rem] flex-col gap-y-3 truncate">
        <div>
          <p className="text-sm font-semibold">
            {issue.tracker.name} #{issue.id}
          </p>
          <p className="truncate text-xs font-normal">{issue.subject}</p>
        </div>
        <table className="-mx-1 border-separate border-spacing-x-1 truncate text-left text-sm">
          <tbody>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.issue.field.status" />:
              </th>
              <td>{issue.status.name}</td>
            </tr>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.issue.field.priority" />:
              </th>
              <td>{issue.priority.name}</td>
            </tr>
            {issue.assigned_to && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.assignee" />:
                </th>
                <td>{issue.assigned_to.name}</td>
              </tr>
            )}
            {issue.category && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.category" />:
                </th>
                <td>{issue.category.name}</td>
              </tr>
            )}
            {issue.fixed_version && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.version" />:
                </th>
                <td>{issue.fixed_version.name}</td>
              </tr>
            )}
            {issue.start_date && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.start-date" />:
                </th>
                <td>{formatDate(parseISO(issue.start_date))}</td>
              </tr>
            )}
            {issue.due_date && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.due-date" />:
                </th>
                <td>{formatDate(parseISO(issue.due_date))}</td>
              </tr>
            )}
            {issue.estimated_hours != null && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.estimated-hours" />:
                </th>
                <td>{formatHours(issue.estimated_hours)}</td>
              </tr>
            )}
            {issue.spent_hours != null && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.spent-time" />:
                </th>
                <td>{formatHours(issue.spent_hours)}</td>
              </tr>
            )}
            {issue.custom_fields?.map((field) => {
              if (!field.value) return null;
              if (Array.isArray(field.value) && field.value.length === 0) return null;

              const value = Array.isArray(field.value) ? field.value.join(", ") : String(field.value);
              return (
                <tr key={field.id}>
                  <th className="text-xs font-medium">{field.name}:</th>
                  <td>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="italic">
          <FormattedMessage id="issues.issue-tooltip.open-in-redmine" />
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default IssueInfoTooltip;

import { parseISO } from "date-fns";
import { FormattedMessage, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import useFormatHours from "../../hooks/useFormatHours";
import { TIssue } from "../../types/redmine";

type PropTypes = {
  issue: TIssue;
};

const IssueInfoTooltip = ({ issue }: PropTypes) => {
  const { formatDate } = useIntl();
  const formatHours = useFormatHours();

  return (
    <Tooltip id={`tooltip-issue-${issue.id}`} place="right" className="z-10 opacity-100">
      <div className="relative max-w-[230px]">
        <p className="mb-3 text-sm font-semibold">
          {issue.tracker.name} #{issue.id}
          <p className="mt-1 max-w-[180px] truncate text-xs font-normal">{issue.subject}</p>
        </p>
        <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm text-gray-300">
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
            {issue.estimated_hours && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.issue.field.estimated-time" />:
                </th>
                <td>{formatHours(issue.estimated_hours)}</td>
              </tr>
            )}
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.issue.field.spent-time" />:
              </th>
              <td>{formatHours(issue.spent_hours)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-5 italic">
        <FormattedMessage id="issues.issue-tooltip.open-in-redmine" />
      </p>
    </Tooltip>
  );
};

export default IssueInfoTooltip;

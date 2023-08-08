import { FormattedMessage } from "react-intl";
import { Tooltip } from "react-tooltip";
import { TIssue } from "../../types/redmine";
import { formatHours } from "../../utils/date";

type PropTypes = {
  issue: TIssue;
};

const IssueInfoTooltip = ({ issue }: PropTypes) => {
  return (
    <Tooltip id={`tooltip-issue-${issue.id}`} place="right" className="z-10 opacity-100">
      <div className="relative max-w-[210px]">
        <table className="text-left text-sm text-gray-300">
          <caption className="mb-3 text-left font-semibold">
            {issue.tracker.name} #{issue.id}
            <p className="mt-1 max-w-[180px] truncate text-xs font-normal">{issue.subject}</p>
          </caption>
          <tbody>
            <tr>
              <th className="whitespace-nowrap pr-2 font-medium">
                <FormattedMessage id="issues.info-tooltip.status" />:
              </th>
              <td>{issue.status.name}</td>
            </tr>
            <tr>
              <th className="whitespace-nowrap pr-2 font-medium">
                <FormattedMessage id="issues.info-tooltip.priority" />:
              </th>
              <td>{issue.priority.name}</td>
            </tr>
            {issue.assigned_to && (
              <tr>
                <th className="whitespace-nowrap pr-2 font-medium">
                  <FormattedMessage id="issues.info-tooltip.assignee" />:
                </th>
                <td>{issue.assigned_to.name}</td>
              </tr>
            )}
            {issue.estimated_hours && (
              <tr>
                <th className="whitespace-nowrap pr-2 font-medium">
                  <FormattedMessage id="issues.info-tooltip.estimated-time" />:
                </th>
                <td>{formatHours(issue.estimated_hours)} h</td>
              </tr>
            )}
            <tr>
              <th className="whitespace-nowrap pr-2 font-medium">
                <FormattedMessage id="issues.info-tooltip.spent-time" />:
              </th>
              <td>{formatHours(issue.spent_hours)} h</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-5 italic">
        <FormattedMessage id="issues.info-tooltip.open-in-redmine" />
      </p>
    </Tooltip>
  );
};

export default IssueInfoTooltip;

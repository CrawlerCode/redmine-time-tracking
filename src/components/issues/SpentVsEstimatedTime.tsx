import clsx from "clsx";
import { useIntl } from "react-intl";
import { TIssue } from "../../types/redmine";
import { roundHours } from "../../utils/date";

interface PropTypes extends React.ComponentProps<"span"> {
  issue: TIssue;
  previewHours: number;
}
const SpentVsEstimatedTime = ({ issue, previewHours, className, ...props }: PropTypes) => {
  const { formatMessage, formatNumber } = useIntl();
  return (
    <>
      {issue.estimated_hours && (
        <span className={clsx("flex items-center gap-x-1 truncate", className)} {...props}>
          <span
            className={clsx("mb-0.5 truncate font-bold", {
              "text-orange-500 dark:text-orange-400": issue.spent_hours + previewHours > issue.estimated_hours,
            })}
          >
            {formatMessage(
              { id: "format.hours" },
              {
                hours: formatNumber(roundHours(issue.spent_hours + previewHours)),
              }
            )}
          </span>
          <span className="text-lg font-light">/</span>
          <span className="mt-0.5 font-semibold">
            {formatMessage(
              { id: "format.hours" },
              {
                hours: formatNumber(roundHours(issue.estimated_hours)),
              }
            )}
          </span>
        </span>
      )}
    </>
  );
};

export default SpentVsEstimatedTime;

import clsx from "clsx";
import useFormatHours from "../../hooks/useFormatHours";
import { TIssue } from "../../types/redmine";
import { roundHours } from "../../utils/date";

interface PropTypes extends React.ComponentProps<"span"> {
  issue: TIssue;
  previewHours: number;
}
const SpentVsEstimatedTime = ({ issue, previewHours, className, ...props }: PropTypes) => {
  const formatHours = useFormatHours();

  return (
    <>
      {issue.estimated_hours && (
        <span className={clsx("flex items-center gap-x-1 truncate", className)} {...props}>
          <span
            className={clsx("mb-0.5 truncate font-bold", {
              "text-orange-500 dark:text-orange-400": issue.spent_hours + previewHours > issue.estimated_hours,
            })}
          >
            {formatHours(roundHours(issue.spent_hours + previewHours))}
          </span>
          <span className="text-lg font-light">/</span>
          <span className="mt-0.5 font-semibold">{formatHours(roundHours(issue.estimated_hours))}</span>
        </span>
      )}
    </>
  );
};

export default SpentVsEstimatedTime;

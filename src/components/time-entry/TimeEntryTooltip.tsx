import { FormattedMessage } from "react-intl";
import { Tooltip } from "react-tooltip";
import useFormatHours from "../../hooks/useFormatHours";
import { TTimeEntry } from "../../types/redmine";

type PropTypes = {
  entry: TTimeEntry;
};

const TimeEntryTooltip = ({ entry }: PropTypes) => {
  const formatHours = useFormatHours();

  return (
    <Tooltip id={`tooltip-time-entry-${entry.id}`} place="bottom" className="z-10 opacity-100">
      <div className="relative max-w-[230px] truncate">
        <p className="mb-3 text-sm font-semibold">
          {formatHours(entry.hours)}
          {entry.comments && <p className="mt-1 truncate text-xs font-normal">{entry.comments}</p>}
        </p>
        <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm text-gray-300">
          <tbody>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="time.time-entry.field.project" />:
              </th>
              <td>{entry.project.name}</td>
            </tr>
            {entry.issue && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="time.time-entry.field.issue" />:
                </th>
                <td>#{entry.issue.id}</td>
              </tr>
            )}
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="time.time-entry.field.activity" />:
              </th>
              <td>{entry.activity.name}</td>
            </tr>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="time.time-entry.field.hours" />:
              </th>
              <td>{formatHours(entry.hours)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Tooltip>
  );
};

export default TimeEntryTooltip;

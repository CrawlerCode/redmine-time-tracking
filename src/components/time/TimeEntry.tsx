import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Tooltip } from "react-tooltip";
import useFormatHours from "../../hooks/useFormatHours";
import { TTimeEntry } from "../../types/redmine";

type PropTypes = {
  entries: TTimeEntry[];
  previewHours?: number;
  maxHours?: number;
};

const TimeEntry = ({ entries, previewHours, maxHours = 24 }: PropTypes) => {
  const formatHours = useFormatHours();

  const sumHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div role="row" className="flex items-center gap-x-0.5">
      {entries.map((entry) => (
        <Fragment key={entry.id}>
          <Tooltip id={`tooltip-time-entry-${entry.id}`} place="bottom" className="z-10 opacity-100">
            <div className="relative max-w-[230px]">
              <p className="mb-3 text-sm font-semibold">
                {formatHours(entry.hours)}
                {entry.comments && <p className="mt-1 max-w-[180px] truncate text-xs font-normal">{entry.comments}</p>}
              </p>
              <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm text-gray-300">
                <tbody>
                  <tr>
                    <th className="text-xs font-medium">
                      <FormattedMessage id="time.entry-tooltip.project" />:
                    </th>
                    <td>{entry.project.name}</td>
                  </tr>
                  {entry.issue && (
                    <tr>
                      <th className="text-xs font-medium">
                        <FormattedMessage id="time.entry-tooltip.issue" />:
                      </th>
                      <td>#{entry.issue.id}</td>
                    </tr>
                  )}
                  <tr>
                    <th className="text-xs font-medium">
                      <FormattedMessage id="time.entry-tooltip.activity" />:
                    </th>
                    <td>{entry.activity.name}</td>
                  </tr>
                  <tr>
                    <th className="text-xs font-medium">
                      <FormattedMessage id="time.entry-tooltip.hours" />:
                    </th>
                    <td>{formatHours(entry.hours)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tooltip>
          <div
            role="cell"
            data-type="time-entry"
            className="h-4 rounded bg-primary"
            style={{
              width: `${(entry.hours / maxHours) * 100}%`,
            }}
            data-tooltip-id={`tooltip-time-entry-${entry.id}`}
          />
        </Fragment>
      ))}
      {(previewHours && (
        <>
          <Tooltip id={`tooltip-time-entry-preview`} place="bottom" className="z-10 opacity-100">
            <p className="text-sm font-semibold">{formatHours(previewHours)}</p>
          </Tooltip>
          <div
            className="h-4 rounded bg-primary opacity-50"
            style={{
              width: `${(previewHours / maxHours) * 100}%`,
              backgroundSize: "1rem 1rem",
              backgroundImage: "linear-gradient(45deg,rgba(255,255,255,.1) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.1) 75%,transparent 75%,transparent)",
            }}
            data-tooltip-id={`tooltip-time-entry-preview`}
          />
        </>
      )) ||
        undefined}
      <div
        className="h-3 rounded bg-gray-400/40 dark:bg-gray-700/40"
        style={{
          width: `${((maxHours - sumHours - (previewHours ?? 0)) / maxHours) * 100}%`,
          backgroundSize: "1rem 1rem",
          backgroundImage: "linear-gradient(45deg,rgba(255,255,255,.05) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.05) 50%,rgba(255,255,255,.05) 75%,transparent 75%,transparent)",
        }}
      />
    </div>
  );
};

export default TimeEntry;

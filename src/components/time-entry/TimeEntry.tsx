import { Fragment } from "react";
import { Tooltip } from "react-tooltip";
import useFormatHours from "../../hooks/useFormatHours";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import { TTimeEntry } from "../../types/redmine";
import TimeEntryContextMenu from "./TimeEntryContextMenu";
import TimeEntryTooltip from "./TimeEntryTooltip";

type PropTypes = {
  entries: TTimeEntry[];
  previewHours?: number;
  maxHours?: number;
  withContextMenu?: boolean;
};

const TimeEntry = ({ entries, previewHours, maxHours = 24, withContextMenu = false }: PropTypes) => {
  const formatHours = useFormatHours();

  const sumHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const projectRoles = useMyProjectRoles([...new Set(entries.map((e) => e.project.id))]);

  return (
    <div role="row" className="flex items-center gap-x-0.5">
      {entries.map((entry) => (
        <Fragment key={entry.id}>
          <TimeEntryTooltip entry={entry} />
          {withContextMenu ? (
            <TimeEntryContextMenu
              entry={entry}
              projectRoles={projectRoles}
              role="cell"
              data-type="time-entry"
              className="h-4 rounded bg-primary"
              style={{
                width: `${(entry.hours / maxHours) * 100}%`,
              }}
              data-tooltip-id={`tooltip-time-entry-${entry.id}`}
            />
          ) : (
            <div
              role="cell"
              data-type="time-entry"
              className="h-4 rounded bg-primary"
              style={{
                width: `${(entry.hours / maxHours) * 100}%`,
              }}
              data-tooltip-id={`tooltip-time-entry-${entry.id}`}
            />
          )}
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

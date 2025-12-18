import { Fragment } from "react";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
          <TimeEntryTooltip entry={entry}>
            {withContextMenu ? (
              <TimeEntryContextMenu
                entry={entry}
                canEdit={projectRoles.hasProjectPermission(entry.project.id, "edit_own_time_entries")}
                role="cell"
                data-type="time-entry"
                className="bg-primary h-4 rounded-sm"
                style={{
                  width: `${(entry.hours / maxHours) * 100}%`,
                }}
              />
            ) : (
              <div
                role="cell"
                data-type="time-entry"
                className="bg-primary h-4 rounded-sm"
                style={{
                  width: `${(entry.hours / maxHours) * 100}%`,
                }}
              />
            )}
          </TimeEntryTooltip>
        </Fragment>
      ))}
      {(previewHours && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="bg-primary h-4 rounded-sm opacity-50"
              style={{
                width: `${(previewHours / maxHours) * 100}%`,
                backgroundSize: "1rem 1rem",
                backgroundImage: "linear-gradient(45deg,rgba(255,255,255,.1) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.1) 75%,transparent 75%,transparent)",
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-semibold">{formatHours(previewHours)}</p>
          </TooltipContent>
        </Tooltip>
      )) ||
        undefined}
      <div
        className="h-3 rounded-sm bg-gray-400/40 dark:bg-gray-700/40"
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

import { TimeEntryContextMenu } from "@/components/time-entry/TimeEntryContextMenu";
import { Fragment } from "react";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import TimeEntryTooltip from "./TimeEntryTooltip";

type PropTypes = {
  entries: TTimeEntry[];
  previewHours?: number;
  maxDayHours?: number;
  withContextMenu?: boolean;
};

const TimeEntry = ({ entries, previewHours, maxDayHours = 24, withContextMenu = false }: PropTypes) => {
  const formatHours = useFormatHours();

  const sumHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div role="row" className="flex items-center gap-x-0.5">
      {entries.map((entry) => {
        const entryElement = (
          <TimeEntryTooltip entry={entry}>
            <div
              role="cell"
              data-type="time-entry"
              className="bg-primary h-4 rounded-sm"
              style={{
                width: `${(entry.hours / maxDayHours) * 100}%`,
              }}
            />
          </TimeEntryTooltip>
        );
        return (
          <Fragment key={entry.id}>
            {withContextMenu ? (
              <TimeEntryContextMenu entry={entry}>
                <div className="contents">{entryElement}</div>
              </TimeEntryContextMenu>
            ) : (
              entryElement
            )}
          </Fragment>
        );
      })}
      {!!previewHours && (
        <Tooltip>
          <TooltipTrigger
            delay={300}
            render={
              <div
                className="bg-primary/60 h-3.5 rounded-sm"
                style={{
                  width: `${(previewHours / maxDayHours) * 100}%`,
                }}
              />
            }
          />
          <TooltipContent>
            <p className="text-sm font-semibold">{formatHours(previewHours)}</p>
          </TooltipContent>
        </Tooltip>
      )}
      <div
        className="bg-muted h-3 rounded-sm"
        style={{
          width: `${((maxDayHours - sumHours - (previewHours ?? 0)) / maxDayHours) * 100}%`,
        }}
      />
    </div>
  );
};

export default TimeEntry;

import { TimeEntryContextMenu } from "@/components/time-entry/TimeEntryContextMenu";
import { clsx } from "clsx";
import { Fragment } from "react";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import TimeEntryTooltip from "./TimeEntryTooltip";

type PropTypes = {
  entries: TTimeEntry[];
  preview?: {
    hours: number;
    name?: string;
  }[];
  size?: "sm" | "md" | "lg";
  withContextMenu?: boolean;
};

const TimeEntry = ({ entries, preview, size = "sm", withContextMenu = false }: PropTypes) => {
  const formatHours = useFormatHours();

  const sumHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const sumPreviewHours = preview?.reduce((sum, p) => sum + p.hours, 0);
  const maxHours = Math.max(8, sumHours + (sumPreviewHours ?? 0));

  return (
    <div
      role="row"
      className={clsx("flex items-center", {
        "gap-x-0.5": size === "sm",
        "gap-x-1": size === "md" || size === "lg",
      })}
    >
      {entries.map((entry) => {
        const entryElement = (
          <TimeEntryTooltip entry={entry}>
            <div
              role="cell"
              data-type="time-entry"
              className={clsx("min-w-1 bg-primary", {
                "h-4 rounded-sm": size === "sm",
                "h-6 rounded-md": size === "md",
                "h-8 rounded-lg": size === "lg",
              })}
              style={{
                width: `${(entry.hours / maxHours) * 100}%`,
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
      {preview?.map((p, index) => (
        <Tooltip key={index}>
          <TooltipTrigger
            delay={300}
            render={
              <div
                className={clsx("min-w-1 bg-primary/60", {
                  "h-3.5 rounded-sm": size === "sm",
                  "h-5.5 rounded-md": size === "md",
                  "h-7 rounded-lg": size === "lg",
                })}
                style={{
                  width: `${(p.hours / maxHours) * 100}%`,
                }}
              />
            }
          />
          <TooltipContent className="flex max-w-[17rem] flex-col items-start gap-y-3 truncate">
            <p className="text-sm font-semibold">{formatHours(p.hours)}</p>
            {p.name && <p className="truncate text-xs font-normal">{p.name}</p>}
          </TooltipContent>
        </Tooltip>
      ))}
      <div
        className={clsx("bg-muted", {
          "h-3 rounded-sm": size === "sm",
          "h-5 rounded-md": size === "md",
          "h-7 rounded-lg": size === "lg",
        })}
        style={{
          width: `${((maxHours - sumHours - (sumPreviewHours ?? 0)) / maxHours) * 100}%`,
        }}
      />
    </div>
  );
};

export default TimeEntry;

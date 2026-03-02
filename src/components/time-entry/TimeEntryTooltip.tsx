import { ReactElement } from "react";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  entry: TTimeEntry;
  children: ReactElement;
};

const TimeEntryTooltip = ({ entry, children }: PropTypes) => {
  const { formatMessage } = useIntl();
  const formatHours = useFormatHours();

  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent className="flex max-w-[17rem] flex-col gap-y-3 truncate">
        <p className="text-sm font-semibold">{formatHours(entry.hours)}</p>
        {entry.comments && <p className="truncate text-xs font-normal">{entry.comments}</p>}
        <table className="-mx-1 border-separate border-spacing-x-1 truncate text-left text-sm">
          <tbody>
            <tr>
              <th className="text-xs font-medium">{formatMessage({ id: "time.time-entry.field.project" })}:</th>
              <td>{entry.project.name}</td>
            </tr>
            {entry.issue && (
              <tr>
                <th className="text-xs font-medium">{formatMessage({ id: "time.time-entry.field.issue" })}:</th>
                <td>#{entry.issue.id}</td>
              </tr>
            )}
            <tr>
              <th className="text-xs font-medium">{formatMessage({ id: "time.time-entry.field.activity" })}:</th>
              <td>{entry.activity.name}</td>
            </tr>
            <tr>
              <th className="text-xs font-medium">{formatMessage({ id: "time.time-entry.field.hours" })}:</th>
              <td>{formatHours(entry.hours)}</td>
            </tr>
            {entry.custom_fields?.map((field) => {
              if (!field.value) return null;
              if (Array.isArray(field.value) && field.value.length === 0) return null;

              const value = Array.isArray(field.value) ? field.value.join(", ") : String(field.value);
              return (
                <tr key={field.id}>
                  <th className="text-xs font-medium">{field.name}:</th>
                  <td>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TooltipContent>
    </Tooltip>
  );
};

export default TimeEntryTooltip;

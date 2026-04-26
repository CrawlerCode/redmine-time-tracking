import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { ReactElement } from "react";
import { useIntl } from "react-intl";
import { TVersion } from "../../api/redmine/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  version: TVersion;
};

export const VersionTooltip = ({ children, ...props }: PropTypes & { children: ReactElement }) => {
  return (
    <Tooltip>
      <TooltipTrigger delay={300} render={children} />
      <TooltipContent className="flex max-w-[17rem] flex-col items-start gap-y-3 truncate">
        <VersionTooltipContent {...props} />
      </TooltipContent>
    </Tooltip>
  );
};

export const VersionTooltipContent = ({ version }: PropTypes) => {
  const { formatMessage, formatDate, formatRelativeTime } = useIntl();

  return (
    <>
      <div>
        <p className="truncate text-sm font-semibold">
          {version.name} {version.due_date && <>({formatRelativeTime(differenceInDays(parseISO(version.due_date), startOfDay(new Date())), "days")})</>}
        </p>
        {version.description && <p className="truncate text-xs font-normal">{version.description}</p>}
      </div>
      <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm">
        <tbody>
          <tr>
            <th className="text-xs font-medium">{formatMessage({ id: "issues.version.field.status" })}:</th>
            <td>{version.status}</td>
          </tr>
          {version.due_date && (
            <tr>
              <th className="text-xs font-medium">{formatMessage({ id: "issues.version.field.due-date" })}:</th>
              <td>{formatDate(parseISO(version.due_date))}</td>
            </tr>
          )}
          {version.custom_fields?.map((field) => {
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
      <p className="italic">{formatMessage({ id: "issues.version-tooltip.open-in-redmine" })}</p>
    </>
  );
};

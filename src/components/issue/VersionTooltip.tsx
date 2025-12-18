import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TVersion } from "../../api/redmine/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PropTypes = {
  version: TVersion;
  children?: ReactNode;
};

const VersionTooltip = ({ version, children }: PropTypes) => {
  const { formatDate, formatRelativeTime } = useIntl();

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="flex max-w-[17rem] flex-col gap-y-3 truncate">
        <div>
          <p className="truncate text-sm font-semibold">
            {version.name} {version.due_date && <>({formatRelativeTime(differenceInDays(parseISO(version.due_date), startOfDay(new Date())), "days")})</>}
          </p>
          {version.description && <p className="truncate text-xs font-normal">{version.description}</p>}
        </div>
        <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm">
          <tbody>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.version.field.status" />:
              </th>
              <td>{version.status}</td>
            </tr>
            {version.due_date && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.version.field.due-date" />:
                </th>
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
        <p className="italic">
          <FormattedMessage id="issues.version-tooltip.open-in-redmine" />
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default VersionTooltip;

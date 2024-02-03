import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { FormattedMessage, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import { TVersion } from "../../types/redmine";

type PropTypes = {
  version: TVersion;
};

const VersionTooltip = ({ version }: PropTypes) => {
  const { formatDate, formatRelativeTime } = useIntl();

  return (
    <Tooltip id={`tooltip-version-${version.id}`} place="right" className="z-10 opacity-100">
      <div className="relative max-w-[230px]">
        <p className="mb-3 text-sm font-semibold">
          {version.name} {version.due_date && <>({formatRelativeTime(differenceInDays(parseISO(version.due_date), startOfDay(new Date())), "days")})</>}
          {version.description && <p className="mt-1 max-w-[180px] truncate text-xs font-normal">{version.description}</p>}
        </p>
        <table className="-mx-1 border-separate border-spacing-x-1 text-left text-sm text-gray-300">
          <tbody>
            <tr>
              <th className="text-xs font-medium">
                <FormattedMessage id="issues.version-tooltip.status" />:
              </th>
              <td>{version.status}</td>
            </tr>
            {version.due_date && (
              <tr>
                <th className="text-xs font-medium">
                  <FormattedMessage id="issues.version-tooltip.due-date" />:
                </th>
                <td>{formatDate(parseISO(version.due_date))}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-5 italic">
        <FormattedMessage id="issues.version-tooltip.open-in-redmine" />
      </p>
    </Tooltip>
  );
};

export default VersionTooltip;

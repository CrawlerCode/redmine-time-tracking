import { FormattedMessage } from "react-intl";
import useMyTimeEntries from "../../hooks/useMyTimeEntries";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  date: Date;
  previewHours: number;
};

const TimeEntryPreview = ({ date, previewHours }: PropTypes) => {
  const myTimeEntriesQuery = useMyTimeEntries(date, date);

  const sumHours = myTimeEntriesQuery.data.reduce((sum, entry) => sum + entry.hours, 0) + previewHours;

  return (
    <div className="flex items-center gap-x-1">
      <h3 className="text-sm font-semibold">
        <FormattedMessage
          id="format.hours"
          values={{
            hours: sumHours.toFixed(2),
          }}
        />
      </h3>
      <div className="grow">
        <TimeEntry entries={myTimeEntriesQuery.data} previewHours={previewHours} maxHours={sumHours > 12 ? sumHours : 12} />
      </div>
    </div>
  );
};

export default TimeEntryPreview;

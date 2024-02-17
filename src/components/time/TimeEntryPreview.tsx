import useFormatHours from "../../hooks/useFormatHours";
import useMyTimeEntries from "../../hooks/useMyTimeEntries";
import { roundHours } from "../../utils/date";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  date: Date;
  previewHours: number;
};

const TimeEntryPreview = ({ date, previewHours }: PropTypes) => {
  const formatHours = useFormatHours();

  const myTimeEntriesQuery = useMyTimeEntries(date, date);

  const sumHours = myTimeEntriesQuery.data.reduce((sum, entry) => sum + entry.hours, 0) + previewHours;

  return (
    <div className="flex items-center gap-x-1">
      <h3 className="max-w-[5rem] truncate text-sm font-semibold">{formatHours(roundHours(sumHours))}</h3>
      <div className="grow">
        <TimeEntry entries={myTimeEntriesQuery.data} previewHours={previewHours} maxHours={sumHours > 12 ? sumHours : 12} />
      </div>
    </div>
  );
};

export default TimeEntryPreview;

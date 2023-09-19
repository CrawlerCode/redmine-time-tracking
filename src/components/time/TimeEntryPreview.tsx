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
    <div className="grid grid-cols-6 items-center gap-x-1">
      <h3 className="col-span-1 truncate text-sm font-semibold">{sumHours.toFixed(2)} h</h3>
      <div className="col-span-5">
        <TimeEntry entries={myTimeEntriesQuery.data} previewHours={previewHours} maxHours={sumHours > 12 ? sumHours : 12} />
      </div>
    </div>
  );
};

export default TimeEntryPreview;

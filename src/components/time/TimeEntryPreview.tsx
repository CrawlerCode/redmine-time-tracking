import useMyTimeEntries from "../../hooks/useMyTimeEntries";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  date: Date;
  previewHours: number;
};

const TimeEntryPreview = ({ date, previewHours }: PropTypes) => {
  const myTimeEntriesQuery = useMyTimeEntries(date, date);

  const maxHours = myTimeEntriesQuery.data.reduce((sum, entry) => sum + entry.hours, 0) + previewHours;

  return <TimeEntry entries={myTimeEntriesQuery.data} previewHours={previewHours} maxHours={maxHours > 12 ? maxHours : 12} />;
};

export default TimeEntryPreview;

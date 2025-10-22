import { isMonday, previousMonday, startOfDay, subWeeks } from "date-fns";
import TimeEntryList from "../components/time-entry/TimeEntryList";
import TimeEntryListSkeleton from "../components/time-entry/TimeEntryListSkeleton";
import useMyTimeEntries from "../hooks/useMyTimeEntries";

const TimePage = () => {
  const today = startOfDay(new Date());
  const startOfLastWeek = subWeeks(isMonday(today) ? today : previousMonday(today), 1);

  const myTimeEntriesQuery = useMyTimeEntries(startOfLastWeek, today);

  return <div className="flex flex-col gap-y-2">{myTimeEntriesQuery.isLoading ? <TimeEntryListSkeleton /> : <TimeEntryList entries={myTimeEntriesQuery.data} />}</div>;
};

export default TimePage;

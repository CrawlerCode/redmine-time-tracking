import { previousMonday, startOfDay, subWeeks } from "date-fns";
import Toast from "../components/general/Toast";
import IssuesListSkeleton from "../components/issues/IssuesListSkeleton";
import TimeEntryList from "../components/time/TimeEntryList";
import useMyTimeEntries from "../hooks/useMyTimeEntries";

const TimePage = () => {
  const today = startOfDay(new Date());
  const startOfLastWeek = subWeeks(previousMonday(today), 1);

  const myTimeEntriesQuery = useMyTimeEntries(startOfLastWeek, today);

  return (
    <>
      <div className="flex flex-col gap-y-2">
        {myTimeEntriesQuery.isLoading && <IssuesListSkeleton />}

        {!myTimeEntriesQuery.isLoading && <TimeEntryList entries={myTimeEntriesQuery.data} />}

        {myTimeEntriesQuery.isError && <Toast type="error" message="Failed to load data" allowClose={false} />}
      </div>
    </>
  );
};

export default TimePage;

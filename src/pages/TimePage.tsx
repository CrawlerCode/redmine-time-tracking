import { isMonday, previousMonday, startOfDay, subWeeks } from "date-fns";
import { useIntl } from "react-intl";
import Toast from "../components/general/Toast";
import TimeEntryList from "../components/time/TimeEntryList";
import TimeEntryListSkeleton from "../components/time/TimeEntryListSkeleton";
import useMyTimeEntries from "../hooks/useMyTimeEntries";

const TimePage = () => {
  const { formatMessage } = useIntl();

  const today = startOfDay(new Date());
  const startOfLastWeek = subWeeks(isMonday(today) ? today : previousMonday(today), 1);

  const myTimeEntriesQuery = useMyTimeEntries(startOfLastWeek, today);

  return (
    <>
      <div className="flex flex-col gap-y-2">
        {myTimeEntriesQuery.isLoading && <TimeEntryListSkeleton />}

        {!myTimeEntriesQuery.isLoading && <TimeEntryList entries={myTimeEntriesQuery.data} />}

        {myTimeEntriesQuery.isError && <Toast type="error" message={formatMessage({ id: "time.error.fail-to-load-data" })} allowClose={false} />}
      </div>
    </>
  );
};

export default TimePage;

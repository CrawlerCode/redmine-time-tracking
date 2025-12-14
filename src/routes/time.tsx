import { createFileRoute } from "@tanstack/react-router";
import { isMonday, previousMonday, startOfDay, subWeeks } from "date-fns";
import TimeEntryList from "../components/time-entry/TimeEntryList";
import TimeEntryListSkeleton from "../components/time-entry/TimeEntryListSkeleton";
import { useSuspenseMyTimeEntries } from "../hooks/useMyTimeEntries";

export const Route = createFileRoute("/time")({
  component: PageComponent,
  pendingComponent: () => <TimeEntryListSkeleton />,
});

function PageComponent() {
  const today = startOfDay(new Date());
  const startOfLastWeek = subWeeks(isMonday(today) ? today : previousMonday(today), 1);

  const myTimeEntriesQuery = useSuspenseMyTimeEntries(startOfLastWeek, today);

  return <TimeEntryList entries={myTimeEntriesQuery.data} />;
}

import { useSuspenseRedmineTimeEntries } from "@/api/redmine/hooks/useRedmineTimeEntries";
import PermissionProvider from "@/provider/PermissionsProvider";
import { createFileRoute } from "@tanstack/react-router";
import { isMonday, previousMonday, startOfDay, subWeeks } from "date-fns";
import TimeEntryList from "../components/time-entry/TimeEntryList";
import TimeEntryListSkeleton from "../components/time-entry/TimeEntryListSkeleton";

export const Route = createFileRoute("/time")({
  component: PageComponent,
  pendingComponent: () => <TimeEntryListSkeleton />,
});

function PageComponent() {
  const today = startOfDay(new Date());
  const startOfLastWeek = subWeeks(isMonday(today) ? today : previousMonday(today), 1);

  const entriesQuery = useSuspenseRedmineTimeEntries({
    userId: "me",
    from: startOfLastWeek,
    to: today,
  });

  return (
    <PermissionProvider>
      <TimeEntryList entries={entriesQuery.data} />
    </PermissionProvider>
  );
}

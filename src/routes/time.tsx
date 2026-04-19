import { useSuspenseRedmineTimeEntries } from "@/api/redmine/hooks/useRedmineTimeEntries";
import { TimeEntryStatsCard, TimeEntryStatsCardSkeleton } from "@/components/time-entry/TimeEntryStatsCard";
import { TimeEntryWeekOverview, TimeEntryWeekOverviewSkeleton } from "@/components/time-entry/TimeEntryWeekOverview";
import PermissionProvider from "@/provider/PermissionsProvider";
import { createFileRoute } from "@tanstack/react-router";
import { isMonday, previousMonday, startOfDay, subWeeks } from "date-fns";

export const Route = createFileRoute("/time")({
  component: PageComponent,
  pendingComponent: () => <PageSkeleton />,
});

function PageComponent() {
  const today = startOfDay(new Date());
  const startOfThisWeek = isMonday(today) ? today : previousMonday(today);
  const startOfPreviousWeek = subWeeks(startOfThisWeek, 1);

  const entriesQuery = useSuspenseRedmineTimeEntries({
    userId: "me",
    from: startOfPreviousWeek,
    to: today,
  });

  return (
    <PermissionProvider>
      <div className="flex flex-col gap-3 sm:gap-4">
        <TimeEntryWeekOverview entries={entriesQuery.data} startOfWeek={startOfThisWeek} />
        <TimeEntryWeekOverview entries={entriesQuery.data} startOfWeek={startOfPreviousWeek} />

        <TimeEntryStatsCard />
      </div>
    </PermissionProvider>
  );
}

const PageSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <TimeEntryWeekOverviewSkeleton />
      <TimeEntryWeekOverviewSkeleton />

      <TimeEntryStatsCardSkeleton />
    </div>
  );
};

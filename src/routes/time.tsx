import { useSuspenseRedmineTimeEntries } from "@/api/redmine/hooks/useRedmineTimeEntries";
import { GroupedTimeEntries, TimeEntryWeekOverview } from "@/components/time-entry/TimeEntryWeekOverview";
import PermissionProvider from "@/provider/PermissionsProvider";
import { createFileRoute } from "@tanstack/react-router";
import { isMonday, parseISO, previousMonday, startOfDay, subWeeks } from "date-fns";
import TimeEntryListSkeleton from "../components/time-entry/TimeEntryListSkeleton";

export const Route = createFileRoute("/time")({
  component: PageComponent,
  pendingComponent: () => <TimeEntryListSkeleton />,
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

  const groupedTimeEntries = entriesQuery.data.reduce<Map<string, GroupedTimeEntries>>((map, entry) => {
    const date = entry.spent_on;
    if (!map.has(date)) {
      map.set(date, {
        date: parseISO(date),
        entries: [],
        hours: 0,
      });
    }
    map.get(date)!.entries.push(entry);
    map.get(date)!.hours += entry.hours;
    return map;
  }, new Map());

  const maxDayHours = Math.max(
    groupedTimeEntries.values().reduce((max, { hours }) => Math.max(max, hours), 0),
    8
  );

  return (
    <PermissionProvider>
      <div className="flex flex-col gap-3 sm:gap-4">
        <TimeEntryWeekOverview startOfWeek={startOfThisWeek} groupedTimeEntries={groupedTimeEntries} maxDayHours={maxDayHours} />
        <TimeEntryWeekOverview startOfWeek={startOfPreviousWeek} groupedTimeEntries={groupedTimeEntries} maxDayHours={maxDayHours} />
      </div>
    </PermissionProvider>
  );
}

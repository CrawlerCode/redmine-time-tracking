import { TimeEntryOverview, TimeEntryOverviewSkeleton } from "@/components/time-entry/TimeEntryOverview";
import { TimeEntryRangePicker, TimeEntryRangePickerSkeleton } from "@/components/time-entry/TimeEntryRangePicker";
import { TimeEntryStatsCard, TimeEntryStatsCardSkeleton } from "@/components/time-entry/TimeEntryStatsCard";
import PermissionProvider from "@/provider/PermissionsProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/time")({
  component: PageComponent,
  pendingComponent: () => <PageSkeleton />,
});

function PageComponent() {
  return (
    <PermissionProvider>
      <div className="flex flex-col gap-3 sm:gap-4">
        <TimeEntryRangePicker>
          {({ entries, from, to }) => (
            <>
              <TimeEntryOverview entries={entries} from={from} to={to} />
              <TimeEntryStatsCard entries={entries} />
            </>
          )}
        </TimeEntryRangePicker>
      </div>
    </PermissionProvider>
  );
}

const PageSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <TimeEntryRangePickerSkeleton />
      <TimeEntryOverviewSkeleton />
      <TimeEntryStatsCardSkeleton />
    </div>
  );
};

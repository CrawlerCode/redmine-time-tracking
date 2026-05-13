import { TimeByActivityChart } from "@/components/time-entry/charts/TimeByActivityChart";
import { TimeByProjectChart } from "@/components/time-entry/charts/TimeByProjectChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";

type PropTypes = {
  entries: TTimeEntry[];
};

export const TimeEntryStatsCard = ({ entries }: PropTypes) => {
  const { formatMessage } = useIntl();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatMessage({ id: "time.stats.title" })}</CardTitle>
        <CardDescription>{formatMessage({ id: "time.stats.description" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid items-center gap-2 sm:gap-4 md:grid-cols-2">
          {entries.length > 0 ? (
            <>
              <div>
                <TimeByProjectChart entries={entries} />
              </div>
              <div>
                <TimeByActivityChart entries={entries} />
              </div>
            </>
          ) : (
            <div className="flex h-120 items-center justify-center sm:h-70 md:col-span-2">
              <span className="text-muted-foreground">{formatMessage({ id: "time.stats.not-enough-data" })}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TimeEntryStatsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5.5 w-28" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid items-center gap-2 sm:gap-4 md:grid-cols-2">
          <div className="h-50" />
          <div className="h-70" />
        </div>
      </CardContent>
    </Card>
  );
};

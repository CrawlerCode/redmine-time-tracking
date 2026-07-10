import { TimeByProjectChart, TimeByProjectChartSkeleton } from "@/components/time-entry/TimeByProjectChart";
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
        <CardDescription className="max-sm:hidden">{formatMessage({ id: "time.stats.description" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <TimeByProjectChart entries={entries} />
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
        <CardDescription className="max-sm:hidden">
          <Skeleton className="h-5 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TimeByProjectChartSkeleton />
      </CardContent>
    </Card>
  );
};

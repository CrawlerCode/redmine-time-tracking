import { Skeleton } from "@/components/ui/skeleton";
import { addDays, format, formatISO, isFuture, isWeekend, parseISO } from "date-fns";
import { ClockIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { roundHours } from "../../utils/date";
import { Badge } from "../ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  startOfWeek: Date;
  entries: TTimeEntry[];
};

export type GroupedTimeEntries = {
  date: Date;
  entries: TTimeEntry[];
  hours: number;
};

export const TimeEntryWeekOverview = ({ startOfWeek, entries }: PropTypes) => {
  const { formatDate } = useIntl();
  const formatHours = useFormatHours();

  const groupedTimeEntries = entries.reduce<Map<string, GroupedTimeEntries>>((map, entry) => {
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

  const days = Array(7)
    .fill(startOfWeek)
    .map((startOfWeek: Date, i) => {
      const date = addDays(startOfWeek, i);
      return (
        groupedTimeEntries.get(formatISO(date, { representation: "date" })) ??
        ({
          date,
          entries: [],
          hours: 0,
        } satisfies GroupedTimeEntries)
      );
    });

  const summedHours = days.reduce((sum, day) => sum + day.hours, 0);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {formatDate(days[0]!.date)} – {formatDate(days[6]!.date)}
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">
            <ClockIcon />
            {formatHours(roundHours(summedHours))}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {days.toReversed().map(({ date, entries, hours }) => {
          if (isFuture(date)) return;
          if (isWeekend(date) && entries.length === 0) return;
          return (
            <div key={date.toISOString()} className="flex items-center gap-x-1 py-1">
              <span className="text-muted-foreground w-7 text-xs">{format(date, "EEE")}</span>
              <span className="w-17 truncate text-end text-xs font-semibold">{formatHours(roundHours(hours))}</span>
              <div className="grow">
                <TimeEntry entries={entries} maxDayHours={maxDayHours} withContextMenu />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export const TimeEntryWeekOverviewSkeleton = () => {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5.25 w-38" />
        </CardTitle>
        <CardAction>
          <Skeleton className="h-5 w-12" />
        </CardAction>
      </CardHeader>
      <CardContent>
        {[...Array(5).keys()].map((e) => (
          <div key={e} className="flex items-center gap-x-1 py-1">
            <Skeleton className="h-4.5 w-7" />
            <span className="w-17 justify-self-end">
              <Skeleton className="h-4.5 w-12 justify-self-end" />
            </span>
            <div className="grow">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

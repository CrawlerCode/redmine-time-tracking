import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { eachDayOfInterval, format, formatISO, isFuture, isSameWeek, isWeekend, parseISO } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { roundHours } from "../../utils/date";
import { Badge } from "../ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  from: Date;
  to: Date;
  entries: TTimeEntry[];
};

type GroupedTimeEntries = {
  date: Date;
  entries: TTimeEntry[];
  hours: number;
};

const INITIAL_VISIBLE = 7;

export const TimeEntryOverview = ({ from, to, entries }: PropTypes) => {
  const { formatMessage, formatDate } = useIntl();
  const formatHours = useFormatHours();

  const groupedByDate = entries.reduce<Map<string, GroupedTimeEntries>>((map, entry) => {
    const date = entry.spent_on;
    if (!map.has(date)) {
      map.set(date, { date: parseISO(date), entries: [], hours: 0 });
    }
    map.get(date)!.entries.push(entry);
    map.get(date)!.hours += entry.hours;
    return map;
  }, new Map());

  const days = eachDayOfInterval({ start: from, end: to }).map(
    (date: Date) => groupedByDate.get(formatISO(date, { representation: "date" })) ?? ({ date, entries: [], hours: 0 } satisfies GroupedTimeEntries)
  );

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const isMoreThanOneWeek = !isSameWeek(from, to, { weekStartsOn: 1 });

  const [expanded, setExpanded] = useState(false);
  const visibleDays = expanded ? days : days.slice(0, INITIAL_VISIBLE);
  const hiddenCount = days.length - INITIAL_VISIBLE;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{formatMessage({ id: "time.overview.title" })}</CardTitle>
        <CardDescription className="max-sm:hidden">{formatMessage({ id: "time.overview.description" })}</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <ClockIcon />
            {formatHours(roundHours(totalHours))}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {visibleDays.map(({ date, entries, hours }) => {
          const isDisabled = entries.length === 0 && (isFuture(date) || isWeekend(date));
          return (
            <div
              key={date.toISOString()}
              className={clsx("flex items-center gap-x-1 py-1", {
                "opacity-50": isDisabled,
              })}
            >
              <span
                className={clsx("w-7 truncate text-xs text-muted-foreground", {
                  "w-19": isMoreThanOneWeek,
                })}
              >
                {isMoreThanOneWeek ? `${formatDate(date, { month: "2-digit", day: "2-digit" })} (${format(date, "EEE")})` : format(date, "EEE")}
              </span>
              <span className="w-17 truncate text-end text-xs font-semibold text-muted-foreground">{isDisabled ? "–" : formatHours(roundHours(hours))}</span>
              <div className="grow">
                <TimeEntry entries={entries} withContextMenu />
              </div>
            </div>
          );
        })}
        {hiddenCount > 0 && (
          <button type="button" tabIndex={-1} className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => setExpanded((v) => !v)}>
            {expanded ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
            <span>{expanded ? formatMessage({ id: "time.overview.show-less" }) : formatMessage({ id: "time.overview.show-more" }, { count: hiddenCount })}</span>
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export const TimeEntryOverviewSkeleton = () => {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5.5 w-24" />
        </CardTitle>
        <CardDescription className="max-sm:hidden">
          <Skeleton className="h-5 w-56" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-5 w-12" />
        </CardAction>
      </CardHeader>
      <CardContent>
        {[...Array(7).keys()].map((i) => (
          <div key={i} className="flex items-center gap-x-1 py-1">
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

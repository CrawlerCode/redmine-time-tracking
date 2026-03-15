import { addDays, format, formatISO, isFuture, isWeekend } from "date-fns";
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
  groupedTimeEntries: Map<string, GroupedTimeEntries>;
  maxDayHours: number;
};

export type GroupedTimeEntries = {
  date: Date;
  entries: TTimeEntry[];
  hours: number;
};

export const TimeEntryWeekOverview = ({ startOfWeek, groupedTimeEntries, maxDayHours }: PropTypes) => {
  const { formatDate } = useIntl();
  const formatHours = useFormatHours();

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
          {formatDate(days[0].date)} – {formatDate(days[6].date)}
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">
            <ClockIcon />
            {formatHours(roundHours(summedHours))}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {days.toReversed().map(({ date, entries, hours }, i) => {
          if (isFuture(date)) return;
          if (isWeekend(date) && entries.length === 0) return;
          return (
            <div className="flex items-center gap-x-1 py-1" key={i}>
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

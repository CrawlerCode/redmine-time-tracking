import { addDays, format, isFuture, isMonday, isWeekend, parseISO, previousMonday, startOfDay, subWeeks } from "date-fns";
import { ClockIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { TTimeEntry } from "../../api/redmine/types";
import useFormatHours from "../../hooks/useFormatHours";
import { roundHours } from "../../utils/date";
import { Badge } from "../ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  entries: TTimeEntry[];
};

type GroupedEntries = {
  date: Date;
  hours: number;
  entries: TTimeEntry[];
};

const TimeEntryList = ({ entries }: PropTypes) => {
  const { formatDate } = useIntl();
  const formatHours = useFormatHours();

  const groupedEntries = Object.values(
    entries.reduce((result: Record<string, GroupedEntries>, entry) => {
      if (!(entry.spent_on in result)) {
        result[entry.spent_on] = {
          date: parseISO(entry.spent_on),
          hours: 0,
          entries: [],
        };
      }
      result[entry.spent_on].entries.push(entry);
      return result;
    }, {})
  ).map((group) => {
    group.entries.sort((a, b) => b.hours - a.hours);
    group.hours = group.entries.reduce((sum, entry) => sum + entry.hours, 0);
    return group;
  });

  const maxHours = Math.max(...groupedEntries.map(({ hours }) => hours));

  const today = startOfDay(new Date());
  const monday = isMonday(today) ? today : previousMonday(today);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {Array(2)
        .fill(monday)
        .map((d, i) => subWeeks(d, i))
        .map((monday, i) => {
          const days = Array(7)
            .fill(monday)
            .map((d, i) => addDays(d, 6 - i));
          const summedHours = groupedEntries.filter((entries) => days.find((d) => d.getTime() === entries.date.getTime())).reduce((sum, entry) => sum + entry.hours, 0);
          return (
            <Card size="sm" key={i}>
              <CardHeader>
                <CardTitle>
                  {formatDate(monday)} – {formatDate(addDays(monday, 6))}
                </CardTitle>
                <CardAction>
                  <Badge variant="secondary">
                    <ClockIcon />
                    {formatHours(roundHours(summedHours))}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                {days.map((d, i) => {
                  if (isFuture(d)) return;
                  const {
                    date,
                    hours,
                    entries: groupEntries,
                  } = groupedEntries.find((entries) => entries.date.getTime() === d.getTime()) ?? {
                    date: d,
                    hours: 0,
                    entries: [],
                  };
                  if (isWeekend(date) && hours === 0) return;
                  return (
                    <div className="flex items-center gap-x-1 py-1" key={i}>
                      <span className="text-muted-foreground w-7 text-xs">{format(date, "EEE")}</span>
                      <span className="w-17 truncate text-end text-xs font-semibold">{formatHours(roundHours(hours))}</span>
                      <div className="grow">
                        <TimeEntry entries={groupEntries} maxHours={maxHours > 0 ? maxHours : undefined} withContextMenu />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default TimeEntryList;

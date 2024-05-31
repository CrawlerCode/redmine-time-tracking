import { addDays, format, isFuture, isMonday, isWeekend, parseISO, previousMonday, startOfDay, subWeeks } from "date-fns";
import { useIntl } from "react-intl";
import useFormatHours from "../../hooks/useFormatHours";
import { TTimeEntry } from "../../types/redmine";
import { roundHours } from "../../utils/date";
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
    <>
      {Array(2)
        .fill(monday)
        .map((d, i) => subWeeks(d, i))
        .map((monday, i) => {
          const days = Array(7)
            .fill(monday)
            .map((d, i) => addDays(d, 6 - i));
          const summedHours = groupedEntries.filter((entries) => days.find((d) => d.getTime() === entries.date.getTime())).reduce((sum, entry) => sum + entry.hours, 0);
          return (
            <div role="group" className="mb-5 flex flex-col gap-y-1" key={i}>
              <div className="flex items-center gap-x-3">
                <h1 className="text-lg">
                  {formatDate(monday)} - {formatDate(addDays(monday, 6))}
                </h1>
                <span className="inline-flex items-center rounded border border-primary bg-background-inner px-2.5 py-0.5 text-xs font-medium text-primary">
                  <svg aria-hidden="true" className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                  {formatHours(roundHours(summedHours))}
                </span>
              </div>
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
                  <div className="flex items-center gap-x-1" key={i}>
                    <h4 className="w-8 text-sm">{format(date, "EEE")}</h4>
                    <h3 className="w-14 truncate text-end text-sm font-semibold">{formatHours(roundHours(hours))}</h3>
                    <div className="grow">
                      <TimeEntry entries={groupEntries} maxHours={maxHours > 0 ? maxHours : undefined} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </>
  );
};

export default TimeEntryList;

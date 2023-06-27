import { addDays, format, isFuture, isMonday, isWeekend, parseISO, previousMonday, startOfDay, subWeeks } from "date-fns";
import { TTimeEntry } from "../../types/redmine";
import TimeEntry from "./TimeEntry";

type PropTypes = {
  entries: TTimeEntry[];
};

const TimeEntryList = ({ entries }: PropTypes) => {
  const groupedEntries = Object.values(
    entries.reduce(
      (
        result: {
          [date: string]: {
            date: Date;
            hours: number;
            entries: TTimeEntry[];
          };
        },
        entry
      ) => {
        if (!(entry.spent_on in result)) {
          result[entry.spent_on] = {
            date: parseISO(entry.spent_on),
            hours: 0,
            entries: [],
          };
        }
        result[entry.spent_on].entries.push(entry);
        return result;
      },
      {}
    )
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
        .map((monday) => {
          const days = Array(7)
            .fill(monday)
            .map((d, i) => addDays(d, 6 - i));
          return (
            <div className="flex flex-col gap-y-1 mb-5">
              <div className="flex items-center gap-x-3">
                <h1 className="text-lg">
                  {monday.toLocaleDateString()} - {addDays(monday, 6).toLocaleDateString()}
                </h1>
                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-primary-400 border border-primary-400">
                  <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                  </svg>
                  {groupedEntries.filter((entries) => days.find((d) => d.getTime() === entries.date.getTime())).reduce((sum, entry) => sum + entry.hours, 0)} h
                </span>
              </div>
              {days.map((d) => {
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
                  <div className="grid grid-cols-10 items-center gap-x-1">
                    <h4 className="col-span-1 text-sm">{format(date, "EEE")}</h4>
                    <h3 className="col-span-2 text-sm text-end font-semibold truncate text-clip">{hours} h</h3>
                    <div className="col-span-7">
                      <TimeEntry entries={groupEntries} maxHours={maxHours} />
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

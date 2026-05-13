/* eslint-disable react/no-children-prop */
import { useRedmineTimeEntries } from "@/api/redmine/hooks/useRedmineTimeEntries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppForm } from "@/hooks/useAppForm";
import { Form } from "@base-ui/react";
import { useStore } from "@tanstack/react-form";
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isMonday,
  isSameMonth,
  previousMonday,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ReactNode } from "react";
import z from "zod";
import { TTimeEntry } from "../../api/redmine/types";

type ChildrenProps = {
  entries: TTimeEntry[];
  from: Date;
  to: Date;
};

type PropTypes = {
  children: (props: ChildrenProps) => ReactNode;
};

export const TimeEntryRangePicker = ({ children }: PropTypes) => {
  const today = startOfDay(new Date());
  const startOfThisWeek = isMonday(today) ? today : previousMonday(today);
  const endOfThisWeek = addDays(startOfThisWeek, 6);
  const startOfThisMonth = startOfMonth(today);
  const endOfThisMonth = subDays(addMonths(startOfThisMonth, 1), 1);

  const form = useAppForm({
    defaultValues: {
      date: {
        from: startOfThisWeek,
        to: endOfThisWeek,
      },
    },
    validators: {
      onChange: z.object({
        date: z.object({
          from: z.date(),
          to: z.date(),
        }),
      }),
    },
  });

  const date = useStore(form.store, (state) => state.values.date);

  const isFullWeek = isMonday(date.from) && differenceInDays(date.to, date.from) === 6;
  const isFullMonth = isFirstDayOfMonth(date.from) && isLastDayOfMonth(date.to) && isSameMonth(date.from, date.to);
  const canNavigate = isFullWeek || isFullMonth;

  const goToPrev = () => {
    if (isFullWeek) {
      const prevWeekStart = subWeeks(date.from, 1);
      form.setFieldValue("date", { from: prevWeekStart, to: addDays(prevWeekStart, 6) });
    } else if (isFullMonth) {
      const prevMonthStart = startOfMonth(subMonths(date.from, 1));
      form.setFieldValue("date", { from: prevMonthStart, to: subDays(addMonths(prevMonthStart, 1), 1) });
    }
  };

  const goToNext = () => {
    if (isFullWeek) {
      const nextWeekStart = addWeeks(date.from, 1);
      form.setFieldValue("date", { from: nextWeekStart, to: addDays(nextWeekStart, 6) });
    } else if (isFullMonth) {
      const nextMonthStart = startOfMonth(addMonths(date.from, 1));
      form.setFieldValue("date", { from: nextMonthStart, to: subDays(addMonths(nextMonthStart, 1), 1) });
    }
  };

  const entriesQuery = useRedmineTimeEntries({
    userId: "me",
    from: date.from,
    to: date.to,
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={goToPrev} disabled={!canNavigate}>
          <ChevronLeftIcon />
        </Button>
        <Form onSubmit={form.handleSubmit} className="flex-1">
          <form.AppField
            name="date"
            children={(field) => (
              <field.DateField
                mode="range"
                required
                presets={[
                  { label: "This week", value: { from: startOfThisWeek, to: endOfThisWeek } },
                  { label: "This month", value: { from: startOfThisMonth, to: endOfThisMonth } },
                ]}
              />
            )}
          />
        </Form>
        <Button variant="outline" size="icon-sm" onClick={goToNext} disabled={!canNavigate}>
          <ChevronRightIcon />
        </Button>
      </div>

      {children({ entries: entriesQuery.data ?? [], from: date.from, to: date.to })}
    </>
  );
};

export const TimeEntryRangePickerSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-7 rounded-lg" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="size-7 rounded-lg" />
    </div>
  );
};

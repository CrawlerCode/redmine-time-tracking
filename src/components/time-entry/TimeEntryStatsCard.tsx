/* eslint-disable react/no-children-prop */
import { useRedmineTimeEntries } from "@/api/redmine/hooks/useRedmineTimeEntries";
import { TimeByActivityChart } from "@/components/time-entry/charts/TimeByActivityChart";
import { TimeByProjectChart } from "@/components/time-entry/charts/TimeByProjectChart";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppForm } from "@/hooks/useAppForm";
import { Form } from "@base-ui/react";
import { useStore } from "@tanstack/react-form";
import { addDays, addMonths, isMonday, previousMonday, startOfDay, startOfMonth, subDays, subMonths, subWeeks } from "date-fns";
import { useIntl } from "react-intl";
import z from "zod";

export const TimeEntryStatsCard = () => {
  const { formatMessage } = useIntl();

  const today = startOfDay(new Date());
  const startOfThisWeek = isMonday(today) ? today : previousMonday(today);
  const endOfThisWeek = addDays(startOfThisWeek, 6);
  const startOfThisMonth = startOfMonth(today);

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

  const entriesQuery = useRedmineTimeEntries({
    userId: "me",
    from: date.from,
    to: date.to,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatMessage({ id: "time.stats.title" })}</CardTitle>
        <CardDescription className="max-sm:hidden">{formatMessage({ id: "time.stats.description" })}</CardDescription>
        <CardAction>
          <Form onSubmit={form.handleSubmit}>
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  mode="range"
                  required
                  presets={[
                    { label: "This week", value: { from: startOfThisWeek, to: endOfThisWeek } },
                    { label: "Last week", value: { from: subWeeks(startOfThisWeek, 1), to: subDays(startOfThisWeek, 1) } },
                    { label: "This month", value: { from: startOfThisMonth, to: subDays(addMonths(startOfThisMonth, 1), 1) } },
                    { label: "Last month", value: { from: subMonths(startOfThisMonth, 1), to: subDays(startOfThisMonth, 1) } },
                  ]}
                />
              )}
            />
          </Form>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid items-center gap-2 sm:gap-4 md:grid-cols-2">
          {entriesQuery.data && entriesQuery.data.length > 0 ? (
            <>
              <div>
                <TimeByProjectChart entries={entriesQuery.data} />
              </div>
              <div>
                <TimeByActivityChart entries={entriesQuery.data} />
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
        <CardAction>
          <Skeleton className="h-8 w-50" />
        </CardAction>
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

import { redmineTimeEntryActivitiesQuery } from "@/api/redmine/queries/timeEntryActivities";
import { TTimeEntry } from "@/api/redmine/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import useFormatHours from "@/hooks/useFormatHours";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

type Props = {
  entries: TTimeEntry[];
};

export const TimeByActivityChart = ({ entries }: Props) => {
  const { formatMessage } = useIntl();
  const formatHours = useFormatHours();

  const redmineApi = useRedmineApi();
  const { data: activities } = useQuery({
    ...redmineTimeEntryActivitiesQuery(redmineApi),
    select: (data) => data.filter((activity) => activity.active !== false),
  });

  const projectActivityMap = entries.reduce<Record<string, Record<string, number>>>((map, entry) => {
    map[entry.project.name] ??= {};
    map[entry.project.name]![entry.activity.id] = (map[entry.project.name]![entry.activity.id] ?? 0) + entry.hours;
    return map;
  }, {});

  const chartData = Object.entries(projectActivityMap)
    .map(([project, activityHours]) => ({
      project,
      totalHours: Object.values(activityHours).reduce((sum, h) => sum + h, 0),
      ...activities?.reduce<Record<string, number>>((acc, activity) => ({ ...acc, [activity.id]: activityHours[activity.id] ?? 0 }), {}),
    }))
    .sort((a, b) => b.totalHours - a.totalHours);

  const chartConfig = Object.fromEntries(activities?.map((activity, i) => [activity.id, { label: activity.name, color: CHART_COLORS[i % CHART_COLORS.length] }]) ?? []) satisfies ChartConfig;

  return (
    <>
      {chartData.length >= 3 ? (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-70">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="project" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis axisLine={false} tick={false} domain={[0, "dataMax"]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item, index) => (
                    <>
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
                      <div className="flex flex-1 items-center justify-between gap-1 leading-none">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-foreground font-mono font-medium tabular-nums">{formatHours(Number(value))}</span>
                      </div>
                      {index === Object.keys(chartConfig).length - 1 && (
                        <>
                          <Separator />
                          <div className="flex basis-full items-center">
                            <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">{formatHours(item.payload.totalHours)}</div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                />
              }
            />
            {Object.entries(chartConfig).map(([activityId, { label, color }]) => (
              <Radar key={activityId} name={label} dataKey={activityId} stroke={color} strokeOpacity={0.8} fill={color} fillOpacity={0.3} />
            ))}
          </RadarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-70 items-center justify-center">
          <span className="text-muted-foreground">{formatMessage({ id: "time.stats.not-enough-data" })}</span>
        </div>
      )}
    </>
  );
};

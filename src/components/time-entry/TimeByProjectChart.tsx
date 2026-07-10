import { redmineTimeEntryActivitiesQuery } from "@/api/redmine/queries/timeEntryActivities";
import { TTimeEntry } from "@/api/redmine/types";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import useFormatHours from "@/hooks/useFormatHours";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { DefaultTooltipContentProps, Label, Pie, PieChart, Tooltip } from "recharts";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

type PropTypes = {
  entries: TTimeEntry[];
};

export const TimeByProjectChart = ({ entries }: PropTypes) => {
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

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const chartData = Object.entries(projectActivityMap)
    .map(([project, activityHours]) => ({
      project,
      hours: Object.values(activityHours).reduce((sum, h) => sum + h, 0),
      activities: activities?.reduce<Record<string, number>>((acc, activity) => ({ ...acc, [activity.name]: activityHours[activity.id] ?? 0 }), {}),
    }))
    .sort((a, b) => b.hours - a.hours)
    .map((data, i) => ({ ...data, stroke: CHART_COLORS[i % CHART_COLORS.length], fill: `url(#chart-pattern-${(i % CHART_COLORS.length) + 1})` }));

  const chartConfig = Object.fromEntries(chartData.map(({ project }) => [project, { label: project }])) satisfies ChartConfig;

  return (
    <>
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-50">
          <PieChart data={chartData}>
            <ChartTooltip content={<ChartTooltipContent />} isAnimationActive={false} />
            <Pie nameKey="project" dataKey="hours" innerRadius="50%" outerRadius="95%" cornerRadius={3} paddingAngle={3} startAngle={90} endAngle={-270} />

            <defs>
              {CHART_COLORS.map((color, i) => (
                <pattern key={i} id={`chart-pattern-${i + 1}`} patternUnits="userSpaceOnUse" width="5" height="5">
                  <rect width="5" height="5" fill={color} opacity="0.4" />
                  <circle cx="2.5" cy="2.5" r="1" fill={color} opacity="0.8" />
                </pattern>
              ))}
            </defs>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className={clsx("animate-in fill-foreground font-bold duration-3000 fade-in-0", {
                          "text-xl": totalHours < 100,
                          "text-base": totalHours >= 100,
                        })}
                      >
                        {formatHours(totalHours)}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="flex h-50 items-center justify-center">
          <span className="animate-in text-muted-foreground duration-3000 fade-in-0">{formatMessage({ id: "time.stats.not-enough-data" })}</span>
        </div>
      )}
    </>
  );
};

function ChartTooltipContent({ payload }: React.ComponentProps<typeof Tooltip> & Omit<DefaultTooltipContentProps, "accessibilityLayer">) {
  const formatHours = useFormatHours();

  if (!payload?.length) return null;
  const [item] = payload;
  if (!item) return null;

  return (
    <div className="grid min-w-40 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{item.name}</div>
      <div className="grid gap-1.5">
        {item.payload.activities && (
          <>
            {Object.entries(item.payload.activities as Record<string, number>).map(([activity, hours]) => (
              <div key={activity} className="flex w-full flex-wrap items-center gap-2">
                <div className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.payload.stroke }} />
                <div className="flex flex-1 items-center justify-between gap-1 leading-none">
                  <span className="text-muted-foreground">{activity}</span>
                  <span className="font-mono font-medium text-nowrap text-foreground tabular-nums">{formatHours(hours)}</span>
                </div>
              </div>
            ))}
            <Separator className="mt-0.5" />
            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-extrabold text-foreground tabular-nums">{formatHours(item.payload.hours)}</div>
          </>
        )}
      </div>
    </div>
  );
}

export const TimeByProjectChartSkeleton = () => {
  return <div className="h-50" />;
};

import { TTimeEntry } from "@/api/redmine/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useFormatHours from "@/hooks/useFormatHours";
import { useIntl } from "react-intl";
import { Label, Pie, PieChart } from "recharts";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const TimeByProjectChart = ({ entries }: { entries: TTimeEntry[] }) => {
  const { formatMessage } = useIntl();
  const formatHours = useFormatHours();

  const projectMap = new Map<string, number>();
  for (const entry of entries) {
    const name = entry.project.name;
    projectMap.set(name, (projectMap.get(name) ?? 0) + entry.hours);
  }

  const chartData = Array.from(projectMap.entries())
    .map(([project, hours], i) => ({ project, hours, fill: CHART_COLORS[i % CHART_COLORS.length] }))
    .sort((a, b) => b.hours - a.hours);

  const chartConfig = Object.fromEntries(chartData.map(({ project }) => [project, { label: project }])) satisfies ChartConfig;

  return (
    <>
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-50">
          <PieChart data={chartData}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => (
                    <>
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
                      <div className="flex flex-1 items-center justify-between gap-1 leading-none">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-foreground font-mono font-medium text-nowrap tabular-nums">{formatHours(Number(value))}</span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Pie nameKey="project" dataKey="hours" innerRadius="45%" startAngle={90} endAngle={-270} />
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
                        {formatHours(entries.reduce((sum, entry) => sum + entry.hours, 0))}
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
          <span className="text-muted-foreground">{formatMessage({ id: "time.stats.not-enough-data" })}</span>
        </div>
      )}
    </>
  );
};

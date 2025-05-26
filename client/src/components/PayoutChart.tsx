import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useUserSubmissions } from "@/hooks/useSubmissions";
import useUserStore from "@/store/user";
const chartData = [
  { name: "YouTube", payout: 0, fill: "#fa5252" },
  { name: "Google", payout: 0, fill: "#f03e96" },
  { name: "Instagram", payout: 0, fill: "#7950f2" },
  { name: "Meta", payout: 0, fill: "#ec698c" },
  { name: "Others", payout: 0, fill: "#97adb0" },
];

const chartConfig = {
  payout: {
    label: "Payout",
  },
  youtube: {
    label: "YouTube",
    color: "#fa5252",
  },
  google: {
    label: "Google",
    color: "#f03e96",
  },
  instagram: {
    label: "Instagram",
    color: "#7950f2",
  },
  meta: {
    label: "Meta",
    color: "#ec698c",
  },
  other: {
    label: "Others",
    color: "#97adb0",
  },
} satisfies ChartConfig;

export function PayoutChart() {
  const { id } = useUserStore((state) => state);
  const { getRevenueEarned, userSubmissions } = useUserSubmissions(id);
  // const totalPayout = React.useMemo(() => {
  //   return chartData.reduce((acc, curr) => acc + curr.payout, 0);
  // }, []);

  return (
    <Card className="flex flex-col bg-white rounded-4xl p-4">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          {userSubmissions.length > 0 ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="payout"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            ${getRevenueEarned().toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Payout
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p
                style={{ fontFamily: "KarlaRegular" }}
                className="text-gray-500"
              >
                No submissions found
              </p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

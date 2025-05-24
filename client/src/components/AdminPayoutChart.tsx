import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", bounties: 186 },
  { month: "February", bounties: 305 },
  { month: "March", bounties: 237 },
  { month: "April", bounties: 73 },
  { month: "May", bounties: 209 },
  { month: "June", bounties: 214 },
];

const chartConfig = {
  bounties: {
    label: "Bounties",
    color: "#fa5e06",
  },
} satisfies ChartConfig;

export function AdminPayoutChart() {
  return (
    <Card>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
              style={{
                fontFamily: "KarlaRegular",
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                style={{
                  fontFamily: "KarlaRegular",
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="bounties"
                type="natural"
                fill="var(--color-bounties)"
                fillOpacity={0.4}
                stroke="var(--color-bounties)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center h-full">
            <p className="text-gray-500" style={{ fontFamily: "KarlaRegular" }}>
              No data
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {chartData.length > 0 && (
          <div className="flex w-full items-start gap-2 text-sm -mt-4">
            <div className="grid gap-2">
              <div
                className="flex items-center gap-2 font-medium leading-none"
                style={{ fontFamily: "KarlaRegular" }}
              >
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

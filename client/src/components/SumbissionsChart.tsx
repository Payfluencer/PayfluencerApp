import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSubmissions } from "@/hooks/useSubmissions";

const chartConfig = {
  status: {
    label: "Submissions",
    color: "#fa5e06",
  },
} satisfies ChartConfig;

export function SubmissionsSummary() {
  const { getSubmissionsByStatus } = useSubmissions();
  const chartData = [
    {
      status: "Rejected",
      number: getSubmissionsByStatus("REJECTED")?.length || 1,
      fill: "#fa5e06",
      label: "Rejected",
    },
    {
      status: "Approved",
      number: getSubmissionsByStatus("APPROVED")?.length || 2,
      fill: "#008000",
      label: "Approved",
    },
    {
      status: "Pending",
      number: getSubmissionsByStatus("PENDING")?.length || 3,
      fill: "#0000ff",
      label: "Pending",
    },
    {
      status: "Settled",
      number: getSubmissionsByStatus("SETTLED")?.length || 1,
      fill: "#ffa500",
      label: "Settled",
    },
  ];
  return (
    <Card className="w-full md:w-[30%] rounded-4xl shadow-none border border-[#bfbfc5]">
      <CardHeader
        style={{
          fontFamily: "KarlaRegular",
        }}
      >
        <CardTitle style={{ fontFamily: "KarlaRegular" }}>
          Submissions Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="number" fill="var(--color-status)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

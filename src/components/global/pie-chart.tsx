"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title?: string;
  description?: string;
  config?: ChartConfig;
  valueFormatter?: (value: number) => string;
}

export function PieChartComponent({
  data,
  title = "Distribution",
  description = "Data distribution overview",
  config,
  valueFormatter = (value) => value.toString(),
}: PieChartProps) {
  // Default config if not provided
  const chartConfig = config || {
    value: {
      label: "Value",
    },
    ...data.reduce((acc, item) => {
      return {
        ...acc,
        [item.name]: {
          label: item.name,
          color: item.color,
        },
      };
    }, {}),
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: payload[0].payload.fill }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {payload[0].name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {valueFormatter(Number(payload[0].value) ?? 0)}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

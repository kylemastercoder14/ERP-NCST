/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ChartData = {
  date: string;
  [key: string]: string | number;
};

export type ChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
    type?: "area" | "line" | "bar";
    stackId?: string;
    fillOpacity?: number;
  };
};

interface ChartProps {
  data: ChartData[];
  config: ChartConfig;
  title?: string;
  description?: string;
  valueFormatter?: (value: number, name: string) => string;
}

export function Chart({
  data,
  config,
  title = "Data Overview",
  description = "Trend analysis",
  valueFormatter,
}: ChartProps) {
  // Format data for monthly display
  const monthlyData = React.useMemo(() => {
    if (!data.length) return [];

    // Group by month and get most recent entry for each month
    const months = new Map();
    data.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      // Update if not exists or is a more recent entry in the same month
      if (!months.has(monthKey) || new Date(months.get(monthKey).date) < date) {
        months.set(monthKey, {
          ...item,
          // Format the date for display
          displayDate: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
        });
      }
    });

    // Convert map to array and sort by date
    const result = Array.from(months.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return result;
  }, [data]);

  const chartColors: Record<string, string> = React.useMemo(() => {
    return Object.keys(config).reduce(
      (acc, key, index) => {
        return {
          ...acc,
          [key]: config[key].color || `hsl(var(--chart-${(index % 5) + 1}))`,
        };
      },
      {} as Record<string, string>
    );
  }, [config]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-2 grid gap-2">
          {payload.map((entry: any) => (
            <div
              key={entry.dataKey}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {config[entry.dataKey]?.label || entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-medium">
                {valueFormatter ? valueFormatter(Number(entry.value), entry.dataKey) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                {Object.keys(config).map((key) => (
                  <linearGradient
                    key={`fill-${key}`}
                    id={`fill-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartColors[key]}
                      stopOpacity={config[key].fillOpacity || 0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors[key]}
                      stopOpacity={
                        config[key].fillOpacity
                          ? config[key].fillOpacity / 10
                          : 0.1
                      }
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(config).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  fill={`url(#fill-${key})`}
                  stroke={chartColors[key]}
                  stackId={config[key].stackId || key}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

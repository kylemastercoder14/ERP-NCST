import React from "react";
import { Minus, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SummaryCard = ({
  title,
  data,
  percentage,
  trend,
  description,
  recommendation,
}: {
  title: string;
  data: string;
  percentage: string;
  trend: "up" | "down" | "neutral";
  description: string;
  recommendation: string;
}) => {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {data}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            {trend === "up" ? (
              <TrendingUpIcon className="size-4 text-green-700" />
            ) : trend === "down" ? (
              <TrendingDownIcon className="size-4 text-red-700" />
            ) : (
              <Minus className="size-4 text-gray-700" />
            )}
            {percentage}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description}{" "}
          {trend === "up" ? (
            <TrendingUpIcon className="size-4 text-green-700" />
          ) : trend === "down" ? (
            <TrendingDownIcon className="size-4 text-red-700" />
          ) : (
            <Minus className="size-4 text-gray-700" />
          )}
        </div>
        <div className="text-muted-foreground">{recommendation}</div>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-24" />
        </CardTitle>
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="mt-4 border-t pt-2">
          <Skeleton className="h-3 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="absolute right-4 top-4">
          <Skeleton className="h-8 w-64" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PieChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Skeleton className="h-[180px] w-[180px] rounded-full" />
      </CardContent>
    </Card>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </div>
          <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
            <div className="lg:col-span-3">
              <ChartSkeleton />
            </div>
            <div className="lg:col-span-2">
              <PieChartSkeleton />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import SummaryCard from "@/components/global/summary-card";
import db from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import {
  calculatePercentageDifference,
  formatPercentage,
  getTrend,
} from "@/lib/utils";
import { Chart } from "@/components/global/area-chart";
import { PieChartComponent } from "@/components/global/pie-chart";
import RecentDatatableActions, {
  Column,
} from "@/components/global/recent-datatable-actions";

// Server-side formatting functions
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const InventoryDashboard = async () => {
  // Date ranges
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  try {
    // Fetch all summary data in parallel
    const [inventoryCounts, criticalItemsCounts, categoryCounts, movementData] =
      await Promise.all([
        // Total Inventory Count
        Promise.all([
          db.inventory.count(),
          db.inventory.count({ where: { createdAt: { lte: lastMonthEnd } } }),
        ]),

        // Critical Items Count
        Promise.all([
          db.inventory.count({
            where: {
              quantity: { lt: db.inventory.fields.treshold },
              createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            },
          }),
          db.inventory.count({
            where: {
              quantity: { lt: db.inventory.fields.treshold },
              createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            },
          }),
        ]),

        // Items by Category Count
        db.items.groupBy({
          by: ["isSmallItem"],
          _count: {
            _all: true,
          },
        }),

        // Inventory Movement
        Promise.all([
          db.withdrawalItem.aggregate({
            _sum: { quantity: true },
            where: {
              createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            },
          }),
          db.purchaseRequestItem.aggregate({
            _sum: { quantity: true },
            where: {
              inventoryItemStatus: "Received",
              createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            },
          }),
          db.withdrawalItem.aggregate({
            _sum: { quantity: true },
            where: {
              createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            },
          }),
          db.purchaseRequestItem.aggregate({
            _sum: { quantity: true },
            where: {
              inventoryItemStatus: "Received",
              createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            },
          }),
        ]),
      ]);

    // Destructure results
    const [currentInventoryCount, lastMonthInventoryCount] = inventoryCounts;
    const [currentCriticalCount, lastMonthCriticalCount] = criticalItemsCounts;
    const categoryDistribution = categoryCounts;
    const [
      currentMonthWithdrawals,
      currentMonthAdditions,
      lastMonthWithdrawals,
      lastMonthAdditions,
    ] = movementData;

    // Calculate differences
    const inventoryDiff = calculatePercentageDifference(
      lastMonthInventoryCount,
      currentInventoryCount
    );
    const criticalDiff = calculatePercentageDifference(
      lastMonthCriticalCount,
      currentCriticalCount
    );
    const withdrawalDiff = calculatePercentageDifference(
      lastMonthWithdrawals._sum.quantity || 0,
      currentMonthWithdrawals._sum.quantity || 0
    );
    const additionDiff = calculatePercentageDifference(
      lastMonthAdditions._sum.quantity || 0,
      currentMonthAdditions._sum.quantity || 0
    );

    // Dynamic recommendation generators
    const getInventoryRecommendation = (diff: number, count: number) => {
      if (count < 100) return "Inventory levels low. Consider replenishment.";
      if (diff > 15)
        return "Inventory growing rapidly. Review storage capacity.";
      if (diff < -10) return "Inventory decreasing. Check demand patterns.";
      return "Inventory levels stable. Maintain current processes.";
    };

    const getCriticalRecommendation = (diff: number, count: number) => {
      if (count > 20)
        return "Many critical items! Urgent replenishment needed.";
      if (diff > 10)
        return "Critical items increasing. Review safety stock levels.";
      if (count === 0) return "No critical items. Maintain current levels.";
      return "Some critical items. Plan replenishment orders.";
    };

    const getMovementRecommendation = (
      withdrawalDiff: number,
      additionDiff: number
    ) => {
      if (withdrawalDiff > 20 && additionDiff < 5)
        return "High withdrawals with low additions. Risk of stockouts.";
      if (additionDiff > 20 && withdrawalDiff < 5)
        return "High additions with low withdrawals. Check for overstocking.";
      return "Inventory movement balanced. Monitor trends.";
    };

    // Fetch chart data
    const inventoryMovementData = await fetchInventoryMovementData();

    async function fetchInventoryMovementData() {
      const endDate = new Date();
      const startDate = subMonths(endDate, 6);
      const months = [];

      // Create array of month start dates
      let currentDate = startDate;
      while (currentDate <= endDate) {
        months.push(currentDate);
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const results = await Promise.all(
        months.map(async (date) => {
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);

          const [withdrawals, additions] = await Promise.all([
            db.withdrawalItem.aggregate({
              _sum: { quantity: true },
              where: {
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
            db.purchaseRequestItem.aggregate({
              _sum: { quantity: true },
              where: {
                inventoryItemStatus: "Received",
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
          ]);

          return {
            date: format(monthStart, "yyyy-MM-dd"),
            withdrawals: withdrawals._sum.quantity || 0,
            additions: additions._sum.quantity || 0,
            netChange:
              (additions._sum.quantity || 0) - (withdrawals._sum.quantity || 0),
          };
        })
      );

      return results.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    // Format category distribution for pie chart
    const categoryData = categoryDistribution.map((category, index) => ({
      name: category.isSmallItem ? "Small Items" : "Large Items",
      value: category._count._all,
      color: `hsl(var(--chart-${index + 1}))`,
      formattedValue: `${category._count._all} items`,
    }));

    // Recent inventory activities
    const recentLogs = await db.logs.findMany({
      where: {
        department: {
          name: "Inventory",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: { include: { Employee: true } },
        department: true,
      },
      take: 5,
    });

    const formattedRecentLogs: Column[] = recentLogs.map((item) => ({
      id: item.id,
      action: item.action,
      department: item.department.name,
      user: `${item.User.Employee.firstName} ${item.User.Employee.lastName}`,
      createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
    }));

    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
              <SummaryCard
                title="Total Inventory Items"
                data={formatNumber(currentInventoryCount)}
                trend={getTrend(inventoryDiff)}
                percentage={formatPercentage(inventoryDiff)}
                description="Compared to last month"
                recommendation={getInventoryRecommendation(
                  inventoryDiff,
                  currentInventoryCount
                )}
              />
              <SummaryCard
                title="Critical Stock Items"
                data={currentCriticalCount.toString()}
                trend={getTrend(criticalDiff)}
                percentage={formatPercentage(criticalDiff)}
                description="Below safety threshold"
                recommendation={getCriticalRecommendation(
                  criticalDiff,
                  currentCriticalCount
                )}
              />
              <SummaryCard
                title="Items Withdrawn"
                data={formatNumber(currentMonthWithdrawals._sum.quantity || 0)}
                trend={getTrend(withdrawalDiff)}
                percentage={formatPercentage(withdrawalDiff)}
                description="This month"
                recommendation={getMovementRecommendation(
                  withdrawalDiff,
                  additionDiff
                )}
              />
              <SummaryCard
                title="Items Added"
                data={formatNumber(currentMonthAdditions._sum.quantity || 0)}
                trend={getTrend(additionDiff)}
                percentage={formatPercentage(additionDiff)}
                description="This month"
                recommendation={getMovementRecommendation(
                  withdrawalDiff,
                  additionDiff
                )}
              />
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="lg:col-span-3">
                <Chart
                  data={inventoryMovementData}
                  config={{
                    withdrawals: {
                      label: "Items Withdrawn",
                      color: "hsl(var(--destructive))",
                    },
                    additions: {
                      label: "Items Added",
                      color: "hsl(var(--success))",
                    },
                    netChange: {
                      label: "Net Change",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  title="Inventory Movement"
                  description="Monthly inventory additions and withdrawals"
                />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <PieChartComponent
                  title="Item Categories"
                  description="Small vs large items distribution"
                  data={categoryData}
                />
              </div>
            </div>

            <RecentDatatableActions
              title="Recent Inventory Activities"
              description="All the recent inventory activities will be displayed here."
              data={formattedRecentLogs}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading inventory dashboard:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Dashboard Loading Failed</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load the inventory data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default InventoryDashboard;

/* eslint-disable react/no-unescaped-entities */
import React from "react";
import SummaryCard from "@/components/global/summary-card";
import db from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import {
  calculatePercentageDifference,
  formatPercentage,
  getTrend,
  procurementChartConfig,
} from "@/lib/utils";
import { Chart } from "@/components/global/area-chart";
import { PieChartComponent } from "@/components/global/pie-chart";
import RecentDatatableActions, {
  Column,
} from "@/components/global/recent-datatable-actions";

// Server-side currency formatting function
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatChartData = (data: {
  date: string;
  purchaseRequests: number;
  approvedRequests: number;
  totalSpend: number;
  pendingDeliveries: number;
}) => {
  return {
    ...data,
    // Add formatted version for display
    totalSpendFormatted: formatCurrency(data.totalSpend),
  };
};

const ProcurementDashboard = async ({ branchId }: { branchId: string }) => {
  // Date ranges
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  try {
    // Fetch all summary data in parallel
    const [itemCounts, pendingCounts, supplierCounts, spendData] =
      await Promise.all([
        // Total Items Count
        Promise.all([
          db.items.count({
            where: {
              Supplier: {
                branchId,
              },
            },
          }),
          db.items.count({
            where: {
              createdAt: { lte: lastMonthEnd },
              Supplier: {
                branchId,
              },
            },
          }),
        ]),

        // Pending Approvals
        Promise.all([
          db.purchaseRequest.count({
            where: {
              financeStatus: "Pending",
              createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
              requestedBy: {
                branchId,
              },
            },
          }),
          db.purchaseRequest.count({
            where: {
              financeStatus: "Pending",
              createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
              requestedBy: {
                branchId,
              },
            },
          }),
        ]),

        // Active Suppliers
        Promise.all([
          db.supplier.count({
            where: {
              Items: {
                some: {
                  PurchaseRequestItem: {
                    some: {
                      createdAt: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd,
                      },
                    },
                  },
                },
              },
              branchId,
            },
          }),
          db.supplier.count({
            where: {
              Items: {
                some: {
                  PurchaseRequestItem: {
                    some: {
                      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
                    },
                  },
                },
              },
              branchId,
            },
          }),
        ]),

        // Monthly Spend
        Promise.all([
          db.purchaseRequestItem.aggregate({
            _sum: { totalAmount: true },
            where: {
              createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
              financeItemStatus: "Approved",
              Item: {
                Supplier: {
                  branchId,
                },
              },
            },
          }),
          db.purchaseRequestItem.aggregate({
            _sum: { totalAmount: true },
            where: {
              createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
              financeItemStatus: "Approved",
              Item: {
                Supplier: {
                  branchId,
                },
              },
            },
          }),
        ]),
      ]);

    // Destructure results
    const [currentItemCount, lastMonthItemCount] = itemCounts;
    const [pendingRequests, lastMonthPendingRequests] = pendingCounts;
    const [activeSuppliers, lastMonthActiveSuppliers] = supplierCounts;
    const [currentMonthSpend, lastMonthSpend] = spendData;

    // Calculate differences
    const itemCountDiff = calculatePercentageDifference(
      lastMonthItemCount,
      currentItemCount
    );
    const pendingDiff = calculatePercentageDifference(
      lastMonthPendingRequests,
      pendingRequests
    );
    const suppliersDiff = calculatePercentageDifference(
      lastMonthActiveSuppliers,
      activeSuppliers
    );
    const spendDiff = calculatePercentageDifference(
      lastMonthSpend._sum.totalAmount || 0,
      currentMonthSpend._sum.totalAmount || 0
    );

    // Dynamic recommendation generators
    const getItemsRecommendation = (diff: number) => {
      if (diff > 20) return "Rapid item growth. Review inventory needs.";
      if (diff > 0) return "Consider adding more items to match demand.";
      if (diff < -10) return "Item reduction detected. Audit inventory usage.";
      return "Inventory levels stable. Maintain current processes.";
    };

    const getPendingRecommendation = (diff: number, count: number) => {
      if (count > 10) return "High pending volume. Prioritize approvals.";
      if (diff > 15)
        return "Increasing backlog. Allocate more review resources.";
      if (diff < -5) return "Approval efficiency improving. Maintain pace.";
      return "Regular review of pending requests recommended.";
    };

    const getSuppliersRecommendation = (diff: number, count: number) => {
      if (count < 3)
        return "Low supplier diversity. Consider onboarding new vendors.";
      if (diff > 10)
        return "Expanding supplier base. Evaluate new vendor performance.";
      if (diff < -5)
        return "Reduced supplier activity. Check for supply chain issues.";
      return "Regular supplier performance reviews recommended.";
    };

    const getSpendRecommendation = (diff: number, amount: number) => {
      const budget = 10000; // Example budget
      const utilization = (amount / budget) * 100;

      if (utilization > 90)
        return "Approaching budget limit. Review expenditures carefully.";
      if (diff > 15)
        return "Spending increasing rapidly. Implement cost controls.";
      if (diff < -10)
        return "Spending reduced. Evaluate potential underspending.";
      return "Monitor spending against quarterly targets.";
    };

    // Fetch and format chart data on server
    const chartData = await fetchChartData();

    async function fetchChartData() {
      // Get data for the last 12 months
      const endDate = new Date();
      const startDate = subMonths(endDate, 11); // 12 months including current
      const dates = [];

      // Create an array of month start dates
      let currentDate = startDate;
      while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // Process in batches to avoid connection pool issues
      const batchSize = 3;
      const results = [];

      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        const batchData = await Promise.all(
          batch.map(async (date) => {
            const monthStart = startOfMonth(date);
            const monthEnd = endOfMonth(date);

            const [requests, approved, spend, pendingDelivery] =
              await Promise.all([
                db.purchaseRequest.count({
                  where: {
                    createdAt: { gte: monthStart, lte: monthEnd },
                    requestedBy: { branchId },
                  },
                }),
                db.purchaseRequest.count({
                  where: {
                    financeStatus: "Approved",
                    createdAt: { gte: monthStart, lte: monthEnd },
                    requestedBy: { branchId },
                  },
                }),
                db.purchaseRequestItem.aggregate({
                  _sum: { totalAmount: true },
                  where: {
                    financeItemStatus: "Approved",
                    createdAt: { gte: monthStart, lte: monthEnd },
                    Item: {
                      Supplier: {
                        branchId,
                      },
                    },
                  },
                }),
                db.purchaseRequest.count({
                  where: {
                    supplierStatus: "In transit",
                    createdAt: { gte: monthStart, lte: monthEnd },
                    requestedBy: { branchId },
                  },
                }),
              ]);

            return formatChartData({
              date: format(monthStart, "yyyy-MM-dd"),
              purchaseRequests: requests,
              approvedRequests: approved,
              totalSpend: spend._sum.totalAmount || 0,
              pendingDeliveries: pendingDelivery,
            });
          })
        );
        results.push(...batchData);
      }

      return results.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    const suppliersWithItemCounts = await db.supplier.findMany({
      where: {
        branchId,
      },
      include: {
        Items: {
          select: {
            id: true,
          },
        },
      },
    });

    const supplierItemCountData = suppliersWithItemCounts.map(
      (supplier, index) => ({
        name: supplier.name,
        value: supplier.Items.length,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
        formattedValue: `${supplier.Items.length} items`,
      })
    );

    const recentLogs = await db.logs.findMany({
      where: {
        department: {
          name: "Procurement",
        },
        User: {
          Employee: {
            branchId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: { include: { Employee: true } },
        department: true,
      },
    });

    const formattedRecentLogs: Column[] =
      recentLogs.map((item) => {
        return {
          id: item.id,
          action: item.action,
          department: item.department.name,
          user: `${item.User.Employee.firstName} ${item.User.Employee.lastName}`,
          createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
        };
      }) || [];

    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
              <SummaryCard
                title="Total Items"
                data={currentItemCount.toString()}
                trend={getTrend(itemCountDiff)}
                percentage={formatPercentage(itemCountDiff)}
                description="Trending up to this month"
                recommendation={getItemsRecommendation(itemCountDiff)}
              />
              <SummaryCard
                title="Pending Approvals"
                data={pendingRequests.toString()}
                trend={getTrend(pendingDiff)}
                percentage={formatPercentage(pendingDiff)}
                description="From last month"
                recommendation={getPendingRecommendation(
                  pendingDiff,
                  pendingRequests
                )}
              />
              <SummaryCard
                title="Active Suppliers"
                data={activeSuppliers.toString()}
                trend={getTrend(suppliersDiff)}
                percentage={formatPercentage(suppliersDiff)}
                description="Compared to last month"
                recommendation={getSuppliersRecommendation(
                  suppliersDiff,
                  activeSuppliers
                )}
              />
              <SummaryCard
                title="Monthly Spend"
                data={formatCurrency(currentMonthSpend._sum.totalAmount || 0)}
                trend={getTrend(spendDiff)}
                percentage={formatPercentage(spendDiff)}
                description="Against last month"
                recommendation={getSpendRecommendation(
                  spendDiff,
                  currentMonthSpend._sum.totalAmount || 0
                )}
              />
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="lg:col-span-3">
                <Chart
                  data={chartData}
                  config={{
                    ...procurementChartConfig,
                    totalSpendFormatted: {
                      label: "Total Spend",
                      color: procurementChartConfig.totalSpend.color,
                      fillOpacity:
                        procurementChartConfig.totalSpend.fillOpacity,
                    },
                  }}
                  title="Procurement Activity"
                  description="Monthly procurement metrics"
                />
              </div>
              <div className="lg:col-span-2">
                <PieChartComponent
                  title="Items by Supplier"
                  description="Distribution of items across suppliers"
                  data={supplierItemCountData}
                />
              </div>
            </div>

            {/* RecentDataTable Actions */}
            <RecentDatatableActions
              title="Recent Procurement Activities"
              description="All the recent procurement activities will be displayed here."
              data={formattedRecentLogs}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading procurement dashboard:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Dashboard Loading Failed</h2>
          <p className="text-muted-foreground">
            We couldn't load the procurement data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default ProcurementDashboard;

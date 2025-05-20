/* eslint-disable @typescript-eslint/no-unused-vars */
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
import DashboardSkeleton from "@/components/global/dashboard-skeleton";

const generateDynamicColors = (count: number) => {
  const baseColors = [
    "#3B82F6", // blue-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
    "#F97316", // orange-500
    "#6366F1", // indigo-500
    "#06B6D4", // cyan-500
  ];

  if (count > baseColors.length) {
    const additionalColors = [];
    const hueStep = 360 / (count - baseColors.length);
    for (let i = 0; i < count - baseColors.length; i++) {
      const hue = Math.floor(i * hueStep);
      additionalColors.push(`hsl(${hue}, 80%, 60%)`);
    }
    return [...baseColors, ...additionalColors];
  }
  return baseColors.slice(0, count);
};

const CRMDashboard = async ({ branchId }: { branchId: string }) => {
  // Date ranges
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  try {
    // Fetch all CRM data in parallel
    const [
      clientCounts,
      ticketData,
      ticketStatusData,
      clientActivityData,
      highValueClients,
      ticketResolutionData,
      clientRetentionData,
      newClientsData,
      openTicketsData,
      ticketTypeData,
    ] = await Promise.all([
      // Client Counts
      Promise.all([
        db.client.count({
          where: {
            branchId,
          },
        }),
        db.client.count({
          where: {
            createdAt: { lte: lastMonthEnd },
            branchId,
          },
        }),
      ]),

      // Ticket Data
      Promise.all([
        db.ticket.count({
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            client: {
              branchId,
            },
          },
        }),
        db.ticket.count({
          where: {
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            client: {
              branchId,
            },
          },
        }),
      ]),

      // Ticket Status Distribution
      db.ticket.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
        where: {
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          client: {
            branchId,
          },
        },
      }),

      // Client Activity
      db.client.findMany({
        where: {
          branchId,
        },
        take: 5,
        orderBy: {
          Ticket: {
            _count: "desc",
          },
        },
        include: {
          _count: {
            select: { Ticket: true },
          },
          Ticket: {
            take: 1,
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      }),

      // High Value Clients
      db.client.findMany({
        where: {
          Ticket: {
            some: {
              priority: "high",
            },
          },
          branchId,
        },
        include: {
          _count: {
            select: { Ticket: true },
          },
        },
      }),

      // Ticket Resolution Data
      Promise.all([
        db.ticket.count({
          where: {
            status: "Closed",
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            client: {
              branchId,
            },
          },
        }),
        db.ticket.count({
          where: {
            status: "Closed",
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            client: {
              branchId,
            },
          },
        }),
      ]),

      // Client Retention Data
      Promise.all([
        db.client.count({
          where: {
            createdAt: { lte: lastMonthStart },
            updatedAt: { gte: currentMonthStart },
            branchId,
          },
        }),
        db.client.count({
          where: {
            createdAt: { lte: lastMonthStart },
            branchId,
          },
        }),
      ]),

      // New Clients Data
      Promise.all([
        db.client.count({
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            branchId,
          },
        }),
        db.client.count({
          where: {
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            branchId,
          },
        }),
      ]),

      // Open Tickets Data
      Promise.all([
        db.ticket.count({
          where: {
            status: "Open",
            client: {
              branchId,
            },
          },
        }),
        db.ticket.count({
          where: {
            status: "Open",
            createdAt: { lte: lastMonthEnd },
            client: {
              branchId,
            },
          },
        }),
      ]),

      // Ticket Type Distribution (instead of client sources)
      db.ticket.groupBy({
        by: ["type"],
        _count: {
          _all: true,
        },
        where: {
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          client: {
            branchId,
          },
        },
      }),
    ]);

    // Destructure results
    const [currentClients, lastMonthClients] = clientCounts;
    const [currentMonthTickets, lastMonthTickets] = ticketData;
    const [resolvedTicketsCurrentMonth, resolvedTicketsLastMonth] =
      ticketResolutionData;
    const [activeClients, totalExistingClients] = clientRetentionData;
    const [newClientsCurrentMonth, newClientsLastMonth] = newClientsData;
    const [currentOpenTickets, lastMonthOpenTickets] = openTicketsData;

    // Calculate differences
    const clientDiff = calculatePercentageDifference(
      lastMonthClients,
      currentClients
    );
    const ticketDiff = calculatePercentageDifference(
      lastMonthTickets,
      currentMonthTickets
    );
    const resolutionDiff = calculatePercentageDifference(
      resolvedTicketsLastMonth,
      resolvedTicketsCurrentMonth
    );

    // Calculate retention rate (percentage of existing clients who have activity this month)
    const retentionRate =
      totalExistingClients > 0
        ? (activeClients / totalExistingClients) * 100
        : 0;
    const lastMonthRetentionRate =
      totalExistingClients > 0
        ? ((activeClients - 10) / totalExistingClients) * 100
        : 0; // Mock data for comparison
    const retentionDiff = calculatePercentageDifference(
      lastMonthRetentionRate,
      retentionRate
    );

    // Calculate new clients difference
    const newClientsDiff = calculatePercentageDifference(
      newClientsLastMonth,
      newClientsCurrentMonth
    );

    // Calculate open tickets difference (negative is better for open tickets)
    const openTicketsDiff =
      calculatePercentageDifference(lastMonthOpenTickets, currentOpenTickets) *
      -1;

    // Calculate resolution rate
    const resolutionRateCurrentMonth =
      currentMonthTickets > 0
        ? (resolvedTicketsCurrentMonth / currentMonthTickets) * 100
        : 0;
    const resolutionRateLastMonth =
      lastMonthTickets > 0
        ? (resolvedTicketsLastMonth / lastMonthTickets) * 100
        : 0;
    const resolutionRateDiff = calculatePercentageDifference(
      resolutionRateLastMonth,
      resolutionRateCurrentMonth
    );

    // Dynamic recommendation generators
    const getClientGrowthRecommendation = (diff: number, count: number) => {
      if (diff > 10)
        return "Strong client growth. Ensure onboarding resources.";
      if (diff < -5)
        return "Client base shrinking. Review retention strategies.";
      return "Client base stable. Focus on engagement.";
    };

    const getTicketVolumeRecommendation = (diff: number, count: number) => {
      if (count > 100) return "High ticket volume. Review support capacity.";
      if (diff > 15) return "Increasing ticket demands. Plan resources.";
      return "Ticket volume manageable.";
    };

    const getResolutionRateRecommendation = (rate: number, diff: number) => {
      if (rate < 60) return "Low resolution rate. Improve support processes.";
      if (diff < -5) return "Resolution rate declining. Investigate causes.";
      if (diff > 5) return "Resolution improving. Continue best practices.";
      return "Resolution rate stable. Look for optimization opportunities.";
    };

    const getRetentionRecommendation = (rate: number, diff: number) => {
      if (rate < 70) return "Low retention. Implement engagement program.";
      if (diff < -5) return "Declining retention. Investigate client needs.";
      if (diff > 5)
        return "Retention improving. Continue successful strategies.";
      return "Retention stable. Focus on high-value clients.";
    };

    const getNewClientsRecommendation = (count: number, diff: number) => {
      if (count < 5) return "Low acquisition. Review lead generation.";
      if (diff < -10) return "Fewer new clients. Boost marketing efforts.";
      if (diff > 10) return "Strong acquisition. Ensure smooth onboarding.";
      return "Acquisition stable. Balance with retention efforts.";
    };

    const getOpenTicketsRecommendation = (count: number, diff: number) => {
      if (count > 50) return "High open ticket count. Add resources.";
      if (diff < -10) return "Ticket backlog decreasing. Maintain momentum.";
      if (diff > 10) return "Increasing backlog. Review resolution process.";
      return "Open ticket volume stable. Monitor for spikes.";
    };

    // Format ticket status data for pie chart
    const ticketStatusColors = generateDynamicColors(ticketStatusData.length);
    const ticketStatusChartData = ticketStatusData.map((status, index) => ({
      name: status.status,
      value: status._count._all,
      color: ticketStatusColors[index % ticketStatusColors.length],
      formattedValue: `${status._count._all} tickets`,
    }));

    // Format ticket type data for pie chart (instead of client sources)
    const ticketTypeColors = generateDynamicColors(ticketTypeData.length);
    const ticketTypeChartData = ticketTypeData.map((type, index) => ({
      name: type.type,
      value: type._count._all,
      color: ticketTypeColors[index % ticketTypeColors.length],
      formattedValue: `${type._count._all} tickets`,
    }));

    // Fetch ticket trends data
    const ticketTrendData = await fetchTicketTrendData();
    async function fetchTicketTrendData() {
      const endDate = new Date();
      const startDate = subMonths(endDate, 6);
      const months = [];

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

          const [created, resolved] = await Promise.all([
            db.ticket.count({
              where: {
                createdAt: { gte: monthStart, lte: monthEnd },
                client: {
                  branchId,
                },
              },
            }),
            db.ticket.count({
              where: {
                status: "Closed",
                updatedAt: { gte: monthStart, lte: monthEnd },
                client: {
                  branchId,
                },
              },
            }),
          ]);

          return {
            date: format(monthStart, "yyyy-MM-dd"),
            ticketsCreated: created,
            ticketsResolved: resolved,
            resolutionRate: created > 0 ? (resolved / created) * 100 : 0,
          };
        })
      );

      return results.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    // Recent operations activities
    const recentLogs = await db.logs.findMany({
      where: {
        department: {
          name: "Customer Relationship",
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
                title="Ticket Resolution"
                data={`${resolutionRateCurrentMonth.toFixed(1)}%`}
                trend={getTrend(resolutionRateDiff)}
                percentage={formatPercentage(resolutionRateDiff)}
                description="Percentage of tickets resolved"
                recommendation={getResolutionRateRecommendation(
                  resolutionRateCurrentMonth,
                  resolutionRateDiff
                )}
              />
              <SummaryCard
                title="Client Retention"
                data={`${retentionRate.toFixed(1)}%`}
                trend={getTrend(retentionDiff)}
                percentage={formatPercentage(retentionDiff)}
                description="Active existing clients"
                recommendation={getRetentionRecommendation(
                  retentionRate,
                  retentionDiff
                )}
              />
              <SummaryCard
                title="Active Clients"
                data={clientActivityData.length.toString()}
                percentage="0"
                trend="neutral"
                description="Clients with recent tickets"
                recommendation={
                  clientActivityData.length > 20
                    ? "Segment active clients for targeted engagement"
                    : "Increase engagement with inactive clients"
                }
              />
              <SummaryCard
                title="Open Tickets"
                data={currentOpenTickets.toString()}
                trend={getTrend(openTicketsDiff)}
                percentage={formatPercentage(openTicketsDiff)}
                description="Tickets awaiting resolution"
                recommendation={getOpenTicketsRecommendation(
                  currentOpenTickets,
                  openTicketsDiff
                )}
              />
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="lg:col-span-3">
                <Chart
                  data={ticketTrendData}
                  config={{
                    ticketsCreated: {
                      label: "Tickets Created",
                      color: "#3B82F6",
                    },
                    ticketsResolved: {
                      label: "Tickets Resolved",
                      color: "#10B981",
                    },
                    resolutionRate: {
                      label: "Resolution Rate (%)",
                      color: "#8B5CF6",
                    },
                  }}
                  title="Ticket Trends"
                  description="Monthly ticket volume and resolution"
                />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <PieChartComponent
                  title="Ticket Status"
                  description="Current month ticket distribution"
                  data={ticketStatusChartData}
                />
              </div>
            </div>

            <RecentDatatableActions
              title="Recent Customer Relationship Activities"
              description="All recent customer relationship activities"
              data={formattedRecentLogs}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading CRM dashboard:", error);
    return <DashboardSkeleton />;
  }
};

export default CRMDashboard;

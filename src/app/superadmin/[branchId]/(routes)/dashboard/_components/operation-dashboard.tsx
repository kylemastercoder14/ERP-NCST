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

  // If we need more colors than we have in base, generate complementary colors
  if (count > baseColors.length) {
    const additionalColors = [];
    const hueStep = 360 / (count - baseColors.length);

    for (let i = 0; i < count - baseColors.length; i++) {
      const hue = Math.floor(i * hueStep);
      // More saturated and vibrant colors
      additionalColors.push(`hsl(${hue}, 80%, 60%)`);
    }

    return [...baseColors, ...additionalColors];
  }

  return baseColors.slice(0, count);
};

const OperationsDashboard = async () => {
  // Date ranges
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  try {
    // Fetch all operations data in parallel
    const [
      employeeCounts,
      clientDistribution,
      shiftData,
      performanceData,
      attendanceData,
      ticketData,
    ] = await Promise.all([
      // Total Employees Count
      Promise.all([
        db.employee.count({
          where: {
            Department: {
              name: "Operation",
            },
          },
        }),
        db.employee.count({
          where: {
            createdAt: { lte: lastMonthEnd },
            Department: {
              name: "Operation",
            },
          },
        }),
      ]),

      // Client Distribution
      db.employee.groupBy({
        by: ["clientId"],
        where: {
          Department: {
            name: "Operation",
          },
        },
        _count: {
          _all: true,
        },
      }),

      // Shift Coverage Data
      Promise.all([
        db.extraShift.count({
          where: {
            date: {
              gte: currentMonthStart.toISOString(),
              lte: currentMonthEnd.toISOString(),
            },
            status: "Approved",
          },
        }),
        db.extraShift.count({
          where: {
            date: {
              gte: lastMonthStart.toISOString(),
              lte: lastMonthEnd.toISOString(),
            },
            status: "Approved",
          },
        }),
      ]),

      // Performance Data
      Promise.all([
        db.evaluation.count({
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            ratings: {
              some: {
                rating: { gte: 4 },
              },
            },
          },
        }),
        db.evaluation.count({
          where: {
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            ratings: {
              some: {
                rating: { gte: 4 },
              },
            },
          },
        }),
      ]),

      // Attendance Data
      Promise.all([
        db.attendance.count({
          where: {
            date: {
              gte: currentMonthStart.toISOString(),
              lte: currentMonthEnd.toISOString(),
            },
            status: { in: ["Late", "Absent"] },
            Employee: {
              Department: {
                name: "Operation",
              },
            },
          },
        }),
        db.attendance.count({
          where: {
            date: {
              gte: lastMonthStart.toISOString(),
              lte: lastMonthEnd.toISOString(),
            },
            status: { in: ["Late", "Absent"] },
            Employee: {
              Department: {
                name: "Operation",
              },
            },
          },
        }),
      ]),

      // Ticket Data
      Promise.all([
        db.ticket.count({
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            status: "Open",
          },
        }),
        db.ticket.count({
          where: {
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            status: "Open",
          },
        }),
        db.ticket.count({
          where: {
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
            status: "Resolved",
          },
        }),
      ]),
    ]);

    // Destructure results
    const [currentOpsEmployees, lastMonthOpsEmployees] = employeeCounts;
    const [currentMonthShifts, lastMonthShifts] = shiftData;
    const [currentMonthHighPerf, lastMonthHighPerf] = performanceData;
    const [currentMonthAttendanceIssues, lastMonthAttendanceIssues] =
      attendanceData;
    const [
      currentMonthOpenTickets,
      lastMonthOpenTickets,
      currentMonthResolvedTickets,
    ] = ticketData;

    // Calculate differences
    const employeeDiff = calculatePercentageDifference(
      lastMonthOpsEmployees,
      currentOpsEmployees
    );
    const shiftDiff = calculatePercentageDifference(
      lastMonthShifts,
      currentMonthShifts
    );
    const performanceDiff = calculatePercentageDifference(
      lastMonthHighPerf,
      currentMonthHighPerf
    );
    const attendanceDiff = calculatePercentageDifference(
      lastMonthAttendanceIssues,
      currentMonthAttendanceIssues
    );
    const ticketDiff = calculatePercentageDifference(
      lastMonthOpenTickets,
      currentMonthOpenTickets
    );

    // Dynamic recommendation generators
    const getStaffingRecommendation = (diff: number, count: number) => {
      if (diff > 10) return "Growing operations team. Ensure proper training.";
      if (diff < -5) return "Team shrinking. Review workload distribution.";
      return "Team size stable. Monitor workload balance.";
    };

    const getShiftRecommendation = (diff: number, count: number) => {
      if (count > 20) return "High extra shifts. Review staffing needs.";
      if (diff > 15) return "Increasing shift demands. Plan resources.";
      return "Shift coverage adequate.";
    };

    const getPerformanceRecommendation = (highPerf: number, total: number) => {
      const ratio = total > 0 ? (highPerf / total) * 100 : 0;
      if (ratio > 75) return "Excellent performance! Recognize top performers.";
      if (ratio < 50) return "Performance improvement needed. Review training.";
      return "Performance within expected ranges.";
    };

    // Format client distribution for pie chart with dynamic colors
    const clients = await db.client.findMany();
    const clientColors = generateDynamicColors(clientDistribution.length);
    const clientData = clientDistribution.map((client, index) => {
      const clientInfo = clients.find((c) => c.id === client.clientId);
      return {
        name: clientInfo?.name || "Unassigned",
        value: client._count._all,
        color: clientColors[index % clientColors.length],
        formattedValue: `${client._count._all} employees`,
      };
    });

    // Format department distribution for operations teams with dynamic colors
    const opsDepartments = await db.department.findMany({
      where: {
        name: {
          in: ["Production", "Logistics", "Quality Control", "Maintenance"],
        },
      },
    });
    const departmentColors = generateDynamicColors(opsDepartments.length + 1); // +1 for "Other"

    // Fetch performance trends data
    const performanceTrendData = await fetchPerformanceTrendData();
    async function fetchPerformanceTrendData() {
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

          const [highPerf, total] = await Promise.all([
            db.evaluation.count({
              where: {
                createdAt: { gte: monthStart, lte: monthEnd },
                ratings: {
                  some: {
                    rating: { gte: 4 },
                  },
                },
              },
            }),
            db.evaluation.count({
              where: {
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
          ]);

          return {
            date: format(monthStart, "yyyy-MM-dd"),
            highPerformers: highPerf,
            totalEvaluations: total,
            performanceRatio: total > 0 ? (highPerf / total) * 100 : 0,
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
          name: "Operations",
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
                title="Operations Staff"
                data={currentOpsEmployees.toString()}
                trend={getTrend(employeeDiff)}
                percentage={formatPercentage(employeeDiff)}
                description="Compared to last month"
                recommendation={getStaffingRecommendation(
                  employeeDiff,
                  currentOpsEmployees
                )}
              />
              <SummaryCard
                title="Extra Shifts"
                data={currentMonthShifts.toString()}
                trend={getTrend(shiftDiff)}
                percentage={formatPercentage(shiftDiff)}
                description="Approved this month"
                recommendation={getShiftRecommendation(
                  shiftDiff,
                  currentMonthShifts
                )}
              />
              <SummaryCard
                title="High Performers"
                data={currentMonthHighPerf.toString()}
                trend={getTrend(performanceDiff)}
                percentage={formatPercentage(performanceDiff)}
                description="Rated 4+ stars"
                recommendation={getPerformanceRecommendation(
                  currentMonthHighPerf,
                  currentMonthHighPerf + 10
                )}
              />
              <SummaryCard
                title="Ticket Status"
                data={`${currentMonthOpenTickets} open / ${currentMonthResolvedTickets} resolved`}
                trend={getTrend(ticketDiff)}
                percentage={formatPercentage(ticketDiff)}
                description="This month"
                recommendation={
                  currentMonthOpenTickets > 10
                    ? "High open tickets. Prioritize resolution."
                    : "Ticket volume normal."
                }
              />
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="lg:col-span-3">
                <Chart
                  data={performanceTrendData}
                  config={{
                    highPerformers: {
                      label: "High Performers",
                      color: "hsl(var(--success))",
                    },
                    performanceRatio: {
                      label: "Performance Ratio (%)",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  title="Performance Trends"
                  description="Monthly high performer evaluations"
                />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <PieChartComponent
                  title="Employee Distribution by Client"
                  description="Operations staff assigned to clients"
                  data={clientData}
                />
              </div>
            </div>

            <RecentDatatableActions
              title="Recent Operations Activities"
              description="All recent operations activities"
              data={formattedRecentLogs}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading operations dashboard:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Dashboard Loading Failed</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load the operations data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default OperationsDashboard;

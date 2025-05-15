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

const HRDashboard = async () => {
  // Date ranges
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  try {
    // Fetch all HR data in parallel
    const [
      employeeCounts,
      genderDistribution,
      departmentDistribution,
      leaveData,
      newHiresData,
      attendanceData,
    ] = await Promise.all([
      // Total Employees Count
      Promise.all([
        db.employee.count(),
        db.employee.count({ where: { createdAt: { lte: lastMonthEnd } } }),
      ]),

      // Gender Distribution
      db.employee.groupBy({
        by: ["sex"],
        _count: {
          _all: true,
        },
      }),

      // Department Distribution
      db.employee.groupBy({
        by: ["departmentId"],
        _count: {
          _all: true,
        },
        _max: {
          createdAt: true,
        },
      }),

      // Leave Management Data
      Promise.all([
        db.leaveManagement.count({
          where: {
            status: "Pending",
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        }),
        db.leaveManagement.count({
          where: {
            status: "Approved",
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        }),
        db.leaveManagement.count({
          where: {
            status: "Pending",
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          },
        }),
      ]),

      // New Hires Data
      Promise.all([
        db.employee.count({
          where: {
            isNewEmployee: true,
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        }),
        db.employee.count({
          where: {
            isNewEmployee: true,
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          },
        }),
      ]),

      // Attendance Data
      Promise.all([
        db.attendance.count({
          where: {
            status: "Late",
            date: {
              gte: format(currentMonthStart, "MMMM dd, yyyy"),
              lte: format(currentMonthEnd, "MMMM dd, yyyy"),
            },
          },
        }),
        db.attendance.count({
          where: {
            status: "Absent",
            date: {
              gte: format(currentMonthStart, "MMMM dd, yyyy"),
              lte: format(currentMonthEnd, "MMMM dd, yyyy"),
            },
          },
        }),
        db.attendance.count({
          where: {
            status: "Late",
            date: {
              gte: format(lastMonthStart, "MMMM dd, yyyy"),
              lte: format(lastMonthEnd, "MMMM dd, yyyy"),
            },
          },
        }),
      ]),
    ]);

    // Destructure results
    const [currentEmployeeCount, lastMonthEmployeeCount] = employeeCounts;
    const [pendingLeaves, approvedLeaves, lastMonthPendingLeaves] = leaveData;
    const [currentMonthNewHires, lastMonthNewHires] = newHiresData;
    const [currentMonthLate, currentMonthAbsent, lastMonthLate] =
      attendanceData;

    // Calculate differences
    const employeeDiff = calculatePercentageDifference(
      lastMonthEmployeeCount,
      currentEmployeeCount
    );
    const leaveDiff = calculatePercentageDifference(
      lastMonthPendingLeaves,
      pendingLeaves
    );
    const newHireDiff = calculatePercentageDifference(
      lastMonthNewHires,
      currentMonthNewHires
    );
    const lateDiff = calculatePercentageDifference(
      lastMonthLate,
      currentMonthLate
    );

    // Dynamic recommendation generators
    const getEmployeeRecommendation = (diff: number, count: number) => {
      if (diff > 15)
        return "Rapid headcount growth. Review onboarding process.";
      if (diff > 5) return "Steady growth. Ensure proper onboarding.";
      if (diff < -5) return "Headcount decreasing. Review attrition.";
      return "Headcount stable. Maintain current HR processes.";
    };

    const getLeaveRecommendation = (pending: number, approved: number) => {
      const approvalRate = (approved / (pending + approved)) * 100;
      if (pending > 20) return "High leave requests. Prioritize approvals.";
      if (approvalRate < 50) return "Low approval rate. Review leave policies.";
      return "Leave management operating normally.";
    };

    const getAttendanceRecommendation = (late: number, absent: number) => {
      if (late > 15) return "High tardiness. Consider flexible hours.";
      if (absent > 10) return "High absenteeism. Check employee wellbeing.";
      return "Attendance within normal ranges.";
    };

    // Fetch department names and format for pie chart
    const departments = await db.department.findMany();
    const departmentData = departmentDistribution.map((dept) => {
      const department = departments.find((d) => d.id === dept.departmentId);
      return {
        name: department?.name || "Unknown Department",
        value: dept._count._all,
        color: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`,
        formattedValue: `${dept._count._all} employees`,
        lastHireDate: dept._max.createdAt,
      };
    });

    // Fetch leave trends data
    const leaveTrendData = await fetchLeaveTrendData();
    async function fetchLeaveTrendData() {
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

          const [pending, approved] = await Promise.all([
            db.leaveManagement.count({
              where: {
                status: "Pending",
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
            db.leaveManagement.count({
              where: {
                status: "Approved",
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
          ]);

          return {
            date: format(monthStart, "yyyy-MM-dd"),
            pendingLeaves: pending,
            approvedLeaves: approved,
            approvalRate: (approved / (pending + approved)) * 100 || 0,
          };
        })
      );

      return results.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    // Recent HR activities
    const recentLogs = await db.logs.findMany({
      where: {
        department: {
          name: "HR",
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
                title="Total Employees"
                data={currentEmployeeCount.toString()}
                trend={getTrend(employeeDiff)}
                percentage={formatPercentage(employeeDiff)}
                description="Compared to last month"
                recommendation={getEmployeeRecommendation(
                  employeeDiff,
                  currentEmployeeCount
                )}
              />
              <SummaryCard
                title="Pending Leave Requests"
                data={pendingLeaves.toString()}
                trend={getTrend(leaveDiff)}
                percentage={formatPercentage(leaveDiff)}
                description={`${approvedLeaves} approved this month`}
                recommendation={getLeaveRecommendation(
                  pendingLeaves,
                  approvedLeaves
                )}
              />
              <SummaryCard
                title="New Hires"
                data={currentMonthNewHires.toString()}
                trend={getTrend(newHireDiff)}
                percentage={formatPercentage(newHireDiff)}
                description="This month"
                recommendation={
                  newHireDiff > 0
                    ? `Growing team (+${newHireDiff}%). Ensure smooth onboarding.`
                    : "Monitor hiring pipeline."
                }
              />
              <SummaryCard
                title="Attendance Issues"
                data={`${currentMonthLate} late`}
                trend={getTrend(lateDiff)}
                percentage={formatPercentage(lateDiff)}
                description="This month"
                recommendation={getAttendanceRecommendation(
                  currentMonthLate,
                  currentMonthAbsent
                )}
              />
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="lg:col-span-3">
                <Chart
                  data={leaveTrendData}
                  config={{
                    pendingLeaves: {
                      label: "Pending Leaves",
                      color: "hsl(var(--warning))",
                    },
                    approvedLeaves: {
                      label: "Approved Leaves",
                      color: "hsl(var(--success))",
                    },
                    approvalRate: {
                      label: "Approval Rate (%)",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  title="Leave Management Trends"
                  description="Monthly leave requests and approvals"
                />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <PieChartComponent
                  title="Department Distribution"
                  description="Employees by department"
                  data={departmentData}
                />
              </div>
            </div>

            <RecentDatatableActions
              title="Recent HR Activities"
              description="All the recent HR activities will be displayed here."
              data={formattedRecentLogs}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading HR dashboard:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Dashboard Loading Failed</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load the HR data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default HRDashboard;

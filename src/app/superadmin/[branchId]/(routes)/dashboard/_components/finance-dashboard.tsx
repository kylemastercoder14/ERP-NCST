/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import SummaryCard from "@/components/global/summary-card";
import db from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import {
  calculatePercentageDifference,
  formatPercentage,
  getTrend,
  formatCurrency,
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

const FinanceDashboard = async ({ branchId }: { branchId: string }) => {
  // Date ranges
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  try {
    // Fetch all financial data in parallel
    const [
      incomeData,
      expenseData,
      accountBalances,
      transactionTypeData,
      unpaidInvoices,
      cashFlowData,
      recentTransactions,
      expenseByCategory,
      incomeByCategory,
    ] = await Promise.all([
      // Income Data (CREDIT transactions with INCOME account type)
      Promise.all([
        db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            type: "CREDIT",
            branchId,
            accountType: "INCOME",
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        }),
        db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            type: "CREDIT",
            branchId,
            accountType: "INCOME",
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          },
        }),
      ]),

      // Expense Data (DEBIT transactions with EXPENSE account type)
      Promise.all([
        db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            type: "DEBIT",
            branchId,
            accountType: "EXPENSE",
            createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        }),
        db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            type: "DEBIT",
            branchId,
            accountType: "EXPENSE",
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          },
        }),
      ]),

      // Account Balances
      Promise.all([
        // Assets (DEBIT - CREDIT)
        db.transaction.aggregate({
          _sum: { amount: true },
          where: { accountType: "ASSET", branchId, type: "DEBIT" },
        }),
        db.transaction.aggregate({
          _sum: { amount: true },
          where: { accountType: "ASSET", branchId, type: "CREDIT" },
        }),
        // Liabilities (CREDIT - DEBIT)
        db.transaction.aggregate({
          _sum: { amount: true },
          where: { accountType: "LIABILITY", branchId, type: "CREDIT" },
        }),
        db.transaction.aggregate({
          _sum: { amount: true },
          where: { accountType: "LIABILITY", branchId, type: "DEBIT" },
        }),
      ]),

      // Transaction Type Distribution
      db.transaction.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
        where: {
          branchId,
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
      }),

      // Unpaid Invoices (both client and supplier)
      Promise.all([
        db.transaction.count({
          where: {
            status: "Unpaid",
            branchId,
            clientId: { not: null },
          },
        }),
        db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            status: "Unpaid",
            branchId,
            clientId: { not: null },
          },
        }),
        db.transaction.count({
          where: {
            status: "Unpaid",
            branchId,
            supplierId: { not: null },
          },
        }),
        db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            status: "Unpaid",
            branchId,
            supplierId: { not: null },
          },
        }),
      ]),

      // Cash Flow Data for chart
      db.transaction.groupBy({
        by: ["accountType"],
        _sum: {
          amount: true,
        },
        where: {
          branchId,
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
      }),

      // Recent Transactions
      db.transaction.findMany({
        take: 5,
        where: {
          branchId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Client: {
            select: { name: true },
          },
          Supplier: {
            select: { name: true },
          },
        },
      }),

      // Expense by Category
      db.transaction.groupBy({
        by: ["subAccountType"],
        _sum: {
          amount: true,
        },
        where: {
          accountType: "EXPENSE",
          branchId,
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
      }),

      // Income by Category
      db.transaction.groupBy({
        by: ["subAccountType"],
        _sum: {
          amount: true,
        },
        where: {
          accountType: "INCOME",
          branchId,
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
      }),
    ]);

    // Destructure results
    const [currentMonthIncome, lastMonthIncome] = incomeData;
    const [currentMonthExpense, lastMonthExpense] = expenseData;
    const [assetDebits, assetCredits, liabilityCredits, liabilityDebits] =
      accountBalances;
    const [
      unpaidClientInvoicesCount,
      unpaidClientInvoicesAmount,
      unpaidSupplierInvoicesCount,
      unpaidSupplierInvoicesAmount,
    ] = unpaidInvoices;

    // Calculate financial metrics
    const currentIncome = currentMonthIncome._sum.amount || 0;
    const lastIncome = lastMonthIncome._sum.amount || 0;
    const incomeDiff = calculatePercentageDifference(lastIncome, currentIncome);

    const currentExpense = currentMonthExpense._sum.amount || 0;
    const lastExpense = lastMonthExpense._sum.amount || 0;
    const expenseDiff = calculatePercentageDifference(
      lastExpense,
      currentExpense
    );

    const profit = currentIncome - currentExpense;
    const lastProfit = lastIncome - lastExpense;
    const profitDiff = calculatePercentageDifference(lastProfit, profit);

    // Calculate account balances
    const assets =
      (assetDebits._sum.amount || 0) - (assetCredits._sum.amount || 0);
    const liabilities =
      (liabilityCredits._sum.amount || 0) - (liabilityDebits._sum.amount || 0);
    const equity = assets - liabilities;

    // Calculate unpaid amounts
    const unpaidClientAmount = unpaidClientInvoicesAmount._sum.amount || 0;
    const unpaidSupplierAmount = unpaidSupplierInvoicesAmount._sum.amount || 0;

    // Format transaction type data for pie chart
    const transactionTypeColors = generateDynamicColors(
      transactionTypeData.length
    );
    const transactionTypeChartData = transactionTypeData.map((type, index) => ({
      name: type.type,
      value: type._sum.amount || 0,
      color: transactionTypeColors[index % transactionTypeColors.length],
      formattedValue: formatCurrency(type._sum.amount || 0),
    }));

    // Format expense by category data for pie chart
    const expenseColors = generateDynamicColors(expenseByCategory.length);
    const expenseChartData = expenseByCategory.map((expense, index) => ({
      name: expense.subAccountType || "Uncategorized",
      value: expense._sum.amount || 0,
      color: expenseColors[index % expenseColors.length],
      formattedValue: formatCurrency(expense._sum.amount || 0),
    }));

    // Format income by category data for pie chart
    const incomeColors = generateDynamicColors(incomeByCategory.length);
    const incomeChartData = incomeByCategory.map((income, index) => ({
      name: income.subAccountType || "Uncategorized",
      value: income._sum.amount || 0,
      color: incomeColors[index % incomeColors.length],
      formattedValue: formatCurrency(income._sum.amount || 0),
    }));

    // Fetch financial trends data
    const financialTrendData = await fetchFinancialTrendData();
    async function fetchFinancialTrendData() {
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

          const [income, expense] = await Promise.all([
            db.transaction.aggregate({
              _sum: { amount: true },
              where: {
                type: "CREDIT",
                branchId,
                accountType: "INCOME",
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
            db.transaction.aggregate({
              _sum: { amount: true },
              where: {
                type: "DEBIT",
                branchId,
                accountType: "EXPENSE",
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
          ]);

          return {
            date: format(monthStart, "yyyy-MM-dd"),
            income: income._sum.amount || 0,
            expense: expense._sum.amount || 0,
            profit: (income._sum.amount || 0) - (expense._sum.amount || 0),
          };
        })
      );

      return results.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    const recentLogs = await db.logs.findMany({
      where: {
        department: {
          name: "Finance",
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

    // Dynamic recommendation generators
    const getIncomeRecommendation = (diff: number, amount: number) => {
      if (diff > 15) return "Revenue growing. Consider reinvesting profits.";
      if (diff < -10) return "Revenue declining. Review sales strategies.";
      return "Revenue stable. Look for growth opportunities.";
    };

    const getExpenseRecommendation = (diff: number, amount: number) => {
      if (diff > 15) return "Expenses increasing. Review cost controls.";
      if (diff < -10) return "Expenses decreasing. Maintain cost discipline.";
      return "Expenses stable. Monitor for inefficiencies.";
    };

    const getProfitRecommendation = (amount: number, diff: number) => {
      if (amount < 0) return "Operating at a loss. Immediate action required.";
      if (diff < -10) return "Profit declining. Review operations.";
      if (diff > 10) return "Profit growing. Consider expansion.";
      return "Profit stable. Optimize operations.";
    };

    const getReceivablesRecommendation = (count: number, amount: number) => {
      if (amount > 10000)
        return "High receivables. Improve collection process.";
      if (count > 20)
        return "Many outstanding invoices. Follow up with clients.";
      return "Receivables under control. Maintain collection efforts.";
    };

    const getPayablesRecommendation = (count: number, amount: number) => {
      if (amount > 10000) return "High payables. Review payment terms.";
      if (count > 15) return "Many unpaid bills. Prioritize vendor payments.";
      return "Payables under control. Maintain good vendor relationships.";
    };

    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
              <SummaryCard
                title="Total Income"
                data={formatCurrency(currentIncome)}
                trend={getTrend(incomeDiff)}
                percentage={formatPercentage(incomeDiff)}
                description="This month's revenue"
                recommendation={getIncomeRecommendation(
                  incomeDiff,
                  currentIncome
                )}
              />
              <SummaryCard
                title="Total Expenses"
                data={formatCurrency(currentExpense)}
                trend={getTrend(expenseDiff)}
                percentage={formatPercentage(expenseDiff)}
                description="This month's expenses"
                recommendation={getExpenseRecommendation(
                  expenseDiff,
                  currentExpense
                )}
              />
              <SummaryCard
                title="Net Profit"
                data={formatCurrency(profit)}
                trend={getTrend(profitDiff)}
                percentage={formatPercentage(profitDiff)}
                description="Income minus expenses"
                recommendation={getProfitRecommendation(profit, profitDiff)}
              />
              <SummaryCard
                title="Assets"
                data={formatCurrency(assets)}
                percentage="0"
                trend="neutral"
                description="Total company assets"
                recommendation={
                  assets > liabilities
                    ? "Healthy asset position"
                    : "Assets lower than liabilities"
                }
              />
              <SummaryCard
                title="Liabilities"
                data={formatCurrency(liabilities)}
                percentage="0"
                trend="neutral"
                description="Total company liabilities"
                recommendation={
                  liabilities < assets
                    ? "Manageable liabilities"
                    : "Liabilities exceed assets"
                }
              />
              <SummaryCard
                title="Equity"
                data={formatCurrency(equity)}
                percentage="0"
                trend="neutral"
                description="Assets minus liabilities"
                recommendation={
                  equity > 0
                    ? "Positive equity position"
                    : "Negative equity - review finances"
                }
              />
              <SummaryCard
                title="Client Receivables"
                data={`${unpaidClientInvoicesCount} (${formatCurrency(unpaidClientAmount)})`}
                percentage="0"
                trend="neutral"
                description="Unpaid client invoices"
                recommendation={getReceivablesRecommendation(
                  unpaidClientInvoicesCount,
                  unpaidClientAmount
                )}
              />
              <SummaryCard
                title="Supplier Payables"
                data={`${unpaidSupplierInvoicesCount} (${formatCurrency(unpaidSupplierAmount)})`}
                percentage="0"
                trend="neutral"
                description="Unpaid supplier invoices"
                recommendation={getPayablesRecommendation(
                  unpaidSupplierInvoicesCount,
                  unpaidSupplierAmount
                )}
              />
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="lg:col-span-3">
                <Chart
                  data={financialTrendData}
                  config={{
                    income: {
                      label: "Income",
                      color: "#10B981", // emerald-500
                    },
                    expense: {
                      label: "Expenses",
                      color: "#EF4444", // red-500
                    },
                    profit: {
                      label: "Profit",
                      color: "#3B82F6", // blue-500
                    },
                  }}
                  title="Financial Trends"
                  description="Monthly income, expenses, and profit"
                />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <PieChartComponent
                  title="Expense Categories"
                  description="Current month expenses by category"
                  data={expenseChartData}
                />
              </div>
            </div>

            <RecentDatatableActions
              title="Recent Financial Transactions"
              description="All recent financial activities"
              data={formattedRecentLogs}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading Finance dashboard:", error);
    return <DashboardSkeleton />;
  }
};

export default FinanceDashboard;

import { Injectable } from '@angular/core';
import { MoneyTrackrDatabaseService } from './moneytrackrsqlite.service';
import { Transaction, TransactionGroup } from './models';

@Injectable()
export class DatabaseService {

  constructor(private dbService: MoneyTrackrDatabaseService) { }
  async getSummary(month: string, year: string): Promise<any> {
    const datestring = `${year}-${month}-01`;

    const sql = `-- Define variables with a test date
            WITH DateVariables AS (
              SELECT
                date('${datestring}') AS TestDate, -- Set your test date here
                date('${datestring}', 'start of month') AS FirstDayOfMonth,
                date('${datestring}', 'start of month', '+1 month', '-1 day') AS LastDayOfMonth
            ),
            -- Extract transactions within the month
            MonthlyTransactions AS (
              SELECT *
              FROM "Transaction"
              WHERE date(Date) BETWEEN (SELECT FirstDayOfMonth FROM DateVariables) AND (SELECT LastDayOfMonth FROM DateVariables)
                AND (Purpose = 1 OR Purpose = 2) -- Assuming 1 is for Expense and 2 is for Income
            ),
            -- Calculate monthly expense and income
            MonthlySummary AS (
              SELECT
                'Monthly' AS display,
                'monthly' AS key,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 2 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS expense,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 1 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS income
              FROM MonthlyTransactions
            ),
            -- Extract today's transactions
            TodayTransactions AS (
              SELECT *
              FROM "Transaction"
              WHERE date(Date) = (SELECT TestDate FROM DateVariables)
                AND (Purpose = 1 OR Purpose = 2)
            ),
            -- Calculate today's expense and income
            TodaySummary AS (
              SELECT
                'Today' AS display,
                'today' AS key,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 2 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS expense,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 1 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS income
              FROM TodayTransactions
            )
            -- Combine results
            SELECT * FROM MonthlySummary
            UNION ALL
            SELECT * FROM TodaySummary;`;

    return this.dbService.fetchRecordsUsingSQL(sql);
  }

  async getTransactionRecent(startDate: string, endDate: string): Promise<TransactionGroup[]> {
    const sql = `
          SELECT 
              t.Id as id,
              CASE t.Purpose WHEN 2 THEN t.Amount WHEN 1 THEN (t.Amount * -1) END as amount,
              t.Remarks as remarks,
              t.Date as date,
              c.Id as categoryId,
              c.Icon as categoryIcon,
              c.IconOutline as categoryIconOutline,
              c.Color as categoryColor,
              c.Name as categoryName,
              1 as categoryOrder,
              a.Id as accountId,
              a.Name as accountName,
              1 as accountOrder,
              1 as merchantId,
              t.Beneficiary as merchantName,
              CASE t.Purpose WHEN 2 THEN 'income' WHEN 1 THEN 'expense' END as purpose
          FROM "Transaction" t
          LEFT JOIN "Category" c ON t.CategoryId = c.Id
          LEFT JOIN "Account" a ON t.AccountId = a.Id
          WHERE t.Date BETWEEN ? AND ?
          AND (t.Purpose = '2' OR t.Purpose = '1')
          ORDER BY t.Date DESC;`;

    const result = await this.dbService.fetchRecordsUsingSQL(sql, [startDate, endDate])
    // Map the result to Transaction objects
    const transactions: Transaction[] = result.map((row) => ({
      id: row.id.toString(),
      amount: row.amount,
      remarks: row.remarks,
      date: row.date,
      purpose: row.purpose,
      category: {
        id: row.categoryId.toString(),
        icon: row.categoryIcon,
        iconOutline: row.categoryIconOutline,
        color: row.categoryColor,
        name: row.categoryName,
        order: row.categoryOrder
      },
      account: {
        id: row.accountId.toString(),
        name: row.accountName,
        order: row.accountOrder
      },
      merchant: row.merchantId ? {
        id: row.merchantId.toString(),
        name: row.merchantName
      } : null
    }));

    // Group the transactions by date
    const transactionGroups: { [key: string]: Transaction[] } = transactions.reduce((groups: { [key: string]: Transaction[] }, transaction: Transaction) => {
      const dateKey = new Date(transaction.date).toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      return groups;
    }, {} as { [key: string]: Transaction[] });

    // Format the result as TransactionGroup objects
    const groupedResult: TransactionGroup[] = Object.keys(transactionGroups).map((key) => ({
      key: key,
      display: key,
      transactions: transactionGroups[key]
    }));

    return groupedResult;

  }
}

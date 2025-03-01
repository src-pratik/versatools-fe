import { Injectable } from '@angular/core';
import { MoneyTrackrDatabaseService } from './moneytrackrsqlite.service';

@Injectable()
export class DatabaseService {

  constructor(private dbService: MoneyTrackrDatabaseService) { }

  async getSummary(month: string, year: string): Promise<any> {
    const datestring = `${year}-${month}-01`;

    const sql = `-- Define variables with a test date
            WITH DateVariables AS (
              SELECT
                date(${datestring}) AS TestDate, -- Set your test date here
                date(${datestring}, 'start of month') AS FirstDayOfMonth,
                date(${datestring}, 'start of month', '+1 month', '-1 day') AS LastDayOfMonth
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
                'Monthly' AS Display,
                'monthly' AS Key,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 2 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS Expense,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 1 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS Income
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
                'Today' AS Display,
                'today' AS Key,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 2 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS Expense,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 1 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS Income
              FROM TodayTransactions
            )
            -- Combine results
            SELECT * FROM MonthlySummary
            UNION ALL
            SELECT * FROM TodaySummary;`;

    return this.dbService.fetchRecordsUsingSQL(sql);
  }

}

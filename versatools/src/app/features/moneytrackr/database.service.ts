import { Injectable } from '@angular/core';
import { MoneyTrackrDatabaseService } from './moneytrackrsqlite.service';
import { Account, Category, Expense, ExpenseViewModel, ReportCategoryGroupedRow, ReportCategoryGroupedViewModel, Transaction, TransactionGroup, TransactionSummary } from './models';
import { Observable, of } from 'rxjs';
import { Transaction as dbTransaction } from './dbmodel'
@Injectable()
export class DatabaseService {
  enableLogs: boolean = false;
  categories: Category[] | null = null;
  private accounts: Account[] | null = null;

  constructor(private dbService: MoneyTrackrDatabaseService) { }

  async getAccounts(refresh: boolean = false): Promise<Account[] | null> {
    // If cached data exists and refresh is not requested, return cached accounts
    if (this.accounts && !refresh) {
      return this.accounts;
    }

    // Fetch from database
    const sql = `SELECT Id AS id, Name AS name, 1 AS "order" FROM "Account" WHERE Status = 1`;
    const result = await this.dbService.fetchRecordsUsingSQL(sql);
    this.accounts = result.map((row: any) => ({
      id: row.id.toString(),
      name: row.name,
      order: row.order,
    }));
    return this.accounts;

  }

  async getExpense(expenseId: string): Promise<Expense | null> {
    if (expenseId === '')
      return null;

    const sql = `
        SELECT 
          t.Id AS id, 
          t.Amount AS amount, 
          t.Remarks AS remarks, 
          t.Date AS date, 
          'Expense' AS purpose, 
          c.Id AS categoryId, 
          c.Name AS categoryName, 
          c.Icon AS categoryIcon, 
          c.IconOutline AS categoryIconOutline, 
          c.Color AS categoryColor, 
          a.Id AS accountId, 
          a.Name AS accountName, 
          1 AS accountOrder, 
          1 AS merchantId, 
          t.Beneficiary AS merchantName
        FROM "Transaction" t
        LEFT JOIN "Category" c ON t.CategoryId = c.Id
        LEFT JOIN "Account" a ON t.AccountId = a.Id
        WHERE t.Id = ? 
        LIMIT 1;
      `;

    const results = await this.dbService.fetchRecordsUsingSQL(sql, [expenseId]);

    if (!results || results.length === 0) {
      return null; // Return null if no matching record is found
    }

    const result = results[0]; // Get the first matching transaction

    return {
      id: result.id,
      amount: parseFloat(result.amount),
      remarks: result.remarks || '',
      date: new Date(result.date).toISOString(),
      purpose: result.purpose,
      category: result.categoryId
        ? {
          id: String(result.categoryId),
          name: result.categoryName,
          icon: result.categoryIcon,
          iconOutline: result.categoryIconOutline,
          color: result.categoryColor,
          order: 0, // Assuming order is not required from DB
        }
        : null,
      account: result.accountId
        ? {
          id: String(result.accountId),
          name: result.accountName,
          order: result.accountOrder,
        }
        : null,
      merchant: result.merchantId
        ? {
          id: result.merchantId,
          name: result.merchantName,
        }
        : null,
    };

  }


  async insertTransaction(expense: Expense): Promise<any> {
    const insertSql = `
    INSERT INTO "Transaction" 
    ("Amount", "Remarks", "Date", "CategoryId", "AccountId", "Purpose", "Status", "CreateDate", "UpdatedOn", "UserId") 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const insertValues = [
      expense.amount,
      expense.remarks ?? null,
      expense.date, // Ensure this is in 'YYYY-MM-DD' format
      expense.category?.id ?? null,
      expense.account?.id ?? null,
      toPurpose(expense.purpose),
      1, // Assuming 1 means 'Active' status
      new Date().toISOString(), // CreateDate
      new Date().toISOString(), // UpdatedOn
      null
    ];

    // Execute the insert query
    return await this.dbService.runQuery(insertSql, insertValues);
  }

  async updateTransaction(expense: Expense): Promise<any> {
    const updateSql = `
    UPDATE "Transaction"
    SET "Amount" = ?,
        "Remarks" = ?,
        "Date" = ?,
        "CategoryId" = ?,
        "AccountId" = ?,
        "Purpose" = ?,
        "Status" = ?,      
        "UpdatedOn" = ?
    WHERE "Id" = ?`;

    const updateValues = [
      expense.amount,
      expense.remarks ?? null,
      expense.date, // Ensure this is in 'YYYY-MM-DD' format
      expense.category?.id ?? null,
      expense.account?.id ?? null,
      toPurpose(expense.purpose),
      1, // Assuming 1 means 'Active' status
      new Date().toISOString(), // UpdatedOn
      expense.id // Assuming Id is the unique identifier
    ];

    // Execute the update query
    return await this.dbService.runQuery(updateSql, updateValues);
  }

  async saveTransaction(expense: Expense): Promise<any | null> {
    if (typeof expense.id === "string" && expense.id.trim().length > 0) {
      // Call updateTransaction if the expense has a valid non-empty string id
      return await this.updateTransaction(expense);
    } else if (typeof expense.id === "number" && expense.id > 0) {
      // Handle case if id is a number and greater than 0
      return await this.updateTransaction(expense);
    } else {
      // Call insertTransaction if the expense doesn't have a valid id
      return await this.insertTransaction(expense);
    }
  }

  async getSummaryForMonthAndToday(month: string, year: string): Promise<any> {
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

  async getSummaryForMonth(month: string, year: string, category?: string | null): Promise<TransactionSummary[]> {
    const datestring = `${year}-${month}-01`;

    let categoryCondition = '';
    if (category) {
      categoryCondition = `AND CategoryId = '${category}'`;
    }

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
                ${categoryCondition} -- Category filter if provided
            ),
            -- Calculate monthly expense and income
            MonthlySummary AS (
              SELECT
                'Monthly' AS display,
                'monthly' AS key,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 2 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS expense,
                COALESCE(SUM(CASE WHEN CreditOrDebit = 1 THEN CAST(Amount AS REAL) ELSE 0 END), 0) AS income
              FROM MonthlyTransactions
            )            
            SELECT * FROM MonthlySummary`;

    // Fetch records from the database
    const summaryData = await this.dbService.fetchRecordsUsingSQL(sql);

    // Map the fetched data to TransactionSummary properties
    const summary: TransactionSummary = {
      display: summaryData[0]?.display || '',
      key: summaryData[0]?.key || '',
      expense: summaryData[0]?.expense || 0,
      income: summaryData[0]?.income || 0
    };

    return [summary];
  }

  async getTransactionsForDuration(startDate: string, endDate: string, category?: string | null): Promise<TransactionGroup[]> {
    let categoryCondition = '';
    if (category) {
      categoryCondition = `AND c.Id = '${category}'`;
    }

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
          WHERE t.Date BETWEEN ? AND ? ${categoryCondition}
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

  public async getCategoryLookup(refresh: boolean = false): Promise<Category[]> {
    if (this.categories && !refresh) {
      if (this.enableLogs) {
        console.log('getCategoryLookup cached data found');
      }
      return this.categories;
    }

    const result = await this.dbService.fetchRecords('category');
    this.categories = (result || []).map((row) => ({
      id: row.Id.toString(),
      icon: row.Icon,
      iconOutline: row.IconOutline,
      color: row.Color,
      name: row.Name,
      order: row.Order
    } as Category));

    return this.categories;

  }

  public async getMonthlyExpenseReport(month: string, year: string): Promise<ReportCategoryGroupedViewModel> {
    const datestring = `${year}-${month}-01`;

    const sql = `WITH 
    DateVariables AS (
          SELECT 
              date('${datestring}') AS TestDate, 
              date('${datestring}', 'start of month') AS FirstDayOfMonth,
              date('${datestring}', 'start of month', '+1 month', '-1 day') AS LastDayOfMonth),
    Summary AS (
        SELECT 
            SUM(t.Amount) AS amount, 
            t.CategoryId AS categoryId
        FROM "Transaction" AS t
        WHERE date(t.Date) 
            BETWEEN (SELECT FirstDayOfMonth FROM DateVariables) 
                AND (SELECT LastDayOfMonth FROM DateVariables)
            AND t.Purpose = '1'
        GROUP BY t.CategoryId)

    SELECT 
        s.amount AS amount, 
        c.Id AS id, 
        c.Icon AS icon, 
        c.color AS color, 
        c.name AS name, 
        c.status AS status, 
        c.purpose AS purpose, 
        c.IconOutline AS iconOutline  
    FROM Summary AS s
    LEFT JOIN "Category" AS c ON s.categoryId = c.Id;`;

    const reportData = await this.dbService.fetchRecordsUsingSQL(sql);

    // Transform SQL results into `ReportCategoryGroupedRow`
    const rows: ReportCategoryGroupedRow[] = reportData.map((item: any) => ({
      value: item.amount ?? 0, // Ensure value is never null
      category: {
        id: item.id,
        name: item.name,
        icon: item.icon,
        iconOutline: item.iconOutline,
        color: item.color,
        order: 1
      } as Category
    }));

    // Construct the final report model
    return {
      rows,
      header: "Expense Summary",
      subheader: new Date(datestring).toLocaleString('default', { month: 'long', year: 'numeric' }),
      showHeader: true,
      showSubHeader: true,
      showTotal: true,
      total: rows.reduce((sum, row) => sum + (row.value ?? 0), 0)
    };
  }

  public async addTransaction(transaction: dbTransaction): Promise<boolean> {

    // Step 1: Check by Transaction ID
    if (transaction.transactionId) {
      const queryById = 'SELECT id FROM "Transaction" WHERE transactionId = ?;';
      const resultById = await this.dbService.fetchRecordsUsingSQL(queryById, [transaction.transactionId]);
      if (resultById.length > 0) return false;
    }

    // Step 2: Check by Date (date part only), Amount, and Beneficiary
    if (transaction.date && transaction.amount && transaction.beneficiary) {
      const queryByDetails =
        'SELECT id FROM "Transaction" WHERE DATE(date) = DATE(?) AND amount = ? AND beneficiary = ?;';
      const values = [
        transaction.date, // Convert date to "YYYY-MM-DD"
        transaction.amount,
        transaction.beneficiary,
      ];
      const resultByDetails = await this.dbService.fetchRecordsUsingSQL(queryByDetails, values);
      if (resultByDetails.length > 0) return true;
    }

    await this.dbService.addRecord("Transaction", transaction);

    return true;
  }
}

function toPurpose(input: string): string {
  if (input === "Income") {
    return "2"; // Output 2 for Income
  } else if (input === "Expense") {
    return "1"; // Output 1 for Expense
  }
  throw new Error("Invalid purpose value.");
}

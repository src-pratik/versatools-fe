export interface Transaction {
  id?: number; // Unique identifier for the transaction
  amount?: number; // Transaction amount
  remarks?: string; // Optional remarks or notes about the transaction
  beneficiary?: string; // The beneficiary of the transaction
  account?: string; // Account associated with the transaction
  transactionId?: string; // Optional unique transaction ID
  source?: string; // Source of the transaction
  date?: string; // Date of the transaction
  creditOrDebit?: CreditOrDebitType; // Indicates if it's a credit or debit transaction
  purpose?: PurposeType; // Optional purpose of the transaction
  categoryId?: number; // Foreign key for the category
  category?: Category; // Optional category details (if joined with category table)
  accountId?: number; // Foreign key for the account
  accountDetails?: Account; // Optional account details (if joined with account table)
  status?: RecordStatusType; // Status of the record (e.g., Active, Deleted)
  createDate?: string; // Creation timestamp
  updatedOn?: string; // Optional updated timestamp
  userId?: string; // ID of the user associated with this transaction
}

// Supporting Constants
export const CreditOrDebit = {
  Credit: 1,
  Debit: 2,
} as const;

export type CreditOrDebitType = typeof CreditOrDebit[keyof typeof CreditOrDebit];

export const Purpose = {
  Expense: 1,
  Income: 2,
  Investment: 3,
  Loan: 4,
} as const;

export type PurposeType = typeof Purpose[keyof typeof Purpose];

export const RecordStatus = {
  Active: 1,
  Deleted: 2,
} as const;

export type RecordStatusType = typeof RecordStatus[keyof typeof RecordStatus];

// Example Category and Account Models (optional based on usage)
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  purpose: PurposeType;
}

export interface Account {
  id: number;
  name: string;
  status: RecordStatusType;
}

export interface TransactionSummary {
    key: string,
    display: string,
    income: string,
    expense: string
}

export interface TransactionGroup {

    key: string,
    display: string,
    transactions: Transaction[]
}

export interface Transaction {

    id: string,
    category: Category,
    merchant: Merchant | null,
    remarks: string,
    account: Account,
    amount: number,
    date: string,
    purpose: string,
}

export interface Merchant {
    id: string,
    name: string
}

export interface Category {
    id: string,
    icon: string,
    iconOutline: string,
    color: string,
    name: string,
    order: number
}

export interface Account {
    id: string,
    name: string,
    order: number
}



export interface Expense {
    id: string | null;
    amount: number;
    category: Category | null;
    account: Account | null;
    remarks: string;
    date: string;
    purpose: string;
    merchant: Merchant | null
}

export interface ExpenseViewModel {
    expense: Expense | null;
    categories: Category[] | null;
    accounts: Account[] | null;
    maxdate: string,
    purposes: string[]
}


export interface BaseReportViewModel {
    header: string | null;
    subheader: string | null;
    showHeader: boolean | null;
    showSubHeader: boolean | null;
    showTotal: boolean | null;
    total: number | null;
}

export interface ReportCategoryGroupedViewModel extends BaseReportViewModel {
    rows: ReportCategoryGroupedRow[] | null;
}

export interface ReportCategoryGroupedRow {
    value: number | null,
    category: Category
}
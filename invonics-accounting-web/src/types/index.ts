export interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  normal_balance: string;
  is_turnover: boolean;
  is_active: boolean;
}

export interface FiscalPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_locked: boolean;
}

export interface Party {
  id: number;
  name: string;
  type: 'client' | 'vendor';
  email?: string;
  phone?: string;
  notes?: string;
}

export interface JournalLine {
  id: number;
  entry_id: number;
  account_id: number;
  debit: number;
  credit: number;
  account_code?: string;
  account_name?: string;
}

export interface JournalEntry {
  id: number;
  reference: string;
  date: string;
  description: string;
  period_id: number;
  party_id: number | null;
  created_at: string;
  is_void: boolean;
  lines?: JournalLine[];
}

export interface PLReport {
  incomeRows: { code: string, name: string, total: number }[];
  expenseRows: { code: string, name: string, total: number }[];
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export interface TOTReport {
  grossTurnover: number;
  totRate: number;
  totPayable: number;
  from: string;
  to: string;
}

export interface TrialBalanceRow {
  code: string;
  name: string;
  type: string;
  normal_balance: string;
  total_debits: number;
  total_credits: number;
  net_balance: number;
}

export interface TrialBalanceReport {
  rows: TrialBalanceRow[];
  totals: {
    debits: number;
    credits: number;
  };
}

export interface CashFlowReport {
  accounts: {
    accountCode: string;
    accountName: string;
    openingBalance: number;
    periodMovements: number;
    closingBalance: number;
  }[];
  totalCash: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  partyId?: number;
  search?: string;
  type?: string;
  accountId?: number;
}

export interface CreateIncomeBody {
  date: string;
  amount: number;
  revenueAccountCode: string;
  cashAccountCode: string;
  narration: string;
  partyId?: number;
  reference?: string;
  attachmentUrl?: string;
}

export interface CreateExpenseBody {
  date: string;
  amount: number;
  expenseAccountCode: string;
  cashAccountCode: string;
  narration: string;
  partyId?: number;
  reference?: string;
  attachmentUrl?: string;
}

export interface CreateDrawingBody {
  date: string;
  amount: number;
  cashAccountCode: string;
  narration: string;
}

// DB Tables
export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: Date;
}

export interface FiscalPeriod {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  is_locked: boolean;
}

export interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  balance: number;
}

export interface Party {
  id: number;
  name: string;
  type: string;
  email?: string;
  phone?: string;
}

export interface JournalEntry {
  id: number;
  reference: string;
  date: Date;
  description: string;
  period_id: number;
  created_at: Date;
}

export interface JournalLine {
  id: number;
  entry_id: number;
  account_id: number;
  debit: number;
  credit: number;
}

export interface Attachment {
  id: number;
  entry_id: number;
  file_url: string;
  file_name: string;
  uploaded_at: Date;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  details: any;
  created_at: Date;
}

export interface TaxSetting {
  id: number;
  name: string;
  rate: number;
  is_active: boolean;
}

// Request Bodies
export interface LoginBody {
  email: string;
  password_hash: string;
}

export interface CreateIncomeBody {
  amount: number;
  account_id: number;
  date: string;
  description: string;
}

export interface CreateExpenseBody {
  amount: number;
  account_id: number;
  date: string;
  description: string;
}

export interface CreateDrawingBody {
  amount: number;
  date: string;
  description: string;
}

export interface CreatePartyBody {
  name: string;
  type: string;
  email?: string;
  phone?: string;
}

// Report Responses
export interface PLReport {
  revenue: number;
  expenses: number;
  net_profit: number;
}

export interface TOTReport {
  gross_sales: number;
  tot_amount: number;
}

export interface TrialBalanceRow {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
}

export interface CashFlowReport {
  inflows: number;
  outflows: number;
  net_cash_flow: number;
}

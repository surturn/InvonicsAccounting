import { PoolClient } from 'pg';

export async function seedChartOfAccounts(client: PoolClient, companyId: number) {
  const accounts = [
    { code: '1001', name: 'M-Pesa Cash',         type: 'asset',    normal_balance: 'debit',  is_turnover: false },
    { code: '1002', name: 'Bank Account',         type: 'asset',    normal_balance: 'debit',  is_turnover: false },
    { code: '1003', name: 'Petty Cash',           type: 'asset',    normal_balance: 'debit',  is_turnover: false },
    { code: '1100', name: 'Accounts Receivable',  type: 'asset',    normal_balance: 'debit',  is_turnover: false },
    { code: '2001', name: 'Accounts Payable',     type: 'liability',normal_balance: 'credit', is_turnover: false },
    { code: '2100', name: 'VAT Payable',          type: 'liability',normal_balance: 'credit', is_turnover: false },
    { code: '2200', name: 'TOT Payable',          type: 'liability',normal_balance: 'credit', is_turnover: false },
    { code: '3001', name: "Owner's Capital",      type: 'equity',   normal_balance: 'credit', is_turnover: false },
    { code: '3002', name: "Owner's Drawings",     type: 'equity',   normal_balance: 'debit',  is_turnover: false },
    { code: '4001', name: 'Consulting Revenue',   type: 'income',   normal_balance: 'credit', is_turnover: true  },
    { code: '4002', name: 'Software Development', type: 'income',   normal_balance: 'credit', is_turnover: true  },
    { code: '4003', name: 'Design Services',      type: 'income',   normal_balance: 'credit', is_turnover: true  },
    { code: '4004', name: 'Other Income',         type: 'income',   normal_balance: 'credit', is_turnover: true  },
    { code: '5001', name: 'Software Subscriptions',type: 'expense', normal_balance: 'debit',  is_turnover: false },
    { code: '5002', name: 'Contractor Payments',  type: 'expense',  normal_balance: 'debit',  is_turnover: false },
    { code: '5003', name: 'Marketing & Ads',      type: 'expense',  normal_balance: 'debit',  is_turnover: false },
    { code: '5004', name: 'Transport & Travel',   type: 'expense',  normal_balance: 'debit',  is_turnover: false },
    { code: '5005', name: 'Internet & Airtime',   type: 'expense',  normal_balance: 'debit',  is_turnover: false },
    { code: '5006', name: 'Office Supplies',      type: 'expense',  normal_balance: 'debit',  is_turnover: false },
    { code: '5007', name: 'Bank Charges',         type: 'expense',  normal_balance: 'debit',  is_turnover: false },
    { code: '5008', name: 'Miscellaneous',        type: 'expense',  normal_balance: 'debit',  is_turnover: false },
  ];

  for (const account of accounts) {
    await client.query(
      `INSERT INTO accounts (company_id, code, name, type, normal_balance, is_turnover)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [companyId, account.code, account.name, account.type, account.normal_balance, account.is_turnover]
    );
  }
}

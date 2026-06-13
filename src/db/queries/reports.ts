import { query } from '../pool';

export async function getPLReport(from: string, to: string) {
  const incomeResult = await query(
    `SELECT a.code, a.name, COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END), 0) AS total
     FROM accounts a
     LEFT JOIN journal_lines jl ON jl.account_id = a.id AND jl.credit > 0
     LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.is_void = false AND je.date BETWEEN $1 AND $2
     WHERE a.type = 'income' AND a.is_active = true
     GROUP BY a.id, a.code, a.name
     ORDER BY a.code`,
    [from, to]
  );
  
  const expenseResult = await query(
    `SELECT a.code, a.name, COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END), 0) AS total
     FROM accounts a
     LEFT JOIN journal_lines jl ON jl.account_id = a.id AND jl.debit > 0
     LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.is_void = false AND je.date BETWEEN $1 AND $2
     WHERE a.type = 'expense' AND a.is_active = true
     GROUP BY a.id, a.code, a.name
     ORDER BY a.code`,
    [from, to]
  );

  const incomeRows = incomeResult.rows.map(r => ({ ...r, total: parseFloat(r.total) }));
  const expenseRows = expenseResult.rows.map(r => ({ ...r, total: parseFloat(r.total) }));

  const totalIncome = incomeRows.reduce((sum, row) => sum + row.total, 0);
  const totalExpenses = expenseRows.reduce((sum, row) => sum + row.total, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return {
    incomeRows,
    expenseRows,
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin
  };
}

export async function getTOTReport(from: string, to: string) {
  const result = await query(
    `SELECT COALESCE(SUM(jl.credit), 0) AS gross_turnover
     FROM journal_lines jl
     JOIN journal_entries je ON je.id = jl.entry_id
     JOIN accounts a ON a.id = jl.account_id
     WHERE a.is_turnover = true
       AND jl.credit > 0
       AND je.is_void = false
       AND je.date BETWEEN $1 AND $2`,
    [from, to]
  );

  const grossTurnover = parseFloat(result.rows[0].gross_turnover);

  const taxResult = await query(
    `SELECT rate FROM tax_settings WHERE name = 'TOT_RATE' AND is_active = true LIMIT 1`
  );
  
  const totRate = taxResult.rows.length > 0 ? parseFloat(taxResult.rows[0].rate) : 0;
  const totPayable = grossTurnover * (totRate / 100);

  return {
    grossTurnover,
    totRate,
    totPayable,
    from,
    to
  };
}

export async function getTrialBalance(from: string, to: string) {
  const result = await query(
    `SELECT 
       a.code, a.name, a.type, a.normal_balance,
       COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END),0) AS total_debits,
       COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END),0) AS total_credits,
       COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END),0) -
       COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END),0) AS net_balance
     FROM accounts a
     LEFT JOIN journal_lines jl ON jl.account_id = a.id
     LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.is_void = false AND je.date BETWEEN $1 AND $2
     WHERE a.is_active = true
     GROUP BY a.id, a.code, a.name, a.type, a.normal_balance
     ORDER BY a.code`,
    [from, to]
  );

  let sumDebits = 0;
  let sumCredits = 0;

  const rows = result.rows.map(r => {
    const debits = parseFloat(r.total_debits);
    const credits = parseFloat(r.total_credits);
    sumDebits += debits;
    sumCredits += credits;
    return {
      ...r,
      total_debits: debits,
      total_credits: credits,
      net_balance: parseFloat(r.net_balance)
    };
  });

  if (Math.abs(sumDebits - sumCredits) > 0.001) {
    console.warn(`Trial balance mismatch! Debits: ${sumDebits}, Credits: ${sumCredits}`);
  }

  return {
    rows,
    totals: {
      debits: sumDebits,
      credits: sumCredits
    }
  };
}

export async function getCashFlow(from: string, to: string) {
  const cashAccounts = ['1001', '1002', '1003'];
  const accountResult = await query(
    `SELECT id, code, name FROM accounts WHERE code = ANY($1) AND is_active = true`,
    [cashAccounts]
  );

  const cashFlows = [];
  let totalCash = 0;

  for (const account of accountResult.rows) {
    const openingResult = await query(
      `SELECT COALESCE(SUM(jl.debit - jl.credit), 0) AS opening_balance
       FROM journal_lines jl
       JOIN journal_entries je ON je.id = jl.entry_id
       WHERE jl.account_id = $1 AND je.is_void = false AND je.date < $2`,
      [account.id, from]
    );

    const periodResult = await query(
      `SELECT COALESCE(SUM(jl.debit - jl.credit), 0) AS period_movements
       FROM journal_lines jl
       JOIN journal_entries je ON je.id = jl.entry_id
       WHERE jl.account_id = $1 AND je.is_void = false AND je.date BETWEEN $2 AND $3`,
      [account.id, from, to]
    );

    const openingBalance = parseFloat(openingResult.rows[0].opening_balance);
    const periodMovements = parseFloat(periodResult.rows[0].period_movements);
    const closingBalance = openingBalance + periodMovements;
    
    totalCash += closingBalance;

    cashFlows.push({
      accountCode: account.code,
      accountName: account.name,
      openingBalance,
      periodMovements,
      closingBalance
    });
  }

  return {
    accounts: cashFlows,
    totalCash
  };
}

export async function getTransactionsForExport(from: string, to: string, type?: string) {
  const result = await query(
    `SELECT 
       je.date, je.reference, 
       CASE WHEN je.reference LIKE 'INC-%' THEN 'income' WHEN je.reference LIKE 'EXP-%' THEN 'expense' ELSE 'drawing' END AS transaction_type,
       je.description as narration,
       p.name AS party_name,
       debit_a.name AS debit_account,
       credit_a.name AS credit_account,
       jl_debit.debit AS amount
     FROM journal_entries je
     LEFT JOIN parties p ON p.id = je.party_id
     JOIN journal_lines jl_debit ON jl_debit.entry_id = je.id AND jl_debit.debit > 0
     JOIN accounts debit_a ON debit_a.id = jl_debit.account_id
     JOIN journal_lines jl_credit ON jl_credit.entry_id = je.id AND jl_credit.credit > 0
     JOIN accounts credit_a ON credit_a.id = jl_credit.account_id
     WHERE je.is_void = false
       AND je.date BETWEEN $1 AND $2
       AND ($3::text IS NULL OR CASE WHEN je.reference LIKE 'INC-%' THEN 'income' WHEN je.reference LIKE 'EXP-%' THEN 'expense' ELSE 'drawing' END = $3)
     ORDER BY je.date ASC, je.id ASC`,
    [from, to, type || null]
  );
  return result.rows;
}

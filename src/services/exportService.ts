import { stringify } from 'csv-stringify/sync';

export function generateTransactionCSV(rows: any[]): string {
  const columns = [
    'Date', 'Reference', 'Type', 'Description', 'Party', 
    'Debit Account', 'Credit Account', 'Amount (KES)'
  ];

  const data = rows.map(row => [
    row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
    row.reference,
    row.transaction_type,
    row.narration,
    row.party_name || '',
    row.debit_account,
    row.credit_account,
    parseFloat(row.amount).toFixed(2)
  ]);

  return stringify([columns, ...data]);
}

export function generatePLCSV(report: any): string {
  const csvData: any[] = [];
  
  csvData.push(['INCOME', '']);
  report.incomeRows.forEach((row: any) => {
    csvData.push([row.name, parseFloat(row.total).toFixed(2)]);
  });
  csvData.push(['Total Income', parseFloat(report.totalIncome).toFixed(2)]);
  csvData.push(['', '']);
  
  csvData.push(['EXPENSES', '']);
  report.expenseRows.forEach((row: any) => {
    csvData.push([row.name, parseFloat(row.total).toFixed(2)]);
  });
  csvData.push(['Total Expenses', parseFloat(report.totalExpenses).toFixed(2)]);
  csvData.push(['', '']);
  
  csvData.push(['Net Profit/Loss', parseFloat(report.netProfit).toFixed(2)]);
  csvData.push(['Profit Margin', `${parseFloat(report.profitMargin).toFixed(2)}%`]);

  return stringify(csvData);
}

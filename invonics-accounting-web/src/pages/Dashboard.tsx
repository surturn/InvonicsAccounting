import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { 
  usePLReport, 
  useTOTReport, 
  useCashFlow 
} from '../hooks/useReports';
import { useTransactions } from '../hooks/useTransactions';
import { getPLReport } from '../api/reports';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { SlideOver } from '../components/ui/SlideOver';
import { Button } from '../components/ui/Button';
import { 
  TrendingUp, TrendingDown, DollarSign, Receipt, PlusCircle, 
  Wallet, Building2, Coins 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';
import { formatKES, formatDate, getPercentChange } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function Dashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  
  const from = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
  const to = new Date(now.getFullYear(), now.getMonth()+1, 0).toISOString().split('T')[0];

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevFrom = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth()+1).padStart(2,'0')}-01`;
  const prevTo = new Date(lastMonth.getFullYear(), lastMonth.getMonth()+1, 0).toISOString().split('T')[0];

  const { data: plData, isLoading: plLoading } = usePLReport(from, to);
  const { data: prevPlData } = usePLReport(prevFrom, prevTo);
  const { data: totData, isLoading: totLoading } = useTOTReport(from, to);
  const { data: cfData, isLoading: cfLoading } = useCashFlow(from, to);
  
  const { data: txData, isLoading: txLoading } = useTransactions({ page: 1, limit: 10 });

  // Last 6 months P&L
  const last6Months = Array.from({length: 6}).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mFrom = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;
    const mTo = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().split('T')[0];
    return { mFrom, mTo, label: d.toLocaleString('en-US', {month: 'short'}) };
  }).reverse();

  const last6MonthsQueries = useQueries({
    queries: last6Months.map(m => ({
      queryKey: ['reports', 'pl', m.mFrom, m.mTo],
      queryFn: () => getPLReport(m.mFrom, m.mTo),
      staleTime: 5 * 60 * 1000
    }))
  });

  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Compute KPI changes
  const incomeChange = getPercentChange(plData?.totalIncome || 0, prevPlData?.totalIncome || 0);
  const expenseChange = getPercentChange(plData?.totalExpenses || 0, prevPlData?.totalExpenses || 0);
  const profitChange = getPercentChange(plData?.netProfit || 0, prevPlData?.netProfit || 0);

  // Cash flow chart data
  const cfChartData = Array.from({length: new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()}).map((_, i) => {
    return { day: i + 1, cash: cfData ? cfData.totalCash : 0 }; 
  });

  // Bar chart data
  const barChartData = last6Months.map((m, i) => {
    const q = last6MonthsQueries[i];
    return {
      month: m.label,
      Income: q.data?.totalIncome || 0,
      Expenses: q.data?.totalExpenses || 0
    };
  });

  // Table Columns
  const columns = [
    { key: 'date', header: 'Date', render: (t: any) => formatDate(t.date) },
    { key: 'type', header: 'Type', render: (t: any) => {
      let typeStr = 'neutral';
      let label = 'Unknown';
      if (t.reference?.startsWith('INC')) { typeStr = 'income'; label = 'Income'; }
      else if (t.reference?.startsWith('EXP')) { typeStr = 'expense'; label = 'Expense'; }
      else if (t.reference?.startsWith('DRW')) { typeStr = 'drawing'; label = 'Drawing'; }
      return <Badge variant={typeStr as any}>{label}</Badge>
    }},
    { key: 'description', header: 'Description' },
    { key: 'party_id', header: 'Party', render: (t: any) => t.party_id ? `Party #${t.party_id}` : '-' },
    { key: 'amount', header: 'Amount', render: (t: any) => {
      let color = 'text-text-primary';
      if (t.reference?.startsWith('INC')) color = 'text-accent';
      else if (t.reference?.startsWith('EXP')) color = 'text-danger';
      else if (t.reference?.startsWith('DRW')) color = 'text-warning';
      
      const amt = t.lines ? t.lines.reduce((s:number, l:any) => s + (l.credit || 0), 0) : 0;
      return <span className={`font-medium ${color}`}>{formatKES(amt)}</span>
    }}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <div className="bg-bg-surface px-4 py-2 rounded-lg border border-bg-border text-sm font-medium text-text-secondary">
          {currentMonthName}
        </div>
      </div>

      {/* ROW 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card padding="md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-text-secondary text-sm font-medium">Total Income MTD</span>
            <div className="p-2 bg-accent-subtle rounded-lg">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
          </div>
          {plLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-1" /> : (
            <div className="text-2xl font-bold text-accent mb-1">{formatKES(plData?.totalIncome || 0)}</div>
          )}
          <div className="text-xs font-medium flex items-center gap-1">
            <span className={incomeChange >= 0 ? 'text-accent' : 'text-danger'}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
            </span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </Card>

        {/* Card 2 */}
        <Card padding="md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-text-secondary text-sm font-medium">Total Expenses MTD</span>
            <div className="p-2 bg-danger-subtle rounded-lg">
              <TrendingDown className="w-4 h-4 text-danger" />
            </div>
          </div>
          {plLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-1" /> : (
            <div className="text-2xl font-bold text-danger mb-1">{formatKES(plData?.totalExpenses || 0)}</div>
          )}
          <div className="text-xs font-medium flex items-center gap-1">
            <span className={expenseChange >= 0 ? 'text-danger' : 'text-accent'}>
              {expenseChange <= 0 ? '' : '+'}{expenseChange.toFixed(1)}%
            </span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </Card>

        {/* Card 3 */}
        <Card padding="md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-text-secondary text-sm font-medium">Net Profit MTD</span>
            <div className="p-2 bg-bg-elevated rounded-lg border border-bg-border">
              <DollarSign className="w-4 h-4 text-text-primary" />
            </div>
          </div>
          {plLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-1" /> : (
            <div className={`text-2xl font-bold mb-1 ${(plData?.netProfit || 0) >= 0 ? 'text-accent' : 'text-danger'}`}>
              {formatKES(plData?.netProfit || 0)}
            </div>
          )}
          <div className="text-xs font-medium flex items-center gap-2 mt-1">
            <Badge variant={(plData?.netProfit || 0) >= 0 ? 'success' : 'expense'}>
              {(plData?.netProfit || 0) >= 0 ? 'PROFIT' : 'LOSS'}
            </Badge>
            <span className={profitChange >= 0 ? 'text-accent' : 'text-danger'}>
              {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(1)}%
            </span>
          </div>
        </Card>

        {/* Card 4 */}
        <Card padding="md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-text-secondary text-sm font-medium">TOT Payable (1.5%)</span>
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Receipt className="w-4 h-4 text-warning" />
            </div>
          </div>
          {totLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-1" /> : (
            <div className="text-2xl font-bold text-warning mb-1">{formatKES(totData?.totPayable || 0)}</div>
          )}
          <div className="text-xs font-medium text-text-muted">
            File by 20th {new Date(now.getFullYear(), now.getMonth()+1, 1).toLocaleString('en-US',{month:'short'})}
          </div>
        </Card>
      </div>

      {/* ROW 2: Charts */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Chart */}
        <Card padding="md" className="flex-1 lg:w-[60%] flex flex-col min-h-[350px]">
          <h3 className="text-sm font-semibold text-text-secondary mb-6 uppercase tracking-wider">Cash Flow This Month</h3>
          <div className="flex-1 w-full h-full min-h-[250px]">
            {cfLoading ? <Skeleton variant="rect" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cfChartData}>
                  <XAxis dataKey="day" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `KES ${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px' }}
                    itemStyle={{ color: '#00C896', fontWeight: 600 }}
                    formatter={(val: number) => [formatKES(val), 'Net Cash']}
                    labelStyle={{ color: '#A1A1AA' }}
                  />
                  <Line type="monotone" dataKey="cash" stroke="#00C896" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Right Chart */}
        <Card padding="md" className="lg:w-[40%] flex flex-col min-h-[350px]">
          <h3 className="text-sm font-semibold text-text-secondary mb-6 uppercase tracking-wider">Income vs Expenses - Last 6 Months</h3>
          <div className="flex-1 w-full h-full min-h-[250px]">
            {last6MonthsQueries.some(q => q.isLoading) ? <Skeleton variant="rect" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="month" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px' }}
                    labelStyle={{ color: '#A1A1AA', marginBottom: '8px' }}
                    formatter={(val: number) => [formatKES(val)]}
                  />
                  <Bar dataKey="Income" fill="#00C896" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* ROW 3: Recent Transactions */}
      <Card padding="none" className="overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-bg-border">
          <h3 className="text-base font-semibold text-text-primary">Recent Transactions</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.TRANSACTIONS)}>View All</Button>
        </div>
        
        {txData?.data && txData.data.length > 0 ? (
          <Table 
            columns={columns} 
            data={txData.data} 
            loading={txLoading}
            onRowClick={(tx) => setSelectedTx(tx)}
            className="border-0 rounded-none"
          />
        ) : !txLoading ? (
          <EmptyState 
            icon={PlusCircle} 
            title="No transactions yet" 
            description="You haven't recorded any transactions for this period."
            action={{ label: 'Add your first entry', onClick: () => navigate(ROUTES.ADD_TRANSACTION) }}
          />
        ) : (
          <div className="p-5">
            <Skeleton variant="rect" className="h-40" />
          </div>
        )}
      </Card>

      {/* ROW 4: Cash Position */}
      <h3 className="text-lg font-semibold text-text-primary pt-2">Cash Position</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cfLoading ? (
          Array.from({length:3}).map((_, i) => <Skeleton key={i} variant="rect" className="h-24" />)
        ) : (
          cfData?.accounts.map(acc => {
            let Icon = Wallet;
            if (acc.accountName.toLowerCase().includes('bank')) Icon = Building2;
            if (acc.accountName.toLowerCase().includes('petty')) Icon = Coins;

            return (
              <Card key={acc.accountCode} padding="md" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-elevated rounded-xl flex items-center justify-center border border-bg-border shrink-0">
                  <Icon className="w-6 h-6 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">{acc.accountName}</p>
                  <p className="text-xl font-bold text-text-primary mt-1">{formatKES(acc.closingBalance)}</p>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <SlideOver open={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Details" width="md">
        {selectedTx && (
          <div className="space-y-4 text-text-primary">
            <p><strong>Date:</strong> {formatDate(selectedTx.date)}</p>
            <p><strong>Reference:</strong> {selectedTx.reference}</p>
            <p><strong>Description:</strong> {selectedTx.description}</p>
            <div className="mt-4">
              <h4 className="font-semibold border-b border-bg-border pb-2 mb-2">Lines</h4>
              {selectedTx.lines?.map((l:any) => (
                <div key={l.id} className="flex justify-between py-1 text-sm">
                  <span>{l.account_name}</span>
                  <span className={l.debit > 0 ? 'text-text-primary' : 'text-text-secondary'}>
                    {l.debit > 0 ? formatKES(l.debit) : formatKES(l.credit)} {l.debit > 0 ? '(DR)' : '(CR)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

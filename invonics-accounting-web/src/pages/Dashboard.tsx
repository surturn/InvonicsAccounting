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
  Wallet, Building2, Coins, FileText, ArrowDownCircle, ArrowUpCircle, AlertCircle, Calendar as CalendarIcon, BarChart2
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

  const isCashFlowEmpty = cfData?.totalCash === 0 && (!cfData.accounts || cfData.accounts.length === 0 || cfData.accounts.every(a => a.openingBalance === 0 && a.periodMovements === 0));

  // Bar chart data
  const barChartData = last6Months.map((m, i) => {
    const q = last6MonthsQueries[i];
    return {
      month: m.label,
      Income: q.data?.totalIncome || 0,
      Expenses: q.data?.totalExpenses || 0
    };
  });
  
  const isBarChartEmpty = barChartData.every(d => d.Income === 0 && d.Expenses === 0);

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
    { key: 'party_id', header: 'Category', render: (t: any) => t.lines?.[0]?.account_name || '-' },
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
    <div className="space-y-8 pb-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-1">Overview</p>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Dashboard</h1>
        </div>
        <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-bg-border text-sm font-semibold text-text-secondary hover:bg-bg-elevated transition-colors">
          <CalendarIcon className="w-4 h-4 text-accent" />
          {currentMonthName}
        </button>
      </div>

      {/* ROW 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Income */}
        <Card padding="md" className="rounded-2xl shadow-sm border border-bg-border/60 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-text-secondary text-sm font-bold tracking-wide">Total Income MTD</span>
            <div className="p-2 bg-accent/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          {plLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-2" /> : (
            <div className="text-3xl font-black text-text-primary mb-2">{formatKES(plData?.totalIncome || 0)}</div>
          )}
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <span className={`flex items-center ${incomeChange >= 0 ? 'text-accent' : 'text-danger'}`}>
              {incomeChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
            </span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </Card>

        {/* Card 2: Expenses */}
        <Card padding="md" className="rounded-2xl shadow-sm border border-bg-border/60 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-text-secondary text-sm font-bold tracking-wide">Total Expenses MTD</span>
            <div className="p-2 bg-danger/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-danger" />
            </div>
          </div>
          {plLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-2" /> : (
            <div className="text-3xl font-black text-text-primary mb-2">{formatKES(plData?.totalExpenses || 0)}</div>
          )}
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <span className={`flex items-center ${expenseChange >= 0 ? 'text-danger' : 'text-accent'}`}>
              {expenseChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {expenseChange <= 0 ? '' : '+'}{expenseChange.toFixed(1)}%
            </span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </Card>

        {/* Card 3: Net Profit */}
        <Card padding="md" className="rounded-2xl shadow-sm border border-bg-border/60 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-text-secondary text-sm font-bold tracking-wide">Net Profit MTD</span>
            <Badge variant={(plData?.netProfit || 0) >= 0 ? 'success' : 'expense'} className="font-bold">
              {(plData?.netProfit || 0) >= 0 ? 'PROFIT' : 'LOSS'}
            </Badge>
          </div>
          {plLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-2" /> : (
            <div className={`text-3xl font-black mb-2 ${(plData?.netProfit || 0) >= 0 ? 'text-accent' : 'text-danger'}`}>
              {formatKES(plData?.netProfit || 0)}
            </div>
          )}
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <span className={profitChange >= 0 ? 'text-accent' : 'text-danger'}>
              {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(1)}%
            </span>
            <span className="text-text-muted">vs last month</span>
          </div>
          {/* Decorative background icon */}
          <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-bg-elevated opacity-50 pointer-events-none" />
        </Card>

        {/* Card 4: Upcoming Payments */}
        <Card padding="md" className="rounded-2xl shadow-sm border border-bg-border/60 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-orange-50/30">
          <div className="flex justify-between items-start mb-4">
            <span className="text-text-secondary text-sm font-bold tracking-wide">Upcoming Payments</span>
            <div className="p-2 bg-warning/10 rounded-xl">
              <Receipt className="w-5 h-5 text-warning" />
            </div>
          </div>
          {totLoading ? <Skeleton variant="line" className="h-8 w-1/2 mb-2" /> : (
            <div className="text-3xl font-black text-text-primary mb-3">{formatKES(totData?.totPayable || 0)}</div>
          )}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-danger/10 text-danger text-xs font-bold rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            3 Days to File
          </div>
        </Card>
      </div>

      {/* ROW 2: Charts */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Chart */}
        <Card padding="lg" className="flex-1 lg:w-[50%] flex flex-col min-h-[400px] rounded-2xl shadow-sm border-bg-border/60">
          <h3 className="text-sm font-bold text-text-secondary mb-6 tracking-wide">CASH FLOW THIS MONTH</h3>
          <div className="flex-1 w-full h-full min-h-[280px] relative">
            {cfLoading ? <Skeleton variant="rect" className="rounded-xl h-full" /> : 
             isCashFlowEmpty ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mb-4">
                   <TrendingUp className="w-8 h-8 text-text-muted" />
                 </div>
                 <p className="text-text-secondary font-semibold text-lg">No cash flow data yet</p>
                 <p className="text-text-muted text-sm mt-1">Record your first transaction to see trends.</p>
               </div>
             ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cfChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `KES ${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E4E7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#00C896', fontWeight: 700 }}
                    formatter={(val: number) => [formatKES(val), 'Net Cash']}
                    labelStyle={{ color: '#71717A', fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="cash" stroke="#00C896" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00C896', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Right Chart */}
        <Card padding="lg" className="lg:w-[50%] flex flex-col min-h-[400px] rounded-2xl shadow-sm border-bg-border/60">
          <h3 className="text-sm font-bold text-text-secondary mb-6 tracking-wide">INCOME VS EXPENSES - LAST 6 MONTHS</h3>
          <div className="flex-1 w-full h-full min-h-[280px] relative">
            {last6MonthsQueries.some(q => q.isLoading) ? <Skeleton variant="rect" className="rounded-xl h-full" /> : 
             isBarChartEmpty ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mb-4">
                   <BarChart2 className="w-8 h-8 text-text-muted" />
                 </div>
                 <p className="text-text-secondary font-semibold text-lg">No income or expenses yet</p>
                 <p className="text-text-muted text-sm mt-1">Check back next month for historical data.</p>
               </div>
             ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={2} barSize={20}>
                  <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E4E7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#71717A', fontWeight: 600, marginBottom: '8px' }}
                    formatter={(val: number) => [formatKES(val)]}
                    cursor={{ fill: '#F4F4F5' }}
                  />
                  <Bar dataKey="Income" fill="#C25934" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* ROW 3: Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate(ROUTES.ADD_TRANSACTION)} 
            className="flex items-center justify-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-bg-border/60 hover:border-accent hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <span className="font-bold text-text-primary group-hover:text-accent transition-colors">Create Invoice</span>
          </button>
          
          <button 
            onClick={() => navigate(ROUTES.ADD_TRANSACTION)} 
            className="flex items-center justify-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-bg-border/60 hover:border-danger hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center group-hover:bg-danger/20 transition-colors">
              <ArrowDownCircle className="w-5 h-5 text-danger" />
            </div>
            <span className="font-bold text-text-primary group-hover:text-danger transition-colors">Add Expense</span>
          </button>

          <button 
            onClick={() => navigate(ROUTES.ADD_TRANSACTION)} 
            className="flex items-center justify-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-bg-border/60 hover:border-[#00C896] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#00C896]/10 flex items-center justify-center group-hover:bg-[#00C896]/20 transition-colors">
              <ArrowUpCircle className="w-5 h-5 text-[#00C896]" />
            </div>
            <span className="font-bold text-text-primary group-hover:text-[#00C896] transition-colors">Record Payment</span>
          </button>
        </div>
      </div>

      {/* ROW 4: Recent Transactions */}
      <Card padding="none" className="overflow-hidden flex flex-col rounded-2xl shadow-sm border-bg-border/60">
        <div className="flex items-center justify-between p-6 border-b border-bg-border/60 bg-white">
          <h3 className="text-lg font-bold text-text-primary tracking-wide">Recent Transactions</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.TRANSACTIONS)} className="font-semibold text-accent hover:bg-accent/5">View All</Button>
        </div>
        
        {txData?.data && txData.data.length > 0 ? (
          <Table 
            columns={columns} 
            data={txData.data} 
            loading={txLoading}
            onRowClick={(tx) => setSelectedTx(tx)}
            className="border-0 rounded-none bg-white"
          />
        ) : !txLoading ? (
          <div className="p-12">
            <EmptyState 
              icon={PlusCircle} 
              title="No transactions yet" 
              description="Start tracking your finances by recording your first transaction."
              action={{ label: '+ Record Your First Transaction', onClick: () => navigate(ROUTES.ADD_TRANSACTION) }}
            />
          </div>
        ) : (
          <div className="p-6 bg-white">
            <Skeleton variant="rect" className="h-48 rounded-xl" />
          </div>
        )}
      </Card>

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

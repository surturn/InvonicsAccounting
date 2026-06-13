import React, { useState } from 'react';
import { 
  usePLReport, 
  useTOTReport, 
  useTrialBalance, 
  useCashFlow 
} from '../hooks/useReports';
import { downloadTransactions, downloadPLSummary } from '../api/export';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Skeleton } from '../components/ui/Skeleton';
import { formatKES } from '../utils/format';
import { Download, ExternalLink, CheckCircle, Wallet, Building2, Coins, Copy } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

type ReportTab = 'pl' | 'tot' | 'trial' | 'cashflow';

export default function Reports() {
  const now = new Date();
  const defaultFrom = `${now.getFullYear()}-01-01`;
  const defaultTo = now.toISOString().split('T')[0];

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [activeTab, setActiveTab] = useState<ReportTab>('pl');
  const [exportLoading, setExportLoading] = useState(false);

  const { data: plData, isLoading: plLoading } = usePLReport(from, to);
  const { data: totData, isLoading: totLoading } = useTOTReport(from, to);
  const { data: tbData, isLoading: tbLoading } = useTrialBalance(from, to);
  const { data: cfData, isLoading: cfLoading } = useCashFlow(from, to);

  const { success } = useToast();

  const handleExportTransactions = async () => {
    setExportLoading(true);
    try {
      await downloadTransactions(from, to);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPL = async () => {
    setExportLoading(true);
    try {
      await downloadPLSummary(from, to);
    } finally {
      setExportLoading(false);
    }
  };

  const copyTOT = () => {
    if (totData) {
      navigator.clipboard.writeText(totData.totPayable.toString());
      success('Copied TOT amount to clipboard');
    }
  };

  const tbColumns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Account Name' },
    { key: 'type', header: 'Type', render: (r: any) => <span className="uppercase text-xs">{r.type}</span> },
    { key: 'total_debits', header: 'Debits', render: (r: any) => <div className="text-right">{formatKES(r.total_debits)}</div> },
    { key: 'total_credits', header: 'Credits', render: (r: any) => <div className="text-right">{formatKES(r.total_credits)}</div> },
    { key: 'net_balance', header: 'Net Balance', render: (r: any) => {
      let color = 'text-text-primary';
      if (r.net_balance > 0) color = 'text-accent';
      else if (r.net_balance < 0) color = 'text-danger';
      return <div className={`text-right font-medium ${color}`}>{formatKES(r.net_balance)}</div>
    }}
  ];

  const tbTotalDebits = tbData?.reduce((s, r) => s + Number(r.total_debits || 0), 0) || 0;
  const tbTotalCredits = tbData?.reduce((s, r) => s + Number(r.total_credits || 0), 0) || 0;
  const isBalanced = Math.abs(tbTotalDebits - tbTotalCredits) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Reports & Export</h1>
        
        <div className="flex items-center gap-2 relative group">
          <Button variant="secondary" className="gap-2" loading={exportLoading}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <div className="absolute top-full right-0 mt-1 w-48 bg-bg-surface border border-bg-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <div className="flex flex-col py-1">
              <button onClick={handleExportTransactions} className="px-4 py-2 text-sm text-left hover:bg-bg-elevated text-text-primary">
                Export Transactions CSV
              </button>
              <button onClick={handleExportPL} className="px-4 py-2 text-sm text-left hover:bg-bg-elevated text-text-primary">
                Export P&L Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card padding="md" className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-40">
            <Input label="From Date" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="w-40">
            <Input label="To Date" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-bg-border pb-1">
          {(['pl', 'tot', 'trial', 'cashflow'] as ReportTab[]).map(tab => {
            const labels = {
              pl: 'P&L Statement',
              tot: 'TOT Report',
              trial: 'Trial Balance',
              cashflow: 'Cash Flow'
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === tab ? 'bg-bg-elevated text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-base'}`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          {activeTab === 'pl' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4 flex justify-between border-b border-bg-border pb-2">
                    <span>Income</span>
                    <span className="text-accent">{formatKES(plData?.totalIncome || 0)}</span>
                  </h3>
                  {plLoading ? <Skeleton variant="rect" className="h-40" /> : (
                    <div className="space-y-3">
                      {plData?.incomeRows?.map((r, i) => (
                        <div key={i} className="flex justify-between text-sm border-b border-bg-border/50 pb-2">
                          <span className="text-text-secondary">{r.code} - {r.name}</span>
                          <span className="font-medium text-text-primary">{formatKES(r.total)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4 flex justify-between border-b border-bg-border pb-2">
                    <span>Expenses</span>
                    <span className="text-danger">{formatKES(plData?.totalExpenses || 0)}</span>
                  </h3>
                  {plLoading ? <Skeleton variant="rect" className="h-40" /> : (
                    <div className="space-y-3">
                      {plData?.expenseRows?.map((r, i) => (
                        <div key={i} className="flex justify-between text-sm border-b border-bg-border/50 pb-2">
                          <span className="text-text-secondary">{r.code} - {r.name}</span>
                          <span className="font-medium text-text-primary">{formatKES(r.total)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {!plLoading && plData && (
                <div className="bg-bg-elevated p-6 rounded-xl border border-bg-border flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <div className="text-sm text-text-secondary mb-1">
                      {plData.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                    </div>
                    <div className={`text-3xl font-bold ${plData.netProfit >= 0 ? 'text-accent' : 'text-danger'}`}>
                      {formatKES(plData.netProfit)}
                    </div>
                  </div>
                  <div>
                    <Badge variant={plData.netProfit >= 0 ? 'success' : 'expense'}>
                      Margin: {plData.profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tot' && (
            <div className="flex justify-center">
              <Card padding="lg" className="w-full max-w-md text-center">
                <p className="text-sm font-medium text-text-secondary mb-6 uppercase tracking-wider">
                  {new Date(from).toLocaleDateString('en-US',{month:'short',year:'numeric'})} - {new Date(to).toLocaleDateString('en-US',{month:'short',year:'numeric'})}
                </p>
                
                {totLoading ? <Skeleton variant="rect" className="h-40" /> : (
                  <>
                    <div className="mb-6">
                      <p className="text-text-secondary mb-1">Gross Turnover</p>
                      <p className="text-3xl font-bold text-text-primary">{formatKES(totData?.grossTurnover || 0)}</p>
                    </div>
                    
                    <div className="mb-6 text-sm text-text-muted">
                      Rate: {totData?.totRate || 1.5}%
                    </div>
                    
                    <hr className="border-bg-border mb-6" />
                    
                    <div className="mb-8">
                      <p className="text-text-secondary mb-2">TOT Payable</p>
                      <div className="flex justify-center items-center gap-3">
                        <p className="text-4xl font-black text-warning">{formatKES(totData?.totPayable || 0)}</p>
                        <button onClick={copyTOT} className="p-2 hover:bg-bg-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors">
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-bg-elevated rounded-lg p-4 text-left flex items-start gap-3 border border-bg-border">
                      <div className="mt-1"><CheckCircle className="w-5 h-5 text-accent" /></div>
                      <div>
                        <p className="text-sm text-text-primary font-medium mb-1">
                          File on iTax by the 20th of next month
                        </p>
                        <a 
                          href="https://itax.kra.go.ke/" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-accent text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                          iTax Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'trial' && (
            <div className="overflow-x-auto">
              <Table 
                columns={tbColumns} 
                data={tbData || []} 
                loading={tbLoading} 
              />
              {!tbLoading && tbData && (
                <div className="bg-bg-elevated p-4 border-t border-bg-border flex justify-between items-center mt-2 rounded-b-lg">
                  <span className="font-bold text-text-primary">Total</span>
                  <div className="flex gap-12 text-right">
                    <span className="font-medium text-text-primary">{formatKES(tbTotalDebits)}</span>
                    <span className="font-medium text-text-primary">{formatKES(tbTotalCredits)}</span>
                    <span className="flex items-center gap-2 font-bold w-32 justify-end">
                      {isBalanced ? (
                        <><CheckCircle className="w-4 h-4 text-accent" /> Balanced</>
                      ) : (
                        <span className="text-danger">Unbalanced</span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              {cfLoading ? <Skeleton variant="rect" className="h-64" /> : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cfData?.accounts?.map(acc => {
                      let Icon = Wallet;
                      if (acc.accountName.toLowerCase().includes('bank')) Icon = Building2;
                      if (acc.accountName.toLowerCase().includes('petty')) Icon = Coins;

                      return (
                        <Card key={acc.accountCode} padding="md">
                          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bg-border">
                            <div className="p-2 bg-bg-elevated rounded-lg"><Icon className="w-5 h-5 text-text-secondary" /></div>
                            <span className="font-bold text-text-primary">{acc.accountName}</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-text-secondary">Opening Balance</span>
                              <span className="font-medium text-text-primary">{formatKES(acc.openingBalance)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-text-secondary">Period Movements</span>
                              <span className={`font-medium ${acc.periodMovements >= 0 ? 'text-accent' : 'text-danger'}`}>
                                {acc.periodMovements > 0 ? '+' : ''}{formatKES(acc.periodMovements)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm pt-4 border-t border-bg-border/50">
                              <span className="text-text-primary font-bold">Closing Balance</span>
                              <span className="font-bold text-text-primary">{formatKES(acc.closingBalance)}</span>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                  
                  <div className="bg-bg-elevated p-6 rounded-xl border border-bg-border flex justify-between items-center">
                    <span className="text-lg font-bold text-text-primary">Total Cash Position</span>
                    <span className="text-2xl font-bold text-accent">{formatKES(cfData?.totalCash || 0)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

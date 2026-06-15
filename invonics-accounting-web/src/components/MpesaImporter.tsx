import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Table } from './ui/Table';
import { Badge } from './ui/Badge';
import { Select } from './ui/Select';
import { useToast } from './ui/Toast';
import { parseMpesaPDF } from '../api/tools';
import { useAccounts } from '../hooks/useAccounts';
import { useCreateIncome, useCreateExpense } from '../hooks/useTransactions';
import { formatKES, formatDate } from '../utils/format';
import { useQueryClient } from '@tanstack/react-query';

export function MpesaImporter() {
  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedTxs, setParsedTxs] = useState<any[]>([]);
  
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const { data: accounts } = useAccounts();
  const { mutateAsync: createIncome } = useCreateIncome();
  const { mutateAsync: createExpense } = useCreateExpense();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const incomeAccounts = safeAccounts.filter(a => a.type === 'income');
  const expenseAccounts = safeAccounts.filter(a => a.type === 'expense');
  const mpesaAccount = safeAccounts.find(a => a.code === '1001');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    if (!file) return;
    if (file.type === 'application/pdf' && !password) {
      error('Please enter the PDF password to decrypt it');
      return;
    }
    setParsing(true);
    try {
      const res = await parseMpesaPDF(file, password, { income: incomeAccounts, expense: expenseAccounts });
      if (res.transactions) {
        setParsedTxs(res.transactions.map((t: any, i: number) => {
          // AI might return positive amount with type 'debit', or negative amount
          const isDebit = t.type === 'debit' || t.amount < 0;
          const finalAmount = isDebit ? -Math.abs(t.amount) : Math.abs(t.amount);
          
          return {
            ...t,
            id: i,
            amount: finalAmount,
            selected: true,
            categoryId: t.categoryId ? t.categoryId.toString() : '',
            cashAccountId: mpesaAccount?.id?.toString() || ''
          };
        }));
      }
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to parse statement');
    } finally {
      setParsing(false);
    }
  };

  const handleToggleSelect = (id: number) => {
    setParsedTxs(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleSelectAll = (select: boolean) => {
    setParsedTxs(prev => prev.map(t => ({ ...t, selected: select })));
  };

  const handleChangeCategory = (id: number, val: string) => {
    setParsedTxs(prev => prev.map(t => t.id === id ? { ...t, categoryId: val } : t));
  };

  const handleChangeCashAccount = (id: number, val: string) => {
    setParsedTxs(prev => prev.map(t => t.id === id ? { ...t, cashAccountId: val } : t));
  };

  const handleImport = async () => {
    const selected = parsedTxs.filter(t => t.selected);
    if (selected.length === 0) return;

    // Validate
    for (const t of selected) {
      if (!t.categoryId) {
        error('Please select a category for all selected transactions');
        return;
      }
      if (!t.cashAccountId) {
        error('Please select a cash account for all selected transactions');
        return;
      }
    }

    setImporting(true);
    setImportProgress(0);

    try {
      for (let i = 0; i < selected.length; i++) {
        const t = selected[i];
        const isMoneyIn = t.amount > 0;
        const absAmount = Math.abs(t.amount);
        
        const categoryAccount = safeAccounts.find(a => a.id.toString() === t.categoryId);
        const cashAccount = safeAccounts.find(a => a.id.toString() === t.cashAccountId);
        
        if (!categoryAccount || !cashAccount) {
          throw new Error('Invalid account mapping');
        }

        const payload = {
          date: t.date,
          amount: absAmount,
          narration: `[M-Pesa] ${t.description} ${t.party ? '- ' + t.party : ''}`.substring(0, 200),
        };

        if (isMoneyIn) {
          await createIncome({
            ...payload,
            revenueAccountCode: categoryAccount.code,
            cashAccountCode: cashAccount.code,
          });
        } else {
          await createExpense({
            ...payload,
            expenseAccountCode: categoryAccount.code,
            cashAccountCode: cashAccount.code,
          });
        }
        
        setImportProgress(i + 1);
      }

      success(`Successfully imported ${selected.length} transactions`);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      // Reset state
      setFile(null);
      setPassword('');
      setParsedTxs([]);
      setExpanded(false);
      
    } catch (err) {
      error('An error occurred during import');
    } finally {
      setImporting(false);
    }
  };

  const columns = [
    { key: 'select', header: '', render: (t: any) => (
      <input type="checkbox" checked={t.selected} onChange={() => handleToggleSelect(t.id)} />
    )},
    { key: 'date', header: 'Date', render: (t: any) => formatDate(t.date) },
    { key: 'description', header: 'Description', className: 'whitespace-normal min-w-[200px] max-w-[400px]' },
    { key: 'party', header: 'Party' },
    { key: 'amount', header: 'Amount', render: (t: any) => (
      <span className={`font-medium ${t.amount > 0 ? 'text-accent' : 'text-danger'}`}>
        {t.amount > 0 ? '+' : ''}{formatKES(t.amount)}
      </span>
    )},
    { key: 'type', header: 'Type', render: (t: any) => (
      <Badge variant={t.amount > 0 ? 'income' : 'expense'}>{t.amount > 0 ? 'Money In' : 'Money Out'}</Badge>
    )},
    { key: 'mappings', header: 'Mapping', className: 'min-w-[320px]', render: (t: any) => (
      t.selected ? (
        <div className="flex gap-2 w-full">
          <Select 
            value={t.categoryId} 
            onChange={(e) => handleChangeCategory(t.id, e.target.value)}
            className="w-1/2"
            options={[
              { label: 'Category...', value: '' },
              ...(t.amount > 0 ? incomeAccounts : expenseAccounts).map(a => ({ label: a.name, value: a.id.toString() }))
            ]}
          />
          <Select 
            value={t.cashAccountId} 
            onChange={(e) => handleChangeCashAccount(t.id, e.target.value)}
            className="w-1/2"
            options={[
              { label: 'Cash Acc...', value: '' },
              ...safeAccounts.filter(a => ['asset'].includes(a.type) && !a.is_turnover).map(a => ({ label: a.name, value: a.id.toString() }))
            ]}
          />
        </div>
      ) : <span className="text-text-muted text-xs">Ignored</span>
    )}
  ];

  return (
    <Card padding="none" className="overflow-hidden mb-6">
      <div 
        className="p-4 border-b border-bg-border flex justify-between items-center cursor-pointer hover:bg-bg-base transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-base font-semibold text-text-primary">Import from M-Pesa Statement</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
      </div>
      
      {expanded && (
        <div className="p-6">
          {parsedTxs.length === 0 ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-bg-border bg-bg-elevated rounded-xl p-8 text-center">
                <Upload className="w-8 h-8 text-text-secondary mx-auto mb-3" />
                <p className="text-text-primary font-medium mb-1">Drop your M-Pesa PDF or Image screenshot here</p>
                <p className="text-text-muted text-sm mb-4">or click to browse</p>
                <input 
                  type="file" 
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-bg-surface file:text-accent hover:file:bg-bg-border cursor-pointer mx-auto max-w-xs"
                />
                {file && (
                  <div className="mt-4 space-y-3 max-w-xs mx-auto">
                    <p className="text-sm text-accent">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                    {file.type === 'application/pdf' && (
                      <input
                        type="password"
                        placeholder="M-Pesa Password / ID Number"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-bg-border rounded-lg bg-bg-base text-sm text-text-primary focus:outline-none focus:border-accent"
                      />
                    )}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleParse} 
                loading={parsing} 
                disabled={!file}
                className="w-full"
              >
                {parsing ? 'Parsing with AI...' : 'Parse Statement'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-text-primary">Found {parsedTxs.length} transactions</h4>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSelectAll(true)}>Select All</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleSelectAll(false)}>Deselect All</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table columns={columns} data={parsedTxs} />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-bg-border">
                <Button variant="secondary" onClick={() => setParsedTxs([])}>Cancel</Button>
                <Button 
                  onClick={handleImport} 
                  loading={importing}
                  disabled={parsedTxs.filter(t => t.selected).length === 0}
                >
                  {importing ? `Importing ${importProgress} of ${parsedTxs.filter(t => t.selected).length}...` : `Import ${parsedTxs.filter(t => t.selected).length} Selected`}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

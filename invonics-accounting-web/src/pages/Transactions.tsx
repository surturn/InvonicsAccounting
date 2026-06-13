import React, { useState, useMemo } from 'react';
import { 
  useTransactions, 
  useTransaction, 
  useVoidTransaction 
} from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useDebounce } from '../hooks/useDebounce';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { SlideOver } from '../components/ui/SlideOver';
import { Modal } from '../components/ui/Modal';
import { formatDate, formatKES } from '../utils/format';

export default function Transactions() {
  const now = new Date();
  const defaultFrom = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
  const defaultTo = now.toISOString().split('T')[0];

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [type, setType] = useState('All');
  const [accountId, setAccountId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const { data: accountsData } = useAccounts();
  const accountOptions = useMemo(() => {
    if (!accountsData) return [];
    return [
      { label: 'All Categories', value: '' },
      ...accountsData.filter(a => a.type === 'income' || a.type === 'expense').map(a => ({
        label: `${a.type.toUpperCase()} - ${a.name}`,
        value: a.id.toString()
      }))
    ];
  }, [accountsData]);

  const filters: any = { page, limit: 50, from, to };
  if (type !== 'All') filters.type = type.toLowerCase();
  if (accountId) filters.accountId = Number(accountId);
  if (debouncedSearch) filters.search = debouncedSearch;

  const { data: txData, isLoading: txLoading } = useTransactions(filters);

  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const { data: selectedTx, isLoading: selectedTxLoading } = useTransaction(selectedTransactionId as number);
  
  const { mutate: voidTx, isPending: voiding } = useVoidTransaction();
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  const handleReset = () => {
    setFrom(defaultFrom);
    setTo(defaultTo);
    setType('All');
    setAccountId('');
    setSearch('');
    setPage(1);
  };

  const handleVoid = () => {
    if (selectedTransactionId && voidReason) {
      voidTx({ id: selectedTransactionId, reason: voidReason }, {
        onSuccess: () => {
          setVoidModalOpen(false);
          setVoidReason('');
        }
      });
    }
  };

  const columns = [
    { key: 'date', header: 'Date', render: (t: any) => formatDate(t.date) },
    { key: 'reference', header: 'Ref', render: (t: any) => <span className="font-mono text-xs text-text-secondary">{t.reference}</span> },
    { key: 'type', header: 'Type', render: (t: any) => {
      let typeStr = 'neutral';
      let label = 'Unknown';
      if (t.reference?.startsWith('INC')) { typeStr = 'income'; label = 'Income'; }
      else if (t.reference?.startsWith('EXP')) { typeStr = 'expense'; label = 'Expense'; }
      else if (t.reference?.startsWith('DRW')) { typeStr = 'drawing'; label = 'Drawing'; }
      return <Badge variant={typeStr as any}>{label}</Badge>
    }},
    { key: 'description', header: 'Description', render: (t: any) => (
      <span className="text-text-primary" title={t.description}>
        {t.description?.length > 40 ? t.description.substring(0, 40) + '...' : t.description}
      </span>
    )},
    { key: 'party', header: 'Party', render: (t: any) => <span className="text-text-secondary">{t.party_id ? `Party #${t.party_id}` : '-'}</span> },
    { key: 'amount', header: 'Amount', render: (t: any) => {
      let color = 'text-text-primary';
      if (t.reference?.startsWith('INC')) color = 'text-accent';
      else if (t.reference?.startsWith('EXP')) color = 'text-danger';
      else if (t.reference?.startsWith('DRW')) color = 'text-warning';
      
      const amt = t.lines ? t.lines.reduce((s:number, l:any) => s + (l.credit || 0), 0) : 0;
      return <div className={`text-right font-medium ${color}`}>{formatKES(amt)}</div>
    }}
  ];

  const totalAmount = txData?.data?.reduce((sum: number, t: any) => {
    const amt = t.lines ? t.lines.reduce((s:number, l:any) => s + (l.credit || 0), 0) : 0;
    return sum + amt;
  }, 0) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>

      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-32">
            <Select 
              label="Type" 
              value={type} 
              onChange={e => setType(e.target.value)}
              options={[
                {label: 'All', value: 'All'},
                {label: 'Income', value: 'Income'},
                {label: 'Expense', value: 'Expense'},
                {label: 'Drawing', value: 'Drawing'}
              ]} 
            />
          </div>
          <div className="w-40">
            <Input label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="w-40">
            <Input label="To" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="w-48">
            <Select 
              label="Category" 
              value={accountId} 
              onChange={e => setAccountId(e.target.value)}
              options={accountOptions}
            />
          </div>
          <div className="w-48">
            <Input 
              label="Search Party/Desc" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search..."
            />
          </div>
          <div>
            <Button variant="ghost" onClick={handleReset}>Reset Filters</Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center px-1">
        <span className="text-sm text-text-secondary">
          Showing {txData?.data?.length || 0} transactions
        </span>
        <span className="text-sm font-semibold text-text-primary">
          Filtered Total: {formatKES(totalAmount)}
        </span>
      </div>

      <Card padding="none" className="overflow-hidden">
        <Table 
          columns={columns}
          data={txData?.data || []}
          loading={txLoading}
          onRowClick={(tx) => setSelectedTransactionId(tx.id)}
        />
        
        {txData && txData.pages > 1 && (
          <div className="p-4 border-t border-bg-border flex justify-between items-center">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-text-secondary">Page {page} of {txData.pages}</span>
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={page === txData.pages} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      <SlideOver 
        open={!!selectedTransactionId} 
        onClose={() => setSelectedTransactionId(null)}
        title="Transaction Details"
      >
        {selectedTxLoading ? (
          <div className="p-6">Loading...</div>
        ) : selectedTx ? (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-mono text-accent font-bold mb-2">{selectedTx.reference}</h2>
              <div className="flex gap-2 items-center text-sm">
                <span className="text-text-secondary">{formatDate(selectedTx.date)}</span>
                <span>•</span>
                {selectedTx.is_void ? (
                  <Badge variant="expense">VOID</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-text-primary">{selectedTx.description}</p>
              {selectedTx.party_id && (
                <p className="text-sm text-text-secondary mt-1">Party: #{selectedTx.party_id}</p>
              )}
            </div>

            <hr className="border-bg-border" />

            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Accounting Entry</h3>
              <div className="bg-bg-base p-4 rounded-lg font-mono text-xs space-y-2 border border-bg-border">
                {selectedTx.lines?.map((l: any) => (
                  <div key={l.id} className="flex justify-between items-center">
                    <span className="text-text-secondary">
                      {l.debit > 0 ? 'DR' : 'CR'} {l.account_name}
                    </span>
                    <span className={l.debit > 0 ? 'text-text-primary' : 'text-text-secondary'}>
                      {formatKES(l.debit > 0 ? l.debit : l.credit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-bg-border" />

            {!selectedTx.is_void && (
              <Button 
                variant="danger" 
                className="w-full"
                onClick={() => setVoidModalOpen(true)}
              >
                Void Transaction
              </Button>
            )}
          </div>
        ) : (
          <div className="p-6 text-text-secondary">Transaction not found.</div>
        )}
      </SlideOver>

      <Modal
        open={voidModalOpen}
        onClose={() => setVoidModalOpen(false)}
        title="Void Transaction"
        footer={
          <>
            <Button variant="ghost" onClick={() => setVoidModalOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={voiding} onClick={handleVoid}>Confirm Void</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to void this transaction? This action cannot be undone and will reverse the accounting entries.
          </p>
          <Input 
            label="Reason for voiding (required)"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            placeholder="E.g., entered in error"
          />
        </div>
      </Modal>
    </div>
  );
}

import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useSearchParties } from '../hooks/useParties';
import { 
  useCreateIncome, 
  useCreateExpense, 
  useCreateDrawing 
} from '../hooks/useTransactions';
import { useDebounce } from '../hooks/useDebounce';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { MpesaImporter } from '../components/MpesaImporter';

type Tab = 'Income' | 'Expense' | 'Drawing';

export default function AddTransaction() {
  const [activeTab, setActiveTab] = useState<Tab>('Income');
  const { data: accounts } = useAccounts();
  
  const { mutate: createIncome, isPending: incomePending } = useCreateIncome();
  const { mutate: createExpense, isPending: expensePending } = useCreateExpense();
  const { mutate: createDrawing, isPending: drawingPending } = useCreateDrawing();

  const isPending = incomePending || expensePending || drawingPending;

  // Common state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Tab specific state
  const [accountId, setAccountId] = useState('');
  const [cashAccountId, setCashAccountId] = useState('');
  const [reference, setReference] = useState('');
  
  // Party Search State
  const [partySearch, setPartySearch] = useState('');
  const debouncedPartySearch = useDebounce(partySearch, 300);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
  const { data: partiesData } = useSearchParties(debouncedPartySearch);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const incomeAccounts = safeAccounts.filter(a => a.type === 'income');
  const expenseAccounts = safeAccounts.filter(a => a.type === 'expense');
  const cashAccounts = safeAccounts.filter(a => ['asset'].includes(a.type) && !a.is_turnover);
  
  const incomeCashAccounts = cashAccounts.filter(a => ['1001', '1002', '1003', '1004'].includes(a.code));
  const expenseCashAccounts = cashAccounts.filter(a => ['1001', '1002', '1003'].includes(a.code));

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setAccountId('');
    setCashAccountId('');
    setSelectedPartyId(null);
    setPartySearch('');
    setReference('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = 'Date is required';
    else if (new Date(date) > new Date()) newErrors.date = 'Date cannot be in the future';

    if (!amount || Number(amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!narration || narration.length < 3) newErrors.narration = 'Narration must be at least 3 characters';

    if (activeTab === 'Income' || activeTab === 'Expense') {
      if (!accountId) newErrors.accountId = 'Category account is required';
    }
    if (!cashAccountId) newErrors.cashAccountId = 'Cash account is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const basePayload = {
      date,
      amount: Number(amount),
      narration: reference ? `${narration} (Ref: ${reference})` : narration,
      partyId: selectedPartyId || undefined,
    };

    const categoryAccount = safeAccounts.find(a => a.id.toString() === accountId);
    const cashAccount = safeAccounts.find(a => a.id.toString() === cashAccountId);

    if (activeTab === 'Income') {
      createIncome({
        ...basePayload,
        revenueAccountCode: categoryAccount!.code,
        cashAccountCode: cashAccount!.code,
      }, { onSuccess: handleSuccess });
    } else if (activeTab === 'Expense') {
      createExpense({
        ...basePayload,
        expenseAccountCode: categoryAccount!.code,
        cashAccountCode: cashAccount!.code,
      }, { onSuccess: handleSuccess });
    } else if (activeTab === 'Drawing') {
      createDrawing({
        date,
        amount: Number(amount),
        narration: reference ? `${narration} (Ref: ${reference})` : narration,
        cashAccountCode: cashAccount!.code,
      }, { onSuccess: handleSuccess });
    }
  };

  const handleSuccess = () => {
    setAmount('');
    setNarration('');
    setReference('');
    setPartySearch('');
    setSelectedPartyId(null);
    setFile(null);
    setErrors({});
  };

  const handlePartySelect = (party: any) => {
    setSelectedPartyId(party.id);
    setPartySearch(party.name);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Add Transaction</h1>

      <Card padding="none" className="overflow-hidden">
        <div className="flex border-b border-bg-border">
          {(['Income', 'Expense', 'Drawing'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors
                ${activeTab === tab 
                  ? 'bg-bg-elevated text-accent border-b-2 border-accent' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-base'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'Drawing' && (
            <div className="bg-warning-subtle border border-warning rounded-lg p-3 text-sm text-warning-foreground font-medium">
              Owner drawings reduce your capital. This is not a business expense.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input 
                label="Date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                disabled={isPending}
              />
              {errors.date && <p className="text-danger text-xs mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <Input 
                label="Amount (KES)" 
                type="number" 
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                disabled={isPending}
              />
              {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount}</p>}
            </div>
          </div>

          {(activeTab === 'Income' || activeTab === 'Expense') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select 
                  label={activeTab === 'Income' ? "Revenue Account" : "Expense Category"}
                  value={accountId} 
                  onChange={(e) => setAccountId(e.target.value)}
                  disabled={isPending}
                  options={[
                    { label: 'Select Account...', value: '' },
                    ...(activeTab === 'Income' ? incomeAccounts : expenseAccounts).map(a => ({
                      label: a.name, value: a.id.toString()
                    }))
                  ]}
                />
                {errors.accountId && <p className="text-danger text-xs mt-1">{errors.accountId}</p>}
              </div>

              <div>
                <Select 
                  label={activeTab === 'Income' ? "Received Into" : "Paid From"}
                  value={cashAccountId} 
                  onChange={(e) => setCashAccountId(e.target.value)}
                  disabled={isPending}
                  options={[
                    { label: 'Select Account...', value: '' },
                    ...(activeTab === 'Income' ? incomeCashAccounts : expenseCashAccounts).map(a => ({
                      label: a.name, value: a.id.toString()
                    }))
                  ]}
                />
                {errors.cashAccountId && <p className="text-danger text-xs mt-1">{errors.cashAccountId}</p>}
              </div>
            </div>
          )}

          {activeTab === 'Drawing' && (
            <div>
              <Select 
                label="Withdrawn From"
                value={cashAccountId} 
                onChange={(e) => setCashAccountId(e.target.value)}
                disabled={isPending}
                options={[
                  { label: 'Select Account...', value: '' },
                  ...cashAccounts.map(a => ({
                    label: a.name, value: a.id.toString()
                  }))
                ]}
              />
              {errors.cashAccountId && <p className="text-danger text-xs mt-1">{errors.cashAccountId}</p>}
            </div>
          )}

          {(activeTab === 'Income' || activeTab === 'Expense') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input 
                  label={activeTab === 'Income' ? "Client / Party" : "Vendor / Party"}
                  placeholder="Type to search..."
                  value={partySearch}
                  onChange={(e) => {
                    setPartySearch(e.target.value);
                    if (selectedPartyId) setSelectedPartyId(null);
                  }}
                  disabled={isPending}
                />
                {partySearch.length >= 2 && !selectedPartyId && partiesData && partiesData.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-bg-surface border border-bg-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {partiesData.map(party => (
                      <div 
                        key={party.id}
                        className="px-4 py-2 hover:bg-bg-elevated cursor-pointer text-sm text-text-primary"
                        onClick={() => handlePartySelect(party)}
                      >
                        {party.name} <span className="text-text-muted text-xs ml-2">({party.type})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Input 
                  label={activeTab === 'Income' ? "Invoice Reference (Optional)" : "Receipt Reference (Optional)"}
                  placeholder="e.g. INV-2024-001"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Narration / Description
            </label>
            <textarea
              className="w-full bg-bg-base border border-bg-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-text-muted resize-none"
              rows={3}
              placeholder={activeTab === 'Drawing' ? "Note about what this drawing is for..." : "Description of the transaction..."}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              disabled={isPending}
              maxLength={200}
            />
            {errors.narration && <p className="text-danger text-xs mt-1">{errors.narration}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Attach Receipt (Optional)
            </label>
            <input 
              type="file" 
              accept="image/*,application/pdf"
              className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-bg-elevated file:text-accent hover:file:bg-bg-border cursor-pointer"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              disabled={isPending}
            />
            {file && (
              <p className="mt-2 text-xs text-text-muted">Selected: {file.name}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            loading={isPending}
          >
            {isPending ? 'Recording...' : `Record ${activeTab}`}
          </Button>
        </form>
      </Card>
      
      <MpesaImporter />
    </div>
  );
}

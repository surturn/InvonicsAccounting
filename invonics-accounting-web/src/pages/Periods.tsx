import React, { useState } from 'react';
import { usePeriods, useClosePeriod } from '../hooks/usePeriods';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatDate } from '../utils/format';
import { Lock, Info } from 'lucide-react';

export default function Periods() {
  const { data: periods, isLoading } = usePeriods();
  const { mutate: closePeriod, isPending } = useClosePeriod();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);

  const handleLock = () => {
    if (selectedPeriod) {
      closePeriod(selectedPeriod.id, {
        onSuccess: () => {
          setModalOpen(false);
          setSelectedPeriod(null);
        }
      });
    }
  };

  const columns = [
    { key: 'name', header: 'Period', render: (p: any) => <span className="font-medium text-text-primary">{p.name}</span> },
    { key: 'start_date', header: 'Start Date', render: (p: any) => formatDate(p.start_date) },
    { key: 'end_date', header: 'End Date', render: (p: any) => formatDate(p.end_date) },
    { key: 'status', header: 'Status', render: (p: any) => (
      <Badge variant={p.is_locked ? 'neutral' : 'success'}>
        {p.is_locked ? 'Locked' : 'Open'}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', render: (p: any) => (
      p.is_locked ? (
        <span className="text-xs text-text-muted flex items-center gap-1">
          <Lock className="w-3 h-3" /> Locked {formatDate(p.end_date)}
        </span>
      ) : (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => { setSelectedPeriod(p); setModalOpen(true); }}
        >
          Lock Period
        </Button>
      )
    )}
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Fiscal Periods</h1>

      <div className="bg-bg-elevated border border-bg-border rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <p className="text-sm text-text-primary">
          Locking a period prevents any changes to entries in that month. 
          Lock each period after filing TOT.
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <Table 
          columns={columns}
          data={Array.isArray(periods) ? periods : []}
          loading={isLoading}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Lock Period"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={isPending} onClick={handleLock}>
              Lock Period
            </Button>
          </>
        }
      >
        <p className="text-text-primary">
          Are you sure you want to lock the period <strong>{selectedPeriod?.name}</strong>? 
          This cannot be undone and will prevent any further transactions from being recorded in this period.
        </p>
      </Modal>
    </div>
  );
}

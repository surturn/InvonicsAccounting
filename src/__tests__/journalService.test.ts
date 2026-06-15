import { createEntry } from '../services/journalService';
import { PoolClient } from 'pg';

jest.mock('../utils/reference', () => ({
  generateReference: jest.fn((type) => Promise.resolve(`${type}-2024-0001`)),
}));

describe('Journal Service', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: jest.fn().mockImplementation((queryStr: string) => {
        if (queryStr.includes('INSERT INTO journal_entries')) {
          return Promise.resolve({ rows: [{ id: 1, reference: 'REF-2024-0001' }] });
        }
        if (queryStr.includes('INSERT INTO journal_lines')) {
          return Promise.resolve({ rows: [{ id: 1 }] });
        }
        return Promise.resolve({ rows: [] });
      }),
    };
  });

  it('accepts a valid balanced entry', async () => {
    const data = {
      date: '2024-01-01',
      narration: 'Test entry',
      transactionType: 'income' as const,
      partyId: null,
      fiscalPeriodId: 1,
      createdBy: 1,
      lines: [
        { accountId: 1, type: 'debit' as const, amount: 1000 },
        { accountId: 2, type: 'credit' as const, amount: 1000 },
      ],
    };

    await expect(createEntry(mockClient, data)).resolves.toBeDefined();
  });

  it('rejects an unbalanced entry', async () => {
    const data = {
      date: '2024-01-01',
      narration: 'Test entry',
      transactionType: 'expense' as const,
      partyId: null,
      fiscalPeriodId: 1,
      createdBy: 1,
      lines: [
        { accountId: 1, type: 'debit' as const, amount: 1000 },
        { accountId: 2, type: 'credit' as const, amount: 999 },
      ],
    };

    await expect(createEntry(mockClient, data)).rejects.toThrow('Journal entry does not balance');
  });

  it('rejects negative amounts', async () => {
    const data = {
      date: '2024-01-01',
      narration: 'Test entry',
      transactionType: 'drawing' as const,
      partyId: null,
      fiscalPeriodId: 1,
      createdBy: 1,
      lines: [
        { accountId: 1, type: 'debit' as const, amount: -500 },
        { accountId: 2, type: 'credit' as const, amount: -500 },
      ],
    };

    await expect(createEntry(mockClient, data)).rejects.toThrow('Line amount must be positive');
  });

  it('generates correct reference formats', async () => {
    const data = {
      date: '2024-01-01',
      narration: 'Test entry',
      partyId: null,
      fiscalPeriodId: 1,
      createdBy: 1,
      lines: [
        { accountId: 1, type: 'debit' as const, amount: 100 },
        { accountId: 2, type: 'credit' as const, amount: 100 },
      ],
    };

    const generateReference = require('../utils/reference').generateReference;

    await createEntry(mockClient, { ...data, transactionType: 'income' });
    expect(generateReference).toHaveBeenCalledWith('INC', mockClient);

    await createEntry(mockClient, { ...data, transactionType: 'expense' });
    expect(generateReference).toHaveBeenCalledWith('EXP', mockClient);

    await createEntry(mockClient, { ...data, transactionType: 'drawing' });
    expect(generateReference).toHaveBeenCalledWith('DRW', mockClient);
  });
});

import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { getAllParties, searchParties, createParty, updateParty } from '../db/queries/parties';

const router = Router();

const createPartySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['client', 'vendor']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional()
});

const updatePartySchema = createPartySchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const { type, search } = req.query;
    
    if (search && typeof search === 'string') {
      const parties = await searchParties(search);
      return res.json(parties);
    }
    
    const parties = await getAllParties(type as string | undefined);
    res.json(parties);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createPartySchema), async (req, res, next) => {
  try {
    const party = await createParty(req.body);
    res.status(201).json(party);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(updatePartySchema), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const party = await updateParty(id, req.body);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json(party);
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from 'express';
import multer from 'multer';
import OpenAI from 'openai';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

router.post('/parse-mpesa-statement', (req, res, next) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      const base64Pdf = req.file.buffer.toString('base64');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.responses.create({
        model: 'gpt-4o',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_file',
                filename: 'mpesa-statement.pdf',
                file_data: `data:application/pdf;base64,${base64Pdf}`,
              },
              {
                type: 'input_text',
                text: `You are a financial data extraction assistant. Extract all transactions 
from this M-Pesa statement PDF and return them as a JSON array.

Each transaction object must have exactly these fields:
{
  "date": "YYYY-MM-DD",
  "description": "string — the full transaction description as shown",
  "amount": number — positive value always,
  "type": "credit" or "debit",
  "balance": number or null
}

Rules:
- "credit" means money received into M-Pesa (income)
- "debit" means money sent out of M-Pesa (expense)
- Do not include the opening or closing balance rows as transactions
- Do not include failed or reversed transactions
- Return ONLY a valid JSON array. No explanation, no markdown, no code fences.`,
              },
            ],
          },
        ],
      });

      const raw = response.output_text;
      const transactions = JSON.parse(raw);

      return res.status(200).json({
        transactions,
        count: Array.isArray(transactions) ? transactions.length : 0
      });

    } catch (error) {
      console.error(error);
      return res.status(502).json({ error: 'Parsing service unavailable' });
    }
  });
});

export default router;

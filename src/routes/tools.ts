import { Router } from 'express';
import multer from 'multer';
import OpenAI from 'openai';
const pdfParse = require('pdf-parse');

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

      const password = req.body.password;
      if (!password) {
        return res.status(400).json({ error: 'Password is required to decrypt the M-Pesa statement' });
      }

      let parsedPdf;
      try {
        parsedPdf = await pdfParse(req.file.buffer, {
          password: password,
        } as any);
      } catch (parseError: any) {
        if (parseError.name === 'PasswordException') {
          return res.status(401).json({ error: 'Incorrect password for PDF decryption' });
        }
        throw parseError;
      }

      const extractedText = parsedPdf.text;
      
      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({ error: 'Failed to extract text from PDF or PDF is empty' });
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.responses.create({
        model: 'gpt-4o',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `You are a financial data extraction assistant. Extract all transactions 
from the following raw text extracted from an M-Pesa statement PDF and return them as a JSON array.

RAW TEXT:
${extractedText.substring(0, 30000)} // Limit to roughly 30k chars just in case

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
      console.error('M-Pesa Parsing Error:', error);
      return res.status(502).json({ error: 'Parsing service unavailable or failed to process' });
    }
  });
});

export default router;

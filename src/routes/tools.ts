import { Router } from 'express';
import multer from 'multer';
import OpenAI from 'openai';
const pdfParse = require('pdf-parse');

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImageMime = file.mimetype.startsWith('image/');
    const isImageExt = file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
    if (file.mimetype === 'application/pdf' || isImageMime || isImageExt) cb(null, true);
    else cb(new Error('Only PDF and image files allowed'));
  }
});

router.post('/parse-mpesa-statement', (req, res, next) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const isImageMime = req.file.mimetype.startsWith('image/');
      const isImageExt = req.file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
      const isImage = isImageMime || isImageExt;
      const password = req.body.password;
      
      if (!isImage && !password) {
        return res.status(400).json({ error: 'Password is required to decrypt the M-Pesa statement PDF' });
      }

      let extractedText = '';
      let messages: any[] = [];

      if (!isImage) {
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

        extractedText = parsedPdf.text;
        
        if (!extractedText || extractedText.trim().length === 0) {
          return res.status(400).json({ error: 'Failed to extract text from PDF or PDF is empty' });
        }

        messages = [
          {
            role: 'user',
            content: `You are a financial data extraction assistant. Extract all transactions 
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
        ];
      } else {
        const base64Image = req.file.buffer.toString('base64');
        let finalMimeType = req.file.mimetype;
        if (!req.file.mimetype.startsWith('image/')) {
          const ext = req.file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
          if (ext) {
            if (ext[1] === 'png') finalMimeType = 'image/png';
            else if (ext[1] === 'webp') finalMimeType = 'image/webp';
            else if (ext[1] === 'gif') finalMimeType = 'image/gif';
            else finalMimeType = 'image/jpeg';
          } else {
            finalMimeType = 'image/jpeg'; // Fallback
          }
        }
        
        messages = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a financial data extraction assistant. Extract all transactions from this M-Pesa screenshot and return them as a JSON array.

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
- Return ONLY a valid JSON array. No explanation, no markdown, no code fences.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${finalMimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ];
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
      });

      const raw = response.choices[0].message.content || '[]';
      // Clean up markdown block if present
      const cleanedRaw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const transactions = JSON.parse(cleanedRaw);

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

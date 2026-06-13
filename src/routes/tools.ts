import { Router } from 'express';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

router.post('/parse-mpesa-statement', authenticateToken, (req, res, next) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      const base64Pdf = req.file.buffer.toString('base64');
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64Pdf
                }
              } as any,
              {
                type: 'text',
                text: "Extract all transactions from this M-Pesa statement. Return ONLY a valid JSON array, no markdown, no explanation. Each object: { date: 'YYYY-MM-DD', description: string, amount: number (positive=money in, negative=money out), balance: number, type: 'in'|'out', party: string }"
              }
            ]
          }
        ]
      });

      const responseText = (message.content[0] as Anthropic.TextBlock).text;
      const stripped = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      
      let parsed;
      try {
        parsed = JSON.parse(stripped);
      } catch (parseErr) {
        return res.status(422).json({ error: 'Could not parse statement' });
      }

      return res.status(200).json({
        transactions: parsed,
        count: Array.isArray(parsed) ? parsed.length : 0
      });

    } catch (error) {
      console.error(error);
      return res.status(502).json({ error: 'Parsing service unavailable' });
    }
  });
});

export default router;

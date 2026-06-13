import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';
import { query } from '../db/pool';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email }, 
      secret, 
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Required for cross-origin cookies
      sameSite: 'none', // Required for cross-origin cookies
      maxAge: 8 * 60 * 60 * 1000 // 8 hours in ms
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  return res.status(200).json({ message: 'Logged out' });
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const result = await query('SELECT id, email, name, role FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

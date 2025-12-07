import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../db';

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signToken = (userId: number) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

router.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  const { fullName, email, phone, password } = parsed.data;
  const client = await pool.connect();
  try {
    const existing = await client.query('select user_id from users where email=$1', [email]);
    if (existing.rowCount) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const hash = await bcrypt.hash(password, 10);
    const inserted = await client.query(
      'insert into users(full_name,email,phone,password_hash) values ($1,$2,$3,$4) returning user_id, full_name, email, phone',
      [fullName, email, phone, hash]
    );
    const user = inserted.rows[0];
    const token = signToken(user.user_id);
    res.json({ token, user });
  } finally {
    client.release();
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  const { email, password } = parsed.data;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'select user_id, full_name, email, phone, password_hash from users where email=$1',
      [email]
    );
    if (!result.rowCount) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user.user_id);
    res.json({
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });
  } finally {
    client.release();
  }
});

export default router;


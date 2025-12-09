import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { z } from 'zod';
import { pool } from '../db';
import { sendPasswordResetEmail } from '../utils/mailer';

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

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(10),
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

router.post('/forgot-password', async (req: Request, res: Response) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  const { email } = parsed.data;
  const client = await pool.connect();
  try {
    const user = await client.query(
      'select user_id, email from users where email=$1',
      [email]
    );
    if (!user.rowCount) {
      return res.json({ message: 'If email exists, reset link sent' });
    }
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await client.query(
      'insert into password_reset_tokens(user_id, token_hash, expires_at) values ($1,$2,$3)',
      [user.rows[0].user_id, tokenHash, expires]
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = `${frontendUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, link);
    return res.json({ message: 'If email exists, reset link sent' });
  } finally {
    client.release();
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  const { token, password } = parsed.data;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const client = await pool.connect();
  try {
    const found = await client.query(
      `select pr.user_id
       from password_reset_tokens pr
       where pr.token_hash=$1
         and pr.used_at is null
         and pr.expires_at > now()
       order by pr.created_at desc
       limit 1`,
      [tokenHash]
    );
    if (!found.rowCount) {
      return res.status(400).json({ message: 'Token invalid or expired' });
    }
    const userId = found.rows[0].user_id;
    const hash = await bcrypt.hash(password, 10);
    await client.query('update users set password_hash=$1 where user_id=$2', [hash, userId]);
    await client.query(
      'update password_reset_tokens set used_at=now() where token_hash=$1',
      [tokenHash]
    );
    await client.query('delete from password_reset_tokens where user_id=$1 and used_at is not null', [userId]);
    const userRes = await client.query(
      'select user_id, full_name, email, phone from users where user_id=$1',
      [userId]
    );
    const user = userRes.rows[0];
    const jwtToken = signToken(user.user_id);
    return res.json({ token: jwtToken, user });
  } finally {
    client.release();
  }
});

export default router;


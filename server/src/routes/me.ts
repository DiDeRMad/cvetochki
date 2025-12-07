import { Router } from 'express';
import { pool } from '../db';
import { authGuard, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authGuard, async (req: AuthRequest, res) => {
  const client = await pool.connect();
  try {
    const me = await client.query(
      'select user_id, full_name, email, phone, created_at from users where user_id=$1',
      [req.userId]
    );
    if (!me.rowCount) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(me.rows[0]);
  } finally {
    client.release();
  }
});

export default router;


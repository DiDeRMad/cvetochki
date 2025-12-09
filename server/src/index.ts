import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import ordersRoutes from './routes/orders';
import meRoutes from './routes/me';
import { pool } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/me', meRoutes);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('select 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ status: 'error' });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  process.stdout.write(`Server running on port ${port}\n`);
});








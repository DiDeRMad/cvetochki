import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { authGuard, AuthRequest } from '../middleware/auth';

const router = Router();

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  addons: z.array(z.string()).default([]),
});

const orderSchema = z.object({
  city: z.string().min(1),
  address: z.string().min(1),
  deliveryTime: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
});

router.post('/', authGuard, async (req: AuthRequest, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  const { city, address, deliveryTime, items } = parsed.data;
  const client = await pool.connect();
  try {
    await client.query('begin');

    const productIds = items.map((i) => i.productId);
    const products = await client.query(
      'select product_id, price, status from products where product_id = any($1)',
      [productIds]
    );
    const priceMap = new Map<number, number>();
    products.rows.forEach((p) => priceMap.set(p.product_id, Number(p.price)));

    const addonsResult = await client.query('select addon_id, price from addons where is_active = true');
    const addonMap = new Map<string, number>();
    addonsResult.rows.forEach((a) => addonMap.set(a.addon_id, Number(a.price)));

    let subtotal = 0;
    const normalized = items.map((item) => {
      const base = priceMap.get(item.productId);
      if (!base) {
        throw new Error('Product not found');
      }
      const addonsSum = item.addons.reduce((sum, id) => sum + (addonMap.get(id) || 0), 0);
      const unit = base + addonsSum;
      const total = unit * item.quantity;
      subtotal += total;
      return { ...item, basePrice: base, addonsSum, total, unitPrice: unit };
    });

    const shipping = subtotal > 0 ? 300 : 0;
    const total = subtotal + shipping;

    const orderInsert = await client.query(
      'insert into orders(user_id, city, address, delivery_time, status, subtotal, shipping, total) values ($1,$2,$3,$4,$5,$6,$7,$8) returning order_id, created_at',
      [req.userId, city, address, deliveryTime, 'created', subtotal, shipping, total]
    );
    const orderId = orderInsert.rows[0].order_id;

    for (const item of normalized) {
      const itemInsert = await client.query(
        'insert into order_items(order_id, product_id, quantity, unit_price, addons_price, total) values ($1,$2,$3,$4,$5,$6) returning order_item_id',
        [orderId, item.productId, item.quantity, item.basePrice, item.addonsSum, item.total]
      );
      const orderItemId = itemInsert.rows[0].order_item_id;
      for (const addonId of item.addons) {
        await client.query(
          'insert into order_item_addons(order_item_id, addon_id, price_at_purchase) values ($1,$2,$3)',
          [orderItemId, addonId, addonMap.get(addonId) || 0]
        );
      }
    }

    await client.query('commit');

    res.json({
      id: orderId,
      totals: { subtotal, shipping, total },
      delivery: { city, address, time: deliveryTime },
      createdAt: orderInsert.rows[0].created_at,
      items: normalized.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        addons: i.addons,
        unitPrice: i.basePrice,
        addonsPrice: i.addonsSum,
        total: i.total,
      })),
    });
  } catch (error) {
    await client.query('rollback');
    res.status(400).json({ message: (error as Error).message });
  } finally {
    client.release();
  }
});

router.get('/last', authGuard, async (req: AuthRequest, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `select o.order_id as id,
              o.city,
              o.address,
              o.delivery_time as time,
              o.subtotal,
              o.shipping,
              o.total,
              o.created_at,
              coalesce(
                json_agg(
                  json_build_object(
                    'productId', oi.product_id,
                    'quantity', oi.quantity,
                    'unitPrice', oi.unit_price,
                    'addonsPrice', oi.addons_price,
                    'total', oi.total,
                    'addons', (
                      select coalesce(json_agg(oia.addon_id), '[]')
                      from order_item_addons oia
                      where oia.order_item_id = oi.order_item_id
                    )
                  )
                ) filter (where oi.order_item_id is not null), '[]'
              ) as items
         from orders o
         left join order_items oi on oi.order_id = o.order_id
        where o.user_id = $1
        group by o.order_id
        order by o.created_at desc
        limit 1`,
      [req.userId]
    );
    if (!result.rowCount) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

export default router;


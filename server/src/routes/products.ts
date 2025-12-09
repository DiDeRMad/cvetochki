import { Router } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const client = await pool.connect();
  try {
    const products = await client.query(
      `select p.product_id as id,
              p.name,
              p.description,
              p.price,
              p.status,
              coalesce(json_agg(pi.url order by pi.sort_order) filter (where pi.url is not null), '[]') as images,
              coalesce(json_agg(pc.category_id) filter (where pc.category_id is not null), '[]') as category_ids
         from products p
         left join product_images pi on pi.product_id = p.product_id
         left join product_categories pc on pc.product_id = p.product_id
        where p.status = 'active'
        group by p.product_id
        order by p.created_at desc`
    );
    res.json(products.rows);
  } finally {
    client.release();
  }
});

export default router;








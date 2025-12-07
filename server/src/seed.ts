import dotenv from 'dotenv';
import { pool } from './db';

dotenv.config();

const products = [
  {
    name: 'Розовые розы',
    description: 'Элегантный букет из нежных розовых роз премиум-класса с декоративной зеленью.',
    price: 2500,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504203700686-0f3736c8badc?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['roses'],
  },
  {
    name: 'Красные тюльпаны',
    description: 'Яркий весенний букет из свежих красных тюльпанов.',
    price: 1200,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['tulips'],
  },
  {
    name: 'Пастельный шарм',
    description: 'Нежная композиция из пастельных цветов с эвкалиптом.',
    price: 1800,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1487538105893-5ca423fb4935?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['pastel'],
  },
  {
    name: 'Солнечные подсолнухи',
    description: 'Яркие подсолнухи премиум-качества в крафтовой упаковке.',
    price: 1600,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['sunflowers'],
  },
  {
    name: 'Белые лилии',
    description: 'Изысканные белые лилии премиум-класса – символ чистоты и элегантности.',
    price: 2200,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['lilies'],
  },
  {
    name: 'Полевой микс',
    description: 'Жизнерадостный букет из полевых цветов различных оттенков.',
    price: 1400,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['wild'],
  },
  {
    name: 'Красные розы',
    description: 'Классический букет из алых роз премиум-класса.',
    price: 2800,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1442410519123-a33d5dc262b1?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['roses'],
  },
  {
    name: 'Желтые тюльпаны',
    description: 'Солнечный букет из ярких желтых тюльпанов.',
    price: 1300,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['tulips'],
  },
  {
    name: 'Романтический микс',
    description: 'Романтическая композиция из розовых и белых цветов с эвкалиптом.',
    price: 2000,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['pastel'],
  },
  {
    name: 'Тропический микс',
    description: 'Экзотическая композиция из тропических цветов с декоративной зеленью.',
    price: 2400,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    ],
    categories: ['wild'],
  },
];

const categoryMap: Record<string, string> = {
  roses: 'Розы',
  tulips: 'Тюльпаны',
  lilies: 'Лилии',
  sunflowers: 'Подсолнухи',
  pastel: 'Пастельные',
  wild: 'Полевые',
};

const roles = [
  { code: 'admin', name: 'Администратор' },
  { code: 'customer', name: 'Клиент' },
];

const addons = [
  { id: 'card', name: 'Открытка с пожеланием', price: 200 },
  { id: 'vase', name: 'Стеклянная ваза', price: 500 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('begin');

    for (const role of roles) {
      await client.query(
        'insert into roles(role_code, role_name) values ($1,$2) on conflict (role_code) do nothing',
        [role.code, role.name]
      );
    }

    for (const addon of addons) {
      await client.query(
        'insert into addons(addon_id, addon_name, price, is_active) values ($1,$2,$3,true) on conflict (addon_id) do update set price=$3, addon_name=$2, is_active=true',
        [addon.id, addon.name, addon.price]
      );
    }

    const categoryIds = new Map<string, number>();
    for (const [code, name] of Object.entries(categoryMap)) {
      const inserted = await client.query(
        'insert into categories(category_name) values ($1) on conflict (category_name) do update set category_name=excluded.category_name returning category_id',
        [name]
      );
      categoryIds.set(code, inserted.rows[0].category_id);
    }

    for (const product of products) {
      const inserted = await client.query(
        'insert into products(name, description, price, status) values ($1,$2,$3,$4) returning product_id',
        [product.name, product.description, product.price, product.status]
      );
      const productId = inserted.rows[0].product_id;

      for (let i = 0; i < product.images.length; i++) {
        await client.query(
          'insert into product_images(product_id, url, sort_order) values ($1,$2,$3)',
          [productId, product.images[i], i]
        );
      }

      for (const cat of product.categories) {
        const catId = categoryIds.get(cat);
        if (catId) {
          await client.query(
            'insert into product_categories(product_id, category_id) values ($1,$2) on conflict do nothing',
            [productId, catId]
          );
        }
      }
    }

    await client.query('commit');
    process.stdout.write('Seed completed\n');
  } catch (error) {
    await client.query('rollback');
    process.stderr.write(`Seed failed: ${(error as Error).message}\n`);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();


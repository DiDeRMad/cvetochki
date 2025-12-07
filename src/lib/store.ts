import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import bouquetRoses from '@/assets/bouquet-roses.jpg';
import bouquetTulips from '@/assets/bouquet-tulips.jpg';
import bouquetPastel from '@/assets/bouquet-pastel.jpg';
import bouquetSunflowers from '@/assets/bouquet-sunflowers.jpg';
import bouquetLilies from '@/assets/bouquet-lilies.jpg';
import bouquetWild from '@/assets/bouquet-wild.jpg';
import pinkRoses1 from '@/assets/1750383080_59323326.jpg';
import pinkRoses2 from '@/assets/IMG-20250409-WA0018.jpg';
import redTulips1 from '@/assets/AUX_a6c32999-55da-4d69-a5b9-405aae7bc598.jpg';
import redTulips2 from '@/assets/IMG_5916.jpg';
import pastelCharm1 from '@/assets/IMG_0917.jpg';
import pastelCharm2 from '@/assets/1719317518_81043805.jpg';
import sunflowers1 from '@/assets/b0.jpg';
import whiteLilies1 from '@/assets/1752904325_6224315.jpg';
import whiteLilies2 from '@/assets/1731681961_87593251.jpg';
import wildMix1 from '@/assets/7746402367.jpg';
import wildMix2 from '@/assets/1744712881_95179608.jpg';
import yellowTulips1 from '@/assets/1734629533_5366662.jpg';
import yellowTulips2 from '@/assets/photo_5334565414648279498_y-991x1024.jpg';
import yellowTulips3 from '@/assets/1740582623_32916100.jpg';
import tropicalMix1 from '@/assets/347b0846226fa1cd4d3d4d245a6aaece.jpg';
import tropicalMix2 from '@/assets/ff137fee0a3c3b952d7a666bca3693c2.jpg';
import tropicalMix3 from '@/assets/600012378694b1.jpg';
import redRoses1 from '@/assets/7343263929.jpg';
import redRoses2 from '@/assets/1754030156_76590244.jpg';
import redRoses3 from '@/assets/1714302109_16943073.jpg';
import romanticMix1 from '@/assets/63a8aa16883e117f00cb79a8caa169f5.jpg';
import romanticMix2 from '@/assets/80467756.jpg';
import romanticMix3 from '@/assets/e929cea3a9335896622e6ebc85ac896e.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addons: string[];
}

export interface DeliveryDetails {
  city: string;
  address: string;
  time: string;
}

export interface OrderSummary {
  id: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  delivery: DeliveryDetails;
  createdAt: string;
}

interface FlowerStore {
  products: Product[];
  cart: CartItem[];
  shippingPrice: number;
  lastOrder: OrderSummary | null;
  addToCart: (product: Product, quantity?: number, addons?: string[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getCartTotals: () => { subtotal: number; shipping: number; total: number };
  clearCart: () => void;
  createOrder: (details: DeliveryDetails) => OrderSummary | null;
  setLastOrder: (order: OrderSummary | null) => void;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Розовые розы',
    price: 2500,
    image: bouquetRoses,
    description: 'Элегантный букет из нежных розовых роз премиум-класса с декоративной зеленью. Каждая роза тщательно отобрана и обработана нашими флористами для максимальной свежести и долговечности. Букет идеально подходит для романтических событий, признаний в любви, дней рождения и юбилеев. Розовые розы символизируют нежность, благодарность и восхищение. Букет оформлен в стильной упаковке и будет радовать получателя до 7-10 дней при правильном уходе. В комплекте прилагается инструкция по уходу за цветами.',
    images: [bouquetRoses, pinkRoses1, pinkRoses2],
  },
  {
    id: '2',
    name: 'Красные тюльпаны',
    price: 1200,
    image: bouquetTulips,
    description: 'Яркий весенний букет из свежих красных тюльпанов голландского качества в стильной крафтовой упаковке. Тюльпаны срезаны на пике цветения и доставлены в специальных условиях для сохранения свежести. Идеальный выбор для весенних праздников, 8 марта, дня рождения или просто для поднятия настроения. Красные тюльпаны символизируют страсть, любовь и энергию. Букет создаст праздничное настроение и наполнит помещение нежным ароматом. При правильном уходе цветы сохранят свою красоту до 5-7 дней.',
    images: [bouquetTulips, redTulips1, redTulips2],
  },
  {
    id: '3',
    name: 'Пастельный шарм',
    price: 1800,
    image: bouquetPastel,
    description: 'Нежная композиция из пастельных цветов с эвкалиптом и декоративной зеленью. Букет создан в романтическом стиле с использованием розовых, персиковых и кремовых оттенков. Идеально подходит для создания атмосферы уюта и тепла в доме. Композиция включает различные виды цветов, гармонично сочетающихся между собой. Подходит для подарка на день рождения, годовщину, или просто для украшения интерьера. Пастельные тона создают спокойную и умиротворенную атмосферу. Букет оформлен в элегантной упаковке и будет радовать глаз до 6-8 дней.',
    images: [bouquetPastel, pastelCharm1, pastelCharm2],
  },
  {
    id: '4',
    name: 'Солнечные подсолнухи',
    price: 1600,
    image: bouquetSunflowers,
    description: 'Яркие подсолнухи премиум-качества в крафтовой упаковке. Каждый цветок отобран вручную для создания идеальной композиции. Подсолнухи символизируют солнце, радость и оптимизм, принесут свет и позитив в любой дом. Букет идеально подходит для поднятия настроения, поздравлений с достижениями или просто для создания летней атмосферы в любое время года. Крупные цветы создают яркий акцент в интерьере и привлекают внимание. Композиция дополнена декоративной зеленью для создания естественного вида. При правильном уходе подсолнухи сохранят свою свежесть до 7-10 дней.',
    images: [bouquetSunflowers, sunflowers1, bouquetSunflowers],
  },
  {
    id: '5',
    name: 'Белые лилии',
    price: 2200,
    image: bouquetLilies,
    description: 'Изысканные белые лилии премиум-класса – символ чистоты, элегантности и благородства. Каждая лилия тщательно отобрана нашими флористами для создания идеальной композиции. Букет идеально подходит для торжественных событий, свадеб, юбилеев, или для выражения глубоких чувств. Белые лилии создают атмосферу роскоши и изысканности. Композиция оформлена в элегантной упаковке с декоративными элементами. Цветы обладают нежным, приятным ароматом, который наполнит помещение. При правильном уходе лилии будут радовать своей красотой до 8-12 дней. В комплекте прилагается подробная инструкция по уходу.',
    images: [bouquetLilies, whiteLilies1, whiteLilies2],
  },
  {
    id: '6',
    name: 'Полевой микс',
    price: 1400,
    image: bouquetWild,
    description: 'Яркий и жизнерадостный букет из полевых цветов различных оттенков. Композиция создает настроение лета, свежести и свободы. В букет входят различные виды полевых цветов, гармонично сочетающихся между собой. Идеальный выбор для тех, кто ценит естественную красоту и простоту. Букет подходит для подарка на день рождения, для украшения интерьера в деревенском или скандинавском стиле, или просто для поднятия настроения. Полевые цветы создают ощущение близости к природе и напоминают о теплых летних днях. Композиция оформлена в стильной упаковке и будет радовать до 5-7 дней при правильном уходе.',
    images: [bouquetWild, wildMix1, wildMix2],
  },
  {
    id: '7',
    name: 'Красные розы',
    price: 2800,
    image: redRoses1,
    description: 'Классический букет из алых роз премиум-класса – символ страстной любви и глубоких чувств. Каждая роза отобрана вручную нашими флористами для создания идеальной композиции. Букет идеально подходит для признаний в любви, предложения руки и сердца, годовщин и особых романтических моментов. Красные розы создают атмосферу страсти и романтики. Композиция дополнена декоративной зеленью и оформлена в элегантной упаковке. При правильном уходе розы сохранят свою красоту до 8-10 дней. В комплекте прилагается инструкция по уходу и открытка.',
    images: [redRoses1, redRoses2, redRoses3],
  },
  {
    id: '8',
    name: 'Желтые тюльпаны',
    price: 1300,
    image: yellowTulips1,
    description: 'Солнечный букет из ярких желтых тюльпанов голландского качества. Желтые тюльпаны символизируют радость, дружбу и оптимизм. Идеальный выбор для поднятия настроения, поздравлений с достижениями или просто для создания весеннего настроения в любое время года. Букет создаст атмосферу тепла и позитива. Композиция оформлена в стильной крафтовой упаковке и будет радовать глаз до 6-8 дней при правильном уходе. Каждый тюльпан срезан на пике цветения для максимальной свежести.',
    images: [yellowTulips1, yellowTulips2, yellowTulips3],
  },
  {
    id: '9',
    name: 'Романтический микс',
    price: 2000,
    image: romanticMix1,
    description: 'Нежная романтическая композиция из розовых и белых цветов с эвкалиптом. Букет создан для выражения нежных чувств и создания атмосферы романтики. Идеально подходит для первого свидания, годовщины отношений или просто для выражения симпатии. Композиция включает различные виды цветов в нежных пастельных тонах, гармонично сочетающихся между собой. Букет оформлен в элегантной упаковке и будет радовать получателя до 7-9 дней при правильном уходе.',
    images: [romanticMix1, romanticMix2, romanticMix3],
  },
  {
    id: '10',
    name: 'Тропический микс',
    price: 2400,
    image: tropicalMix1,
    description: 'Экзотическая композиция из тропических цветов различных оттенков с декоративной зеленью. Букет создает впечатление роскоши и изысканности. Идеально подходит для особых случаев, юбилеев, корпоративных подарков или для выражения глубокого уважения. Композиция включает различные виды тропических цветов, создающих яркий акцент в интерьере. Цветы обладают нежным ароматом, который наполнит помещение. Букет оформлен в премиальной упаковке и будет радовать своей красотой до 9-12 дней при правильном уходе.',
    images: [tropicalMix1, tropicalMix2, tropicalMix3],
  },
];

export const addonPrices: Record<string, number> = {
  card: 200,
  vase: 500,
};

export const useFlowerStore = create<FlowerStore>()(
  persist(
    (set, get) => ({
  products,
  cart: [],
  shippingPrice: 300,
  lastOrder: null,
  
  addToCart: (product, quantity = 1, addons = []) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity, addons }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity, addons }] };
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  
  getCartTotal: () => {
    return get().cart.reduce((total, item) => {
      const addonsSum = item.addons.reduce(
        (sum, id) => sum + (addonPrices[id] || 0),
        0
      );
      return total + (item.product.price + addonsSum) * item.quantity;
    }, 0);
  },
  
  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },

  getCartTotals: () => {
    const subtotal = get().getCartTotal();
    const shipping = subtotal > 0 ? get().shippingPrice : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  },

  clearCart: () => {
    set({ cart: [] });
  },

  setLastOrder: (order) => {
    set({ lastOrder: order });
  },

  createOrder: (details) => {
    const itemsSnapshot = get().cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      addons: [...item.addons],
    }));

    if (itemsSnapshot.length === 0) {
      return null;
    }

    const subtotal = itemsSnapshot.reduce((total, item) => {
      const addonsSum = item.addons.reduce(
        (sum, id) => sum + (addonPrices[id] || 0),
        0
      );
      return total + (item.product.price + addonsSum) * item.quantity;
    }, 0);

    const shipping = subtotal > 0 ? get().shippingPrice : 0;
    const total = subtotal + shipping;

    const order: OrderSummary = {
      id: `FS-${Date.now()}`,
      items: itemsSnapshot,
      totals: { subtotal, shipping, total },
      delivery: details,
      createdAt: new Date().toISOString(),
    };

    set({
      lastOrder: order,
      cart: [],
    });

    return order;
  },
    }),
    {
      name: 'flower-store',
      partialize: (state) => ({
        cart: state.cart,
        lastOrder: state.lastOrder,
      }),
    }
  )
);

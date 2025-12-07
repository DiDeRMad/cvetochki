import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, MapPin, Clock, Receipt, Flower2 } from 'lucide-react';
import { addonPrices, useFlowerStore } from '@/lib/store';
import { fadeUp } from '@/lib/motion';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export const OrderConfirmationPage = () => {
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );
  const navigate = useNavigate();
  const { lastOrder, setLastOrder } = useFlowerStore();
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTriedLoad, setHasTriedLoad] = useState(false);

  useEffect(() => {
    const loadLast = async () => {
      if (lastOrder || !token || hasTriedLoad) return;
      setIsLoading(true);
      try {
        const order = await apiFetch<any>('/orders/last');
        if (order) {
          setLastOrder({
            id: String(order.id),
            items: (order.items || []).map((i: any) => ({
              product: {
                id: String(i.productid || i.productId || i.product_id || ''),
                name: i.name || 'Товар',
                price: Number(i.unitprice || i.unitPrice || 0) + Number(i.addonsprice || i.addonsPrice || 0),
                image: '',
                description: '',
                images: [],
              },
              quantity: i.quantity || 1,
              addons: i.addons || [],
            })),
            totals: {
              subtotal: Number(order.subtotal || 0),
              shipping: Number(order.shipping || 0),
              total: Number(order.total || 0),
            },
            delivery: {
              city: order.city || '',
              address: order.address || '',
              time: order.time || '',
            },
            createdAt: order.created_at || new Date().toISOString(),
          });
        }
      } catch {
        setLastOrder(null);
      } finally {
        setHasTriedLoad(true);
        setIsLoading(false);
      }
    };
    loadLast();
  }, [lastOrder, token, setLastOrder, hasTriedLoad]);

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background flex items-center justify-center px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-3xl p-6 shadow-soft text-center space-y-3 max-w-sm w-full"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {isLoading ? 'Загружаем заказ...' : 'Заказ не найден'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isLoading ? 'Пробуем получить последние данные' : 'Оформите заказ ещё раз, чтобы увидеть детали.'}
          </p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/catalog')}
              className="btn-primary w-full"
            >
              В каталог
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full py-3 rounded-2xl bg-secondary text-foreground font-semibold"
            >
              В оформление
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const deliveryDate = new Date(lastOrder.createdAt).toLocaleString('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 px-4 py-4"
      >
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-4 shadow-soft">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/catalog')}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={isIOS ? undefined : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Flower2 className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-xl font-bold text-gradient">Подтверждение</h1>
          </div>
        </div>
      </motion.header>

      <main className="px-4 pt-2 relative z-10 space-y-4">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 shadow-soft text-center space-y-3"
        >
          <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-card">
            <CheckCircle2 className="w-9 h-9 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Ваш заказ успешно оформлен!</h2>
          <p className="text-muted-foreground text-sm">Номер заказа {lastOrder.id}</p>
          <p className="text-muted-foreground text-sm">Создан {deliveryDate}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-3xl p-4 shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="font-semibold text-foreground">Данные доставки</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-2xl bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Город</p>
              <p className="text-foreground font-semibold">{lastOrder.delivery.city}</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Адрес</p>
              <p className="text-foreground font-semibold">{lastOrder.delivery.address}</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Время</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-foreground font-semibold">{lastOrder.delivery.time}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-4 shadow-soft space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <p className="font-semibold text-foreground">Детали заказа</p>
            </div>
            <span className="text-sm text-muted-foreground">{lastOrder.items.length} поз.</span>
          </div>

          <div className="space-y-3">
            {lastOrder.items.map((item) => {
              const addonsLabel = item.addons.length > 0 ? ` · ${item.addons.length} доп.` : '';
              const itemTotal = (item.product.price + item.addons.reduce((sum, id) => sum + (addonPrices[id] || 0), 0)) * item.quantity;
              return (
                <div key={item.product.id} className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
                  <div>
                    <p className="font-semibold text-foreground leading-tight">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} шт.{addonsLabel}
                    </p>
                  </div>
                  <p className="font-bold text-gradient">{itemTotal.toLocaleString('ru-RU')} ₽</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Подытог</span>
              <span className="text-foreground font-medium">{lastOrder.totals.subtotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Доставка</span>
              <span className="text-foreground font-medium">{lastOrder.totals.shipping.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Итого</span>
              <span className="font-bold text-2xl text-gradient">
                {lastOrder.totals.total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </motion.section>
      </main>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.15 }}
        className="fixed bottom-0 left-0 right-0 z-[100] glass-card border-t border-border p-4 safe-area-inset-bottom"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/catalog')}
            className="w-full py-3 rounded-2xl bg-secondary text-foreground font-semibold"
          >
            В каталог
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profile')}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Готово
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};


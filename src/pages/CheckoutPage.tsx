import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Home, Clock, ShieldCheck, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';
import { addonPrices, useFlowerStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { fadeUp, glowPulse, staggerContainer } from '@/lib/motion';

const cityOptions = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск'];
const buildDeliveryTimeOptions = () => {
  const now = new Date();
  const start = new Date(now.getTime() + 60 * 60 * 1000);
  const remainder = start.getMinutes() % 30;
  if (remainder > 0) {
    start.setMinutes(start.getMinutes() + (30 - remainder), 0, 0);
  } else {
    start.setMinutes(start.getMinutes(), 0, 0);
  }

  return Array.from({ length: 48 }, (_, index) => {
    const slot = new Date(start.getTime() + index * 30 * 60 * 1000);
    const hours = String(slot.getHours()).padStart(2, '0');
    const minutes = String(slot.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
};

export const CheckoutPage = () => {
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );
  const navigate = useNavigate();
  const { cart, getCartTotals } = useFlowerStore();
  const { token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subtotal, shipping, total } = getCartTotals();

  const deliveryTimeOptions = useMemo(buildDeliveryTimeOptions, []);
  const [city, setCity] = useState(cityOptions[0]);
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState(deliveryTimeOptions[0] || '');

  useEffect(() => {
    if (!deliveryTime && deliveryTimeOptions[0]) {
      setDeliveryTime(deliveryTimeOptions[0]);
    }
  }, [deliveryTime, deliveryTimeOptions]);

  const calculateItemTotal = (item: (typeof cart)[number]) => {
    const addonsSum = item.addons.reduce((sum, id) => sum + (addonPrices[id] || 0), 0);
    return (item.product.price + addonsSum) * item.quantity;
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    if (!city.trim() || !address.trim() || !deliveryTime.trim()) {
      toast.error('Заполните город, адрес и время доставки');
      return;
    }

    if (!token) {
      toast.error('Войдите, чтобы оформить заказ');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Корзина пуста');
      navigate('/catalog');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch<{
        id: number;
        totals: { subtotal: number; shipping: number; total: number };
        delivery: { city: string; address: string; time: string };
        items: { productId: number; quantity: number; addons: string[]; unitPrice: number; addonsPrice: number; total: number }[];
      }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          city: city.trim(),
          address: address.trim(),
          deliveryTime,
          items: cart.map((item) => ({
            productId: Number(item.product.id),
            quantity: item.quantity,
            addons: item.addons,
          })),
        }),
      });

      useFlowerStore.getState().clearCart();
      useFlowerStore.getState().setLastOrder({
        id: String(response.id),
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          addons: item.addons,
        })),
        totals: response.totals,
        delivery: response.delivery,
        createdAt: new Date().toISOString(),
      });

      toast.success('Заказ успешно оформлен');
      navigate('/order-confirmation');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось оформить заказ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-6 shadow-card"
        >
          <ShoppingBag className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-2">Корзина пуста</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">Добавьте букеты и вернитесь к оформлению</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/catalog')}
          className="btn-primary"
        >
          Вернуться в каталог
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-32">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4"
      >
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-4 shadow-soft">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={isIOS ? undefined : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <ShieldCheck className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-xl font-bold text-gradient">Доставка</h1>
          </div>
        </div>
      </motion.header>

      <main className="px-4 pt-2 relative z-10 space-y-4">
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-3xl p-4 shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Город</p>
              <p className="text-sm text-muted-foreground">Выберите город доставки</p>
            </div>
          </div>
          <div className="bg-secondary/60 rounded-2xl p-3">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-foreground font-semibold"
            >
              {cityOptions.map((option) => (
                <option key={option} value={option} className="text-foreground">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Home className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Адрес</p>
              <p className="text-sm text-muted-foreground">Укажите улицу и дом</p>
            </div>
          </div>
          <div className="bg-secondary/60 rounded-2xl p-3">
            <input
              type="text"
              placeholder="Например, Невский проспект, 12"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-foreground font-semibold placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Время доставки</p>
              <p className="text-sm text-muted-foreground">Выберите желаемое время</p>
            </div>
          </div>
          <div className="bg-secondary/60 rounded-2xl p-1.5">
            <Select value={deliveryTime} onValueChange={setDeliveryTime}>
              <SelectTrigger className="w-full h-12 rounded-2xl bg-transparent border-0 focus:ring-0 text-foreground font-semibold px-3">
                <SelectValue placeholder="Выберите время доставки" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {deliveryTimeOptions.map((time) => (
                  <SelectItem key={time} value={time} className="text-foreground">
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.05 }}
          className="glass-card rounded-3xl p-4 shadow-soft space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <p className="font-semibold text-foreground">Ваш заказ</p>
            </div>
            <span className="text-sm text-muted-foreground">{cart.length} поз.</span>
          </div>

          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
                <div>
                  <p className="font-semibold text-foreground leading-tight">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} шт. · {(calculateItemTotal(item) / item.quantity).toLocaleString('ru-RU')} ₽ за ед.
                  </p>
                </div>
                <p className="font-bold text-gradient">
                  {calculateItemTotal(item).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Подытог</span>
              <span className="text-foreground font-medium">{subtotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Доставка</span>
              <span className="text-foreground font-medium">{shipping.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Итого</span>
              <span className="font-bold text-2xl text-gradient">{total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </motion.section>
      </main>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        className="fixed bottom-0 left-0 right-0 z-[100] glass-card border-t border-border p-4 safe-area-inset-bottom"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Доставка {city}</span>
            <span className="flex items-center gap-1 text-primary font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Без предоплаты
            </span>
          </div>
          <motion.button
            variants={glowPulse}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Отправляем...' : 'Подтвердить заказ'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};


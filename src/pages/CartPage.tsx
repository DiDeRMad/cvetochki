import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CheckCircle2, Flower2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowerStore } from '@/lib/store';
import { CartItemCard } from '@/components/CartItem';
import { toast } from 'sonner';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useFlowerStore();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 300 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary" />
        <span>Заказ принят, мы свяжемся с вами</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-56">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Flower2 className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-xl font-bold text-gradient">FlowerShop</h1>
          </div>
        </div>
      </motion.header>

      <main className="px-4 pt-2 relative z-10">
        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-6 shadow-card"
              >
                <ShoppingBag className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Корзина пуста
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xs">
                Добавьте красивые букеты, чтобы порадовать близких
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalog')}
                className="btn-primary"
              >
                <span className="flex items-center gap-2">
                  <Flower2 className="w-5 h-5" />
                  Перейти в каталог
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {cart.map((item, index) => (
                <CartItemCard key={item.product.id} item={item} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[100] glass-card border-t border-border p-4 safe-area-inset-bottom"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">Подытог</span>
                  <span className="text-foreground font-medium">
                    {subtotal.toLocaleString('ru-RU')} ₽
                  </span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">Доставка</span>
                  <span className="text-foreground font-medium">
                    {shipping.toLocaleString('ru-RU')} ₽
                  </span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between pt-3 border-t border-border"
                >
                  <span className="font-semibold text-foreground">Итого:</span>
                  <span className="font-bold text-2xl text-gradient">
                    {total.toLocaleString('ru-RU')} ₽
                  </span>
                </motion.div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Оформить заказ</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

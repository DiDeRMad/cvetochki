import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart, Heart, Gift, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, useFlowerStore } from '@/lib/store';
import { QuantityControl } from '@/components/QuantityControl';
import { toast } from 'sonner';
import { fadeUp, floatSoft, glowPulse } from '@/lib/motion';

const addons = [
  { id: 'card', name: 'Открытка с пожеланием', price: 200, icon: Gift },
  { id: 'vase', name: 'Стеклянная ваза', price: 500, icon: Package },
];

export const ProductPage = () => {
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useFlowerStore((state) => state.addToCart);
  const toggleFavorite = useFlowerStore((state) => state.toggleFavorite);
  const isFavorite = useFlowerStore((state) => (id ? state.favorites.includes(id) : false));
  
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setCurrentImage(0);
  }, [id]);
  
  const handleLikeToggle = () => {
    if (!id) return;
    toggleFavorite(id);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !product) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImage < product.images.length - 1) {
      setCurrentImage(currentImage + 1);
    }
    if (isRightSwipe && currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-muted-foreground">Товар не найден</p>
        </motion.div>
      </div>
    );
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const addonTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = addons.find((a) => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);

  const total = (product.price + addonTotal) * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedAddons);
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4 text-primary" />
        <span>Добавлено в корзину</span>
      </div>
    );
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-32 relative motion-smooth transform-gpu">
      <motion.header 
        initial={{ opacity: 0.01, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 flex justify-between items-center"
      >
        <motion.button
          whileHover={isIOS ? undefined : { scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl glass-card shadow-soft flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        
        <motion.button
          whileHover={isIOS ? undefined : { scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleLikeToggle}
          className="w-11 h-11 rounded-2xl glass-card shadow-soft flex items-center justify-center relative overflow-hidden"
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
        >
          <AnimatePresence mode={isIOS ? undefined : "wait"}>
            {isFavorite && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0.01 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={isIOS ? undefined : { scale: 0, rotate: 180 }}
                transition={{ duration: 0.24, type: "tween", ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={isIOS ? undefined : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.4, repeat: 1 }}
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </motion.div>
              </motion.div>
            )}
            {!isFavorite && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0.01 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={isIOS ? undefined : { scale: 0, rotate: -180 }}
                transition={{ duration: 0.24, type: "tween", ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="w-5 h-5 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.header>

      <div 
        className="relative touch-pan-y overflow-hidden motion-smooth transform-gpu"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ height: '100vw', maxHeight: '100vh' }}
      >
        <AnimatePresence mode={isIOS ? undefined : "wait"}>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0.01 }}
            animate={{ opacity: 1 }}
            exit={isIOS ? undefined : { opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="absolute inset-0 select-none motion-smooth transform-gpu"
            style={{ touchAction: 'pan-y' }}
          >
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover pointer-events-none motion-smooth transform-gpu"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {product.images.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentImage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentImage === index 
                  ? 'gradient-primary w-6' 
                  : 'bg-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="px-4 pt-2 -mt-8 relative z-10 motion-smooth transform-gpu"
      >
        <div className="bg-card rounded-t-3xl p-6 shadow-soft">
          <motion.h1 variants={fadeUp} className="text-2xl font-bold text-foreground">
            {product.name}
          </motion.h1>
          <motion.p variants={floatSoft} className="text-gradient text-2xl font-bold mt-2">
            {product.price.toLocaleString('ru-RU')} ₽
          </motion.p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Количество
            </h2>
            <QuantityControl
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Дополнительно
            </h2>
            <div className="space-y-3">
              {addons.map((addon, index) => {
                const IconComponent = addon.icon;
                return (
                <motion.button
                  key={addon.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleAddon(addon.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 min-h-[64px] ${
                    selectedAddons.includes(addon.id)
                      ? 'border-primary bg-purple-light shadow-sm'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={selectedAddons.includes(addon.id) ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedAddons.includes(addon.id)
                          ? 'gradient-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {selectedAddons.includes(addon.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                          <IconComponent className="w-4 h-4" />
                      )}
                    </motion.div>
                    <span className="font-medium text-foreground">
                      {addon.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground font-medium">
                    +{addon.price.toLocaleString('ru-RU')} ₽
                  </span>
                </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pb-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Описание
            </h2>
            <p className="text-foreground/80 leading-relaxed text-base">
              {product.description}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 z-[100] max-w-md mx-auto px-4" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="glass-card border-t border-border bg-background/98 backdrop-blur-xl rounded-t-3xl p-4 shadow-2xl"
          >
            <motion.button
              variants={glowPulse}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="btn-primary w-full py-4 text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 flex-shrink-0" />
              <span className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                <span>В корзину</span>
                <span className="hidden sm:inline">·</span>
                <span className="font-semibold">{total.toLocaleString('ru-RU')} ₽</span>
              </span>
            </motion.button>
          </motion.div>
        </div>
    </div>
  );
};

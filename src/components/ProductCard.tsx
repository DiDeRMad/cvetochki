import { Plus, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, useFlowerStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMemo } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const addToCart = useFlowerStore((state) => state.addToCart);
  const toggleFavorite = useFlowerStore((state) => state.toggleFavorite);
  const isFavorite = useFlowerStore((state) => state.favorites.includes(product.id));
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4 text-primary" />
        <span>Добавлено в корзину</span>
      </div>
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.div
      {...(isIOS
        ? {
            initial: { opacity: 0.01, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.18, ease: [0.25, 0.8, 0.35, 1] },
          }
        : {
            initial: { opacity: 0.01, y: 20, scale: 0.96 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: {
              duration: 0.18,
              delay: index * 0.03,
              type: "tween",
              ease: [0.25, 0.8, 0.35, 1],
            },
            whileHover: { y: -3, scale: 1.005, transition: { duration: 0.08, ease: [0.25, 0.8, 0.35, 1] } },
            whileTap: { scale: 0.99 },
          })}
      className={`card-product cursor-pointer group motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover motion-smooth transform-gpu"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          {...(isIOS
            ? {}
            : {
                whileHover: { scale: 1.012 },
                transition: { duration: 0.08, ease: [0.25, 0.8, 0.35, 1] },
              })}
        />

        <motion.button
          {...(isIOS
            ? {}
            : {
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { delay: index * 0.08 + 0.15, type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                whileHover: { scale: 1.05 },
              })}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md bg-background/70 border border-white/20 shadow-sm flex items-center justify-center transition-colors ${
            isFavorite ? 'text-rose-500 bg-white/90' : 'text-white'
          }`}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </motion.button>

        <div className={`absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent ${isIOS ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-150'}`} />
        
        <motion.button
          {...(isIOS
            ? {}
            : {
                initial: { scale: 0.6, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { delay: index * 0.1 + 0.2, type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                whileHover: { scale: 1.1 },
              })}
          whileTap={{ scale: 0.94 }}
          onClick={handleQuickAdd}
          className={`floating-button absolute bottom-3 right-3 w-10 h-10 motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gradient font-bold mt-1.5 text-base">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
      </div>
    </motion.div>
  );
};

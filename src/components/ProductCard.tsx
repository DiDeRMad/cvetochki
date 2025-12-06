import { Plus, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, useFlowerStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const addToCart = useFlowerStore((state) => state.addToCart);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -8 }}
      className="card-product cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickAdd}
          className="floating-button absolute bottom-3 right-3 w-10 h-10"
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

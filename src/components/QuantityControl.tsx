import { Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

export const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'md',
}: QuantityControlProps) => {
  const buttonSize = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-sm w-7' : 'text-lg w-10';

  return (
    <div className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-1.5 w-fit">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDecrease}
        className={`${buttonSize} quantity-btn flex items-center justify-center`}
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      
      <AnimatePresence mode="wait">
        <motion.span
          key={quantity}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`${textSize} text-center font-bold text-foreground min-w-[2rem] flex items-center justify-center`}
        >
          {quantity}
        </motion.span>
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onIncrease}
        className={`${buttonSize} quantity-btn flex items-center justify-center`}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

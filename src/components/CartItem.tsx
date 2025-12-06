import { Trash2, Gift, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem as CartItemType, useFlowerStore } from '@/lib/store';
import { QuantityControl } from './QuantityControl';

interface CartItemProps {
  item: CartItemType;
  index?: number;
}

const addonsInfo: Record<string, { name: string; icon: typeof Gift; price: number }> = {
  card: { name: 'Открытка с пожеланием', icon: Gift, price: 200 },
  vase: { name: 'Стеклянная ваза', icon: Package, price: 500 },
};

export const CartItemCard = ({ item, index = 0 }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useFlowerStore();

  const selectedAddons = item.addons.map((addonId) => addonsInfo[addonId]).filter(Boolean);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, scale: 0.9 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="flex gap-4 p-4 bg-card rounded-3xl shadow-soft group hover:shadow-card transition-shadow duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={item.product.image}
          alt={item.product.name}
          className="w-24 h-24 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {item.product.name}
          </h3>
          <p className="text-gradient font-bold text-base mt-1">
            {item.product.price.toLocaleString('ru-RU')} ₽
          </p>
          {selectedAddons.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedAddons.map((addon) => {
                const IconComponent = addon.icon;
                return (
                  <div key={addon.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IconComponent className="w-3 h-3" />
                    <span>{addon.name}</span>
                    <span className="text-primary font-medium">+{addon.price} ₽</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <QuantityControl
          size="sm"
          quantity={item.quantity}
          onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
          onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
        />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => removeFromCart(item.product.id)}
        className="self-start p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
      >
        <Trash2 className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

import { motion } from 'framer-motion';

export const ProductCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-product"
    >
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-5 w-1/2 rounded-lg" />
      </div>
    </motion.div>
  );
};

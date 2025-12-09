import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Flower2, Flower, Sun, Palette, Wheat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { products } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Filters {
  priceRange: [number, number];
  categories: string[];
}

const categories = [
  { id: 'roses', name: 'Розы', icon: Flower },
  { id: 'tulips', name: 'Тюльпаны', icon: Flower },
  { id: 'lilies', name: 'Лилии', icon: Flower },
  { id: 'sunflowers', name: 'Подсолнухи', icon: Sun },
  { id: 'pastel', name: 'Пастельные', icon: Palette },
  { id: 'wild', name: 'Полевые', icon: Wheat },
];

const minPrice = 1000;
const maxPrice = 3000;

export const CatalogPage = () => {
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priceRange: [minPrice, maxPrice],
    categories: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const getProductCategory = (productName: string): string => {
    const name = productName.toLowerCase();
    if (name.includes('роз')) return 'roses';
    if (name.includes('тюльпан')) return 'tulips';
    if (name.includes('лили')) return 'lilies';
    if (name.includes('подсолнух')) return 'sunflowers';
    if (name.includes('пастель')) return 'pastel';
    if (name.includes('полев') || name.includes('микс')) return 'wild';
    return '';
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(getProductCategory(product.name));
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      categories: [],
    });
  };

  const activeFiltersCount = filters.categories.length + 
    (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice ? 1 : 0);

  const iosFadeTransition = { type: "tween" as const, duration: 0.2, ease: [0.25, 0.8, 0.35, 1] as const };
  const motionListProps = isIOS
    ? {}
    : {
        initial: { opacity: 0.01, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { type: "tween" as const, duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
      };

  const motionGridProps = isIOS
    ? {
        initial: isFiltersOpen ? false : { opacity: 0.01, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: isFiltersOpen ? { duration: 0 } : iosFadeTransition,
      }
    : isFiltersOpen
      ? {
          initial: false,
          animate: { opacity: 1 },
          exit: { opacity: 1 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0.01 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { type: "tween" as const, duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
        };

  const motionEmptyProps = isIOS
    ? {
        initial: { opacity: 0.01, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: iosFadeTransition,
      }
    : {
        initial: { opacity: 0.01, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "tween" as const, duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-2 pb-2 bg-gradient-to-b from-purple-light via-background to-transparent">
        <div className="glass-card rounded-2xl p-2.5 shadow-soft">
          <motion.div 
            {...motionListProps}
            className={`flex items-center justify-center gap-2 mb-2 motion-smooth ${isIOS ? 'ios-fade' : ''}`}
          >
            <motion.div animate={isIOS ? undefined : { rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Flower2 className="w-5 h-5 text-primary" />
            </motion.div>
            <h1 className="text-lg font-bold text-gradient tracking-tight">
              FLOWER SHOP
            </h1>
          </motion.div>
          
          <motion.div 
            {...(isIOS
              ? {}
              : {
                  initial: { opacity: 0.01, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.2 },
                })}
            className={`flex gap-2 motion-smooth ${isIOS ? 'ios-fade' : ''}`}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Найти букет..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search w-full pl-10 pr-3 py-2 text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFiltersOpen(true)}
              className="floating-button w-10 h-10 relative motion-smooth transform-gpu"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        </div>
      </header>

      <main className="px-4 relative z-10 pt-[110px] pb-4">
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div 
              key="skeleton"
              {...motionGridProps}
              initial={false}
              className={`grid grid-cols-2 gap-3 motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
            >
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="products"
              {...motionGridProps}
              initial={false}
              className={`grid grid-cols-2 gap-3 motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div 
            {...motionEmptyProps}
            className={`text-center py-16 motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
          >
            <motion.div
              animate={isIOS ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-light flex items-center justify-center motion-smooth transform-gpu"
            >
              <Search className="w-10 h-10 text-primary/50" />
            </motion.div>
            <p className="text-muted-foreground text-lg">Ничего не найдено</p>
            <p className="text-muted-foreground/60 text-sm mt-1">Попробуйте изменить запрос</p>
          </motion.div>
        )}
      </main>


      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen} modal={false}>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-md data-[state=closed]:opacity-0 data-[state=open]:opacity-100 transition-opacity duration-200" />
        <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient flex items-center justify-between">
              <span>Фильтры</span>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm font-normal text-muted-foreground motion-smooth transform-gpu"
                >
                  ({activeFiltersCount} активных)
                </motion.span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                Цена
              </h3>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm px-2">
                  <span className="text-muted-foreground font-medium">
                    От {filters.priceRange[0].toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-muted-foreground font-medium">
                    До {filters.priceRange[1].toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                Категории
              </h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 motion-smooth transform-gpu"
                    >
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="border-2 border-primary data-[state=checked]:bg-primary"
                      />
                      <label
                        htmlFor={category.id}
                        className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        <IconComponent className={`w-4 h-4 ${filters.categories.includes(category.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-foreground">{category.name}</span>
                      </label>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1 rounded-2xl"
              >
                Сбросить
              </Button>
              <Button
                onClick={() => setIsFiltersOpen(false)}
                className="flex-1 rounded-2xl gradient-primary text-primary-foreground"
              >
                Применить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

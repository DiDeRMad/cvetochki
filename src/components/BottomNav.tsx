import { Home, ShoppingCart, UserPlus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowerStore } from '@/lib/store';
import { useState, useEffect, useMemo } from 'react';
import { AuthUser, useAuthStore } from '@/lib/authStore';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useFlowerStore((state) => state.getCartCount());
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );
  const authUser = useAuthStore((state) => state.user);
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('auth_user');
      if (userData) {
        try {
          setStoredUser(JSON.parse(userData) as AuthUser);
        } catch {
          setStoredUser(null);
        }
      } else {
        setStoredUser(null);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  const user = authUser || storedUser;

  const isActive = (path: string) => {
    if (path === '/catalog') {
      return location.pathname === '/catalog' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  const navItems = user
    ? [
        { path: '/catalog', icon: Home, label: 'Главная' },
        { path: '/profile', icon: User, label: user.name.split(' ')[0] || user.name, isProfile: true },
        { path: '/cart', icon: ShoppingCart, label: 'Корзина', badge: cartCount },
      ]
    : [
        { path: '/catalog', icon: Home, label: 'Главная' },
        { path: '/register', icon: UserPlus, label: 'Регистрация' },
        { path: '/cart', icon: ShoppingCart, label: 'Корзина', badge: cartCount },
      ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 safe-area-inset-bottom motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-md mx-auto motion-smooth transform-gpu">
        <div className="glass-card rounded-2xl px-4 sm:px-6 py-3 shadow-card">
          <div className="grid grid-cols-3 items-center gap-2">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileTap={isIOS ? undefined : { scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors duration-300 motion-smooth transform-gpu ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId={isIOS ? undefined : "activeTab"}
                    className="absolute inset-0 bg-purple-light rounded-xl motion-smooth"
                    transition={isIOS ? { duration: 0.18, ease: [0.22, 1, 0.36, 1] } : { type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10">
                  {item.isProfile ? (
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">
                        {item.label.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <>
                  <item.icon className="w-6 h-6" />
                  <AnimatePresence>
                    {item.badge && item.badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="badge-cart"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                    </>
                  )}
                </div>
                
                <span className="text-xs font-medium relative z-10 truncate max-w-[60px]">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

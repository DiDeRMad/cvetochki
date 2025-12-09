import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, LogOut, Flower2, MapPin, Clock, Receipt, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { AuthUser, useAuthStore } from '@/lib/authStore';
import { fadeUp, glowPulse, staggerContainer } from '@/lib/motion';

export const ProfilePage = () => {
  const isIOS = useMemo(
    () => typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent),
    []
  );
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clear);
  const [orders, setOrders] = useState<any[]>([]);
  const [isClearingOrders, setIsClearingOrders] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchHistory = useMemo(
    () => async () => {
      if (!token) return;
      try {
        const history = await apiFetch<any[]>('/orders/history');
        const unique = Array.from(
          new Map((history || []).map((o) => [String(o.id), o])).values()
        );
        setOrders(unique);
      } catch {
        setOrders([]);
      }
    },
    [token]
  );

  useEffect(() => {
    if (authUser) {
      setUser({ name: authUser.full_name, email: authUser.email, phone: authUser.phone });
      return;
    }
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser({ name: parsed.name || parsed.full_name || '', email: parsed.email, phone: parsed.phone });
      } catch {
        setUser(null);
      }
    }
  }, [authUser]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || authUser) return;
      try {
        const me = await apiFetch<AuthUser>('/me');
        setAuth(token, me);
        setUser({ name: me.full_name, email: me.email, phone: me.phone });
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [token, authUser, setAuth]);

  useEffect(() => {
    fetchHistory();
  }, [token, fetchHistory]);

  const handleCancelOrder = async (id: string) => {
    if (!token) return;
    setCancellingId(id);
    try {
      await apiFetch(`/orders/${id}`, { method: 'DELETE' });
      await fetchHistory();
      toast.success('Заказ отменён (в истории статус cancelled)');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Не удалось отменить заказ';
      toast.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const handleClearOrders = async () => {
    if (!token) return;
    setIsClearingOrders(true);
    try {
      await apiFetch('/orders', { method: 'DELETE' });
      setOrders([]);
      toast.success('История заказов очищена');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Не удалось очистить заказы';
      toast.error(msg);
    } finally {
      setIsClearingOrders(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.success('Вы вышли из профиля');
    navigate('/catalog');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">Пользователь не найден</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn-primary mb-3"
          >
            Войти
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-xl bg-secondary text-foreground"
          >
            Регистрация
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-24 motion-smooth transform-gpu">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.header 
        {...(isIOS
          ? {}
          : {
              initial: "hidden",
              animate: "visible",
              variants: fadeUp,
            })}
        className={`px-4 py-4 motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
      >
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-4 shadow-soft motion-smooth transform-gpu">
          <motion.button
            whileHover={isIOS ? undefined : { scale: 1.1 }}
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
              <Flower2 className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-xl font-bold text-gradient">Профиль</h1>
          </div>
        </div>
      </motion.header>

      <main className="px-4 pt-8 relative z-10">
        <motion.div
          {...(isIOS
            ? {}
            : {
                initial: { opacity: 0.01, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.2, type: "tween", duration: 0.26, ease: [0.22, 1, 0.36, 1] },
              })}
          className="max-w-md mx-auto motion-smooth transform-gpu"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-3xl p-6 shadow-soft mb-6 motion-smooth transform-gpu"
          >
            <motion.div
              {...(isIOS
                ? {}
                : {
                    initial: { opacity: 0.01, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: 0.3, type: "tween", duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                  })}
              className="flex flex-col items-center mb-6 motion-smooth transform-gpu"
            >
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-card">
                <span className="text-primary-foreground text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gradient mb-1">
                {user.name}
              </h2>
            </motion.div>

            <div className="space-y-4">
              <motion.div
                {...(isIOS
                  ? {}
                  : {
                      initial: { opacity: 0.01, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: 0.4, type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                    })}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 motion-smooth transform-gpu"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Имя</p>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                </div>
              </motion.div>

              <motion.div
                {...(isIOS
                  ? {}
                  : {
                      initial: { opacity: 0.01, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: 0.5, type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                    })}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 motion-smooth transform-gpu"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-semibold text-foreground">{user.email}</p>
                </div>
              </motion.div>

              <motion.div
                {...(isIOS
                  ? {}
                  : {
                      initial: { opacity: 0.01, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: 0.6, type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                    })}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 motion-smooth transform-gpu"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Телефон</p>
                  <p className="text-sm font-semibold text-foreground">{user.phone}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="glass-card rounded-3xl p-6 shadow-soft mb-6 space-y-4 motion-smooth transform-gpu"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">История заказов</h3>
            </div>

            {orders.length === 0 && (
              <p className="text-muted-foreground text-sm">История пуста. Сделайте заказ, чтобы увидеть его здесь.</p>
            )}

            {orders.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearOrders}
                    disabled={isClearingOrders}
                    className="flex items-center gap-2 text-sm text-foreground hover:text-foreground/80 rounded-xl px-3 py-2 bg-secondary/60 disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isClearingOrders ? 'Очищаем...' : 'Очистить историю'}</span>
                  </motion.button>
                </div>
                {orders.map((order) => (
                  <div key={order.id} className="rounded-2xl bg-secondary/60 p-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>№ {order.id}</span>
                      <span className="text-foreground font-medium">
                        {order.status === 'created'
                          ? 'Создан'
                          : order.status === 'cancelled'
                          ? 'Отменён'
                          : order.status === 'completed'
                          ? 'Доставлен'
                          : 'В обработке'}
                      </span>
                    </div>
                    <div className="text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{order.city}, {order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{order.time}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-foreground">
                      {(order.items || []).map((i: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>Товар {i.productid || i.productId}</span>
                          <span>{i.quantity} шт.</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                      <span>Итого</span>
                      <span className="text-foreground font-semibold">{Number(order.total).toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-end pt-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCancelOrder(String(order.id))}
                        disabled={order.status === 'cancelled' || cancellingId === String(order.id)}
                        className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 rounded-xl px-3 py-2 bg-destructive/10 disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>
                          {order.status === 'cancelled'
                            ? 'Уже отменён'
                            : cancellingId === String(order.id)
                            ? 'Отменяем...'
                            : 'Отменить'}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.button
            variants={glowPulse}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 motion-smooth transform-gpu ${isIOS ? 'ios-fade' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти из профиля</span>
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};


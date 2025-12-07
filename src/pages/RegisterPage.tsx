import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower2, Mail, User, Phone, LogIn, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTelegram } from '@/hooks/useTelegram';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { user: telegramUser, isTelegram } = useTelegram();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    if (isTelegram && telegramUser) {
      setFormData({
        name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
        email: telegramUser.username ? `${telegramUser.username}@telegram` : '',
        phone: '',
        password: '',
      });
    }
  }, [isTelegram, telegramUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const response = await apiFetch<{ token: string; user: { user_id: number; full_name: string; email: string; phone: string } }>(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );
      setAuth(response.token, response.user);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Регистрация успешна! Добро пожаловать, {response.user.full_name}!</span>
        </div>
      );
      await new Promise((resolve) => setTimeout(resolve, 400));
      navigate('/catalog', { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Произошла ошибка при регистрации';
      if (/Email already in use/i.test(msg) || /duplicate/i.test(msg) || /уже/i.test(msg)) {
        toast.error('Такой email уже зарегистрирован. Попробуйте войти.');
      } else {
        toast.error('Не удалось зарегистрироваться. Проверьте данные и повторите.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <header className="px-4 pt-8 pb-4">
        <div className="glass-card rounded-3xl p-4 shadow-soft">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Flower2 className="w-7 h-7 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gradient tracking-tight">
              FLOWER SHOP
            </h1>
          </motion.div>
        </div>
      </header>

      <main className="px-4 pt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card rounded-3xl p-6 shadow-soft">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gradient mb-2">
                Регистрация
              </h2>
              <p className="text-muted-foreground">
                Заполните форму, чтобы начать покупки
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введите ваше имя"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="name"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введите ваш email"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Телефон
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Введите ваш телефон"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="tel"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Придумайте пароль"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-8"
              >
                <LogIn className="w-5 h-5" />
                <span>Зарегистрироваться</span>
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
                className="mt-6 flex items-center justify-between text-sm"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/login', { replace: true });
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
            >
                  Уже есть аккаунт? Войти
                </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/catalog', { replace: true });
                }}
                  className="text-muted-foreground hover:text-primary transition-colors"
              >
                  В каталог
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};


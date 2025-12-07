import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flower2, Mail, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.email || !formData.password) {
      toast.error('Введите email и пароль');
      return;
    }

    try {
      const response = await apiFetch<{ token: string; user: { user_id: number; full_name: string; email: string; phone: string } }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      setAuth(response.token, response.user);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>С возвращением, {response.user.full_name}!</span>
        </div>
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate('/catalog', { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Не удалось войти';
      if (/Invalid credentials/i.test(msg)) {
        toast.error('Неверный email или пароль');
      } else {
        toast.error('Не удалось войти. Попробуйте ещё раз.');
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
            <h1 className="text-2xl font-bold text-gradient tracking-tight">FLOWER SHOP</h1>
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
              <h2 className="text-3xl font-bold text-gradient mb-2">Вход</h2>
              <p className="text-muted-foreground">
                Введите email и пароль, чтобы продолжить
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
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
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите ваш пароль"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-6"
              >
                <LogIn className="w-5 h-5" />
                <span>Войти</span>
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
                onClick={() => navigate('/register')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Нет аккаунта? Регистрация
              </button>
              <button
                type="button"
                onClick={() => navigate('/catalog')}
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


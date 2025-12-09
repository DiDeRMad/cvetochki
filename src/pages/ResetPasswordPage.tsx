import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ShieldCheck, Flower2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const token = useMemo(() => search.get('token') || '', [search]);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      toast.error('Токен не найден');
      return;
    }
    if (!form.password || form.password.length < 6) {
      toast.error('Пароль должен быть не меньше 6 символов');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Пароли не совпадают');
      return;
    }
    try {
      setSubmitting(true);
      const resp = await apiFetch<{ token: string; user: { user_id: number; full_name: string; email: string; phone: string } }>(
        '/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify({ token, password: form.password }),
        }
      );
      setAuth(resp.token, resp.user);
      toast.success('Пароль обновлён, вход выполнен');
      await new Promise((resolve) => setTimeout(resolve, 250));
      navigate('/catalog', { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Ошибка';
      if (/invalid|expired/i.test(msg)) {
        toast.error('Ссылка недействительна или устарела. Запросите новую.');
      } else {
        toast.error('Не удалось обновить пароль. Попробуйте ещё раз.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-light via-background to-background px-4">
        <div className="glass-card rounded-3xl p-6 max-w-md w-full text-center shadow-soft">
          <h2 className="text-2xl font-bold text-gradient mb-3">Ссылка недействительна</h2>
          <p className="text-muted-foreground mb-6">Запросите новую ссылку для сброса пароля.</p>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="btn-primary w-full py-3"
          >
            Запросить заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <header className="px-4 pt-8 pb-4">
        <div className="glass-card rounded-3xl p-4 shadow-soft flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <Flower2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-gradient">Новый пароль</h1>
          </motion.div>
        </div>
      </header>

      <main className="px-4 pt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card rounded-3xl p-6 shadow-soft">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gradient mb-2">Придумайте новый пароль</h2>
              <p className="text-muted-foreground">
                Введите и подтвердите пароль. После сохранения вы будете авторизованы.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="block text-sm font-semibold text-foreground mb-2">Новый пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Минимум 6 символов"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                <label className="block text-sm font-semibold text-foreground mb-2">Повторите пароль</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Повторите пароль"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{submitting ? 'Сохраняем...' : 'Сохранить пароль'}</span>
              </motion.button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                К входу
              </button>
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                В каталог
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};



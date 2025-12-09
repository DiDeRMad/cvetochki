import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Flower2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) {
      toast.error('Введите email');
      return;
    }
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSent(true);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Ссылка для сброса отправлена, проверьте почту</span>
        </div>
      );
    } catch {
      toast.error('Не удалось отправить письмо. Попробуйте ещё раз.');
    }
  };

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
            <h1 className="text-xl font-bold text-gradient">Сброс пароля</h1>
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
              <h2 className="text-2xl font-bold text-gradient mb-2">Забыли пароль?</h2>
              <p className="text-muted-foreground">
                Введите email, мы отправим ссылку для восстановления
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
                    className="pl-12 h-12 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/30 transition-all"
                    autoComplete="email"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Отправить ссылку</span>
              </motion.button>
            </form>

            {sent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-sm text-foreground bg-secondary/40 rounded-2xl p-4"
              >
                Письмо отправлено. Проверьте входящие и папку "Спам". Ссылка действует 1 час.
              </motion.div>
            )}

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Вернуться к входу
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Регистрация
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};



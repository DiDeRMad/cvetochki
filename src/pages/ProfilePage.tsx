import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, LogOut, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('userUpdated'));
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
            onClick={() => navigate('/register')}
            className="btn-primary"
          >
            Зарегистрироваться
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 px-4 py-4"
      >
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-4 shadow-soft">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card rounded-3xl p-6 shadow-soft mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center mb-6"
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50"
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50"
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50"
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
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти из профиля</span>
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};


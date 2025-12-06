import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStart = () => {
    localStorage.setItem('welcomeShown', 'true');
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light via-background to-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 max-w-sm w-full px-4"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="w-32 h-32 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-2xl"
          >
            <Flower2 className="w-16 h-16 text-primary-foreground" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl font-bold text-gradient mb-4"
        >
          Добро пожаловать!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-2"
        >
          Вас приветствует
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Flower2 className="w-7 h-7 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gradient">FLOWER SHOP</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-base text-foreground/70 mb-12 leading-relaxed"
        >
          Откройте для себя удивительный мир цветов.<br />
          Создайте незабываемые моменты с нашими букетами.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="w-full max-w-sm px-4 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 shadow-lg mx-auto"
        >
          <span>Начать</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};


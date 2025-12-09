import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProfilePage } from "./pages/ProfilePage";
import { WelcomePage } from "./pages/WelcomePage";
import { BottomNav } from "./components/BottomNav";
import NotFound from "./pages/NotFound";
import { useTelegram } from "./hooks/useTelegram";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { webApp, isTelegram, themeParams } = useTelegram();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (webApp && themeParams) {
      if (themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
      }
      if (themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
      }
      if (themeParams.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
      }
      if (themeParams.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
      }
    }
    setIsInitialized(true);
  }, [webApp, themeParams]);

  const welcomeShown = localStorage.getItem('welcomeShown') === 'true';
  const user = localStorage.getItem('user');
  
  const shouldShowWelcome = !welcomeShown && location.pathname === '/';
  const shouldRedirectToRegister = welcomeShown && !user && location.pathname === '/';
  const shouldRedirectToCatalog = welcomeShown && user && location.pathname === '/';
  const isWelcomePage = location.pathname === '/welcome' || shouldShowWelcome;

  if (!isInitialized) {
    return null;
  }
  
  return (
    <div className={`max-w-md mx-auto bg-background min-h-screen relative ${isTelegram ? 'shadow-none' : 'shadow-2xl'}`}>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/" element={
          shouldShowWelcome ? <WelcomePage /> :
          shouldRedirectToRegister ? <Navigate to="/register" replace /> :
          shouldRedirectToCatalog ? <Navigate to="/catalog" replace /> :
          <CatalogPage />
        } />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isWelcomePage && 
       location.pathname !== '/register' && 
       location.pathname !== '/login' &&
       location.pathname !== '/forgot-password' &&
       location.pathname !== '/reset-password' &&
       !location.pathname.startsWith('/product/') && 
       <BottomNav />}
    </div>
  );
};

const App = () => {
  const isIOS = typeof navigator !== 'undefined' && /iP(hone|od|ad)/.test(navigator.userAgent);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <MotionConfig reducedMotion={isIOS ? "always" : "never"}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

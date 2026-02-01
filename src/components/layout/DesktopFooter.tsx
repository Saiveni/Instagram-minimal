import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film, PlusSquare, User, MessageCircle, Heart, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationsStore } from '@/stores/notificationsStore';

export const DesktopFooter = () => {
  const location = useLocation();
  const { setCreatePostOpen, theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();
  const { getUnreadCount } = useNotificationsStore();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/reels', icon: Film, label: 'Reels' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/notifications', icon: Heart, label: 'Notifications', showBadge: true },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="hidden md:block fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-around h-14">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`relative ${isActive(item.path) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              <Link to={item.path} aria-label={item.label}>
                <item.icon className="h-5 w-5" />
                {isActive(item.path) && (
                  <motion.div
                    layoutId="desktop-footer-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </Button>
            {item.showBadge && user && getUnreadCount(user.uid) > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-background" />
            )}
          </motion.div>
        ))}

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCreatePostOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Create post"
          >
            <PlusSquare className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </motion.div>
      </div>
    </motion.footer>
  );
};

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film, PlusSquare, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationsStore } from '@/stores/notificationsStore';

export const MobileNav = () => {
  const location = useLocation();
  const { setCreatePostOpen } = useUIStore();
  const { user } = useAuthStore();
  const { getUnreadCount } = useNotificationsStore();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home', showBadge: false },
    { path: '/search', icon: Search, label: 'Search', showBadge: false },
    { path: '/reels', icon: Film, label: 'Reels', showBadge: false },
    { path: '/messages', icon: MessageCircle, label: 'Messages', showBadge: false },
    { path: '/profile', icon: User, label: 'Profile', showBadge: false },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
                <item.icon className="h-6 w-6" />
                {isActive(item.path) && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </Button>
            {item.showBadge && user && getUnreadCount(user.uid) > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-background" />
            )}
          </motion.div>
        ))}

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCreatePostOpen(true)}
            className="text-muted-foreground hover:text-foreground relative"
            aria-label="Create post"
          >
            <motion.div
              animate={{
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <PlusSquare className="h-7 w-7" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film, MessageCircle, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';

export const MobileNav = () => {
  const location = useLocation();
  const { setCreatePostOpen } = useUIStore();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/reels', icon: Film, label: 'Reels' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="flex items-center justify-around h-14">
        {navItems.slice(0, 2).map(({ path, icon: Icon, label }) => (
          <Button
            key={path}
            variant="ghost"
            size="icon"
            asChild
            className={`relative ${isActive(path) ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Link to={path} aria-label={label}>
              <Icon className="h-6 w-6" />
              {isActive(path) && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCreatePostOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Create post"
        >
          <PlusSquare className="h-7 w-7" />
        </Button>

        {navItems.slice(2).map(({ path, icon: Icon, label }) => (
          <Button
            key={path}
            variant="ghost"
            size="icon"
            asChild
            className={`relative ${isActive(path) ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Link to={path} aria-label={label}>
              <Icon className="h-6 w-6" />
              {isActive(path) && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};

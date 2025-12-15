import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film, PlusSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

export const MobileNav = () => {
  const location = useLocation();
  const { setCreatePostOpen } = useUIStore();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="flex items-center justify-around h-14">
        {/* Home */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={`relative ${isActive('/') ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          <Link to="/" aria-label="Home">
            <Home className="h-6 w-6" />
            {isActive('/') && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Link>
        </Button>

        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={`relative ${isActive('/search') ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          <Link to="/search" aria-label="Search">
            <Search className="h-6 w-6" />
            {isActive('/search') && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Link>
        </Button>

        {/* Create Post */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCreatePostOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Create post"
        >
          <PlusSquare className="h-7 w-7" />
        </Button>

        {/* Reels */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={`relative ${isActive('/reels') ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          <Link to="/reels" aria-label="Reels">
            <Film className="h-6 w-6" />
            {isActive('/reels') && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Link>
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={`relative ${isActive('/profile') ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          <Link to="/profile" aria-label="Profile">
            <User className="h-6 w-6" />
            {isActive('/profile') && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Link>
        </Button>
      </div>
    </nav>
  );
};

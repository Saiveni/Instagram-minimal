import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film, MessageCircle, PlusSquare, Heart, User, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export const Header = () => {
  const { user } = useAuthStore();
  const { setCreatePostOpen } = useUIStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/reels', icon: Film, label: 'Reels' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Instagram
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Button
              key={path}
              variant="ghost"
              size="icon"
              asChild
              className={`relative ${isActive(path) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              <Link to={path} aria-label={label}>
                <Icon className="h-5 w-5" />
                {isActive(path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            </Button>
          ))}
          
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCreatePostOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Create post"
              >
                <PlusSquare className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Notifications">
                <Heart className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className={isActive('/profile') ? 'text-foreground' : 'text-muted-foreground'}
              >
                <Link to="/profile" aria-label="Profile">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
                    <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile: Show profile avatar or sign in */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/auth" aria-label="Sign In">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

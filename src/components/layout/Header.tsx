import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, Search, Film, MessageCircle, PlusSquare, Heart, User, LogIn, Moon, Sun, Users, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useUsersStore } from '@/stores/usersStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import { UsersPopover } from '@/components/notifications/UsersPopover';
import { useState, useEffect } from 'react';

export const Header = () => {
  const { user } = useAuthStore();
  const { setCreatePostOpen, theme, toggleTheme } = useUIStore();
  const { getUser } = useUsersStore();
  const { getUnreadCount } = useNotificationsStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  
  // Get user from store for latest avatar
  const storedUser = user?.uid ? getUser(user.uid) : null;
  const avatarUrl = storedUser?.avatarUrl || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'default'}`;

  return (
    <motion.header
      style={{ 
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur}px)`
      }}
      className={`fixed top-0 left-0 right-0 z-50 glass transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Instagram
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={isActive('/') ? 'text-foreground' : 'text-muted-foreground'}
            >
              <Link to="/" aria-label="Home">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={isActive('/search') ? 'text-foreground' : 'text-muted-foreground'}
            >
              <Link to="/search" aria-label="Search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={isActive('/reels') ? 'text-foreground' : 'text-muted-foreground'}
            >
              <Link to="/reels" aria-label="Reels">
                <Film className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {user && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCreatePostOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Create post"
              >
                <PlusSquare className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {user ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className={isActive('/notifications') ? 'text-foreground' : 'text-muted-foreground'}
                aria-label="Notifications"
              >
                <Link to="/notifications">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              {user && getUnreadCount(user.uid) > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-background" />
              )}
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Notifications"
                onClick={() => alert('Please sign in to view notifications')}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {user ? (
            <UsersPopover>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground" 
                  aria-label="Users"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </motion.div>
            </UsersPopover>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Users"
                onClick={() => alert('Please sign in to view users')}
              >
                <Users className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              asChild={user ? true : false}
              className={isActive('/messages') ? 'text-foreground' : 'text-muted-foreground'}
              onClick={() => !user && alert('Please sign in to view messages')}
            >
              {user ? (
                <Link to="/messages" aria-label="Messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </Button>
          </motion.div>

          {user && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={isActive('/settings') ? 'text-foreground' : 'text-muted-foreground'}
              >
                <Link to="/settings" aria-label="Settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          )}

          {user ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={isActive('/profile') ? 'text-foreground' : 'text-muted-foreground'}
              >
                <Link to="/profile" aria-label="Profile">
                  <Avatar className="h-7 w-7 ring-2 ring-primary/20 transition-all hover:ring-primary/50">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </motion.div>
          )}
        </nav>

        {/* Mobile: Show notifications, messages, theme toggle */}
        <div className="flex md:hidden items-center gap-1">
          {user ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className={isActive('/notifications') ? 'text-foreground' : 'text-muted-foreground'}
                aria-label="Notifications"
              >
                <Link to="/notifications">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              {user && getUnreadCount(user.uid) > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-background" />
              )}
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Notifications"
                onClick={() => alert('Please sign in to view notifications')}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              asChild={user ? true : false}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => !user && alert('Please sign in to view messages')}
            >
              {user ? (
                <Link to="/messages" aria-label="Messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
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
      </div>
    </motion.header>
  );
};

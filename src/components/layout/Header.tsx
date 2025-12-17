import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film, MessageCircle, PlusSquare, Heart, User, LogIn, Moon, Sun, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import { UsersPopover } from '@/components/notifications/UsersPopover';

export const Header = () => {
  const { user } = useAuthStore();
  const { setCreatePostOpen, theme, toggleTheme } = useUIStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Instagram
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCreatePostOpen(true)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Create post"
            >
              <PlusSquare className="h-5 w-5" />
            </Button>
          )}

          {user ? (
            <NotificationsPopover>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Notifications"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </NotificationsPopover>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground" 
              aria-label="Notifications"
              onClick={() => alert('Please sign in to view notifications')}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}

          {user ? (
            <UsersPopover>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Users"
              >
                <Users className="h-5 w-5" />
              </Button>
            </UsersPopover>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground" 
              aria-label="Users"
              onClick={() => alert('Please sign in to view users')}
            >
              <Users className="h-5 w-5" />
            </Button>
          )}

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

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
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
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile: Show notifications, messages, theme toggle */}
        <div className="flex md:hidden items-center gap-1">
          {user ? (
            <NotificationsPopover>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Notifications"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </NotificationsPopover>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground" 
              aria-label="Notifications"
              onClick={() => alert('Please sign in to view notifications')}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}
          
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
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

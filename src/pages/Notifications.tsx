import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUsersStore } from '@/stores/usersStore';
import { useAuthStore } from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  user: {
    username: string;
    avatarUrl: string;
  };
  post?: {
    imageUrl: string;
  };
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationsPage = () => {
  const { users, isFollowing, followUser, unfollowUser } = useUsersStore();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Filter out current user
  const otherUsers = users.filter(u => u.uid !== user?.id);

  const handleFollow = (targetUserId: string) => {
    if (!user) return;
    
    if (isFollowing(user.id, targetUserId)) {
      unfollowUser(user.id, targetUserId);
    } else {
      followUser(user.id, targetUserId);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4">
          <div className="space-y-2">
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-primary"
                >
                  Mark all as read
                </Button>
              </div>
            )}

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-lg mb-2">No notifications</h4>
                <p className="text-sm text-muted-foreground text-center">
                  When someone likes, comments, or follows you, you'll see it here.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors border ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatarUrl} />
                        <AvatarFallback>
                          {notification.user.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.username}</span>{' '}
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>

                    {notification.post?.imageUrl && (
                      <img
                        src={notification.post.imageUrl}
                        alt="Post"
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4">
          {otherUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-lg mb-2">No suggestions</h4>
              <p className="text-sm text-muted-foreground text-center">
                When people create accounts, you'll see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {otherUsers.map((profile, index) => (
                <motion.div
                  key={profile.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{profile.username}</p>
                      <p className="text-sm text-muted-foreground truncate">{profile.displayName}</p>
                      {profile.bio && (
                        <p className="text-xs text-muted-foreground truncate mt-1">{profile.bio}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowing(user?.id || '', profile.uid) ? 'secondary' : 'default'}
                    onClick={() => handleFollow(profile.uid)}
                    className="flex-shrink-0"
                  >
                    {isFollowing(user?.id || '', profile.uid) ? 'Following' : 'Follow'}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;

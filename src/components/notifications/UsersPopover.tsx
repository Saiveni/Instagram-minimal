import { useState } from 'react';
import { Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { useUsersStore } from '@/stores/usersStore';
import { useAuthStore } from '@/stores/authStore';

export const UsersPopover = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { users, isFollowing, followUser, unfollowUser } = useUsersStore();
  const { user } = useAuthStore();

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Users</h3>
          <span className="text-sm text-muted-foreground">{otherUsers.length} users</span>
        </div>

        <ScrollArea className="h-[400px]">
          {otherUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-lg mb-2">No users yet</h4>
              <p className="text-sm text-muted-foreground text-center">
                When people create accounts, you'll see them here.
              </p>
            </div>
          ) : (
            <div className="p-2">
              {otherUsers.map((profile, index) => (
                <motion.div
                  key={profile.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{profile.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile.displayName}</p>
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
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

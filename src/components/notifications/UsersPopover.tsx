import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUsersStore } from '@/stores/usersStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface UsersPopoverProps {
  children: React.ReactNode;
}

export const UsersPopover = ({ children }: UsersPopoverProps) => {
  const { user } = useAuthStore();
  const { users, followUser, unfollowUser, isFollowing, following } = useUsersStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Get current user's following list to trigger re-render
  const currentUserFollowing = user ? (following[user.uid] || []) : [];

  const suggestedUsers = users
    .filter(u => u.uid !== user?.uid)
    .slice(0, 5);

  const handleFollow = (targetUserId: string) => {
    if (!user) return;
    
    if (isFollowing(user.uid, targetUserId)) {
      unfollowUser(user.uid, targetUserId);
    } else {
      followUser(user.uid, targetUserId);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Suggested for you</h3>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-4">
            {suggestedUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No suggestions available
              </p>
            ) : (
              suggestedUsers.map((profile) => (
                <motion.div
                  key={profile.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => {
                      navigate(`/profile/${profile.username}`);
                      setOpen(false);
                    }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{profile.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile.displayName}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={currentUserFollowing.includes(profile.uid) ? 'secondary' : 'default'}
                    onClick={() => handleFollow(profile.uid)}
                    className="ml-2"
                  >
                    {currentUserFollowing.includes(profile.uid) ? 'Following' : 'Follow'}
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

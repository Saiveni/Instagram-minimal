import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { useStoriesStore } from '@/stores/storiesStore';
import { useUsersStore } from '@/stores/usersStore';
import { CreateStoryModal } from './CreateStoryModal';
import { StoryViewer } from './StoryViewer';

export const StoriesBar = () => {
  const { user } = useAuthStore();
  const { getAllStories, getUserStories } = useStoriesStore();
  const { following, getUser } = useUsersStore();
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isOwnStory, setIsOwnStory] = useState(false);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  
  // Get current user profile for avatar
  const currentUserProfile = user?.uid ? getUser(user.uid) : null;
  const avatarUrl = currentUserProfile?.avatarUrl || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'default'}`;

  const allStories = useMemo(() => {
    try {
      return getAllStories();
    } catch (error) {
      console.error('Error getting all stories:', error);
      return [];
    }
  }, [getAllStories]);
  
  // Filter stories to show only from followed users (and own stories)
  const filteredStories = useMemo(() => {
    try {
      if (!user?.uid) return [];
      const userFollowing = following[user.uid] || [];
      return allStories.filter(group => 
        group.userId === user.uid || userFollowing.includes(group.userId)
      );
    } catch (error) {
      console.error('Error filtering stories:', error);
      return [];
    }
  }, [allStories, user?.uid, following]);
  
  const userStories = useMemo(() => {
    try {
      return user?.uid ? getUserStories(user.uid) : [];
    } catch (error) {
      console.error('Error getting user stories:', error);
      return [];
    }
  }, [user?.uid, getUserStories]);

  const handleStoryClick = (userId: string) => {
    // Check if there are actually stories for this user before opening viewer
    const userStoriesGroup = filteredStories.find(group => group.userId === userId);
    if (!userStoriesGroup || !userStoriesGroup.stories || userStoriesGroup.stories.length === 0) {
      console.warn('No stories found for user:', userId);
      return;
    }
    setSelectedUserId(userId);
    setIsOwnStory(userId === user?.uid);
    setViewerOpen(true);
  };

  const viewerStories = useMemo(() => {
    if (!selectedUserId) return [];
    return filteredStories.find(group => group.userId === selectedUserId)?.stories || [];
  }, [selectedUserId, filteredStories]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 mb-4"
      >
        <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
          {/* Your story */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (userStories.length > 0 && user?.uid) {
                handleStoryClick(user.uid);
              } else {
                setCreateStoryOpen(true);
              }
            }}
            className="flex flex-col items-center gap-1 min-w-[66px]"
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="h-14 w-14 ring-2 ring-primary/20 transition-all hover:ring-primary/50">
                <AvatarImage src={avatarUrl} alt="Your story" />
                <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {userStories.length === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center"
                >
                  <Plus className="h-3 w-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.div>
            <span className="text-xs">Your story</span>
          </motion.button>

        {/* Other stories */}
        {filteredStories.filter(group => group.userId !== user?.uid).map((group, index) => (
          <motion.button
            key={group.userId}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStoryClick(group.userId)}
            className="flex flex-col items-center gap-1 min-w-[66px]"
          >
            <motion.div
              className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="p-0.5 rounded-full bg-background">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={group.avatarUrl} alt={group.username} />
                  <AvatarFallback>{group.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
            <span className="text-xs truncate w-full text-center">{group.username}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>

    <CreateStoryModal open={createStoryOpen} onOpenChange={setCreateStoryOpen} />
    <StoryViewer
      open={viewerOpen}
      onOpenChange={setViewerOpen}
      stories={viewerStories}
      initialIndex={0}
      isOwnStory={isOwnStory}
    />
  </>
  );
};

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { useStoriesStore } from '@/stores/storiesStore';
import { CreateStoryModal } from './CreateStoryModal';
import { StoryViewer } from './StoryViewer';

export const StoriesBar = () => {
  const { user } = useAuthStore();
  const { getAllStories, getUserStories } = useStoriesStore();
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  // Get all stories grouped by user
  const allStories = useMemo(() => getAllStories(), [getAllStories]);
  
  // Get current user's stories
  const userStories = useMemo(() => 
    user ? getUserStories(user.id) : [], 
    [user, getUserStories]
  );

  const handleStoryClick = (userId: string) => {
    setSelectedUserId(userId);
    setViewerOpen(true);
  };

  // Get stories for the viewer
  const viewerStories = useMemo(() => {
    if (!selectedUserId) return [];
    return allStories.find(group => group.userId === selectedUserId)?.stories || [];
  }, [selectedUserId, allStories]);

  return (
    <>
      <div className="border-b border-border bg-card/50 mb-4">
        <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
          {/* Your story */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (userStories.length > 0 && user) {
                handleStoryClick(user.id);
              } else {
                setCreateStoryOpen(true);
              }
            }}
            className="flex flex-col items-center gap-1 min-w-[66px]"
          >
            <div className="relative">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="Your story" />
                <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {userStories.length === 0 && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                  <Plus className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs">Your story</span>
          </motion.button>

        {/* Other stories */}
        {allStories.filter(group => group.userId !== user?.id).map((group, index) => (
          <motion.button
            key={group.userId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStoryClick(group.userId)}
            className="flex flex-col items-center gap-1 min-w-[66px]"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="p-0.5 rounded-full bg-background">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={group.avatarUrl} alt={group.username} />
                  <AvatarFallback>{group.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs truncate w-full text-center">{group.username}</span>
          </motion.button>
        ))}
      </div>
    </div>

    <CreateStoryModal open={createStoryOpen} onOpenChange={setCreateStoryOpen} />
    <StoryViewer
      open={viewerOpen}
      onOpenChange={setViewerOpen}
      stories={viewerStories}
      initialIndex={0}
    />
  </>
  );
};

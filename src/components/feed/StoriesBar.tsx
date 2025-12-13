import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';

const mockStories = [
  { id: '1', username: 'johndoe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', hasUnread: true },
  { id: '2', username: 'janedoe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', hasUnread: true },
  { id: '3', username: 'alexsmith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', hasUnread: false },
  { id: '4', username: 'sarah_m', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', hasUnread: true },
  { id: '5', username: 'mike_t', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', hasUnread: false },
  { id: '6', username: 'emma_w', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', hasUnread: true },
];

export const StoriesBar = () => {
  const { user } = useAuthStore();
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="border-b border-border bg-card/50 mb-4">
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
        {/* Your story */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-1 min-w-[66px]"
        >
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Your story" />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
              <Plus className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xs">Your story</span>
        </motion.button>

        {/* Other stories */}
        {mockStories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1 min-w-[66px]"
          >
            <div className={`p-0.5 rounded-full ${story.hasUnread ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-muted'}`}>
              <div className="p-0.5 rounded-full bg-background">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={story.avatarUrl} alt={story.username} />
                  <AvatarFallback>{story.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs truncate w-full text-center">{story.username}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

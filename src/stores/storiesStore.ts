import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Story {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: Date;
}

interface StoriesState {
  stories: Story[];
  addStory: (story: Story) => void;
  getUserStories: (userId: string) => Story[];
  getAllStories: () => { userId: string; username: string; avatarUrl: string; stories: Story[]; hasUnread: boolean }[];
}

interface GroupedStories {
  userId: string;
  username: string;
  avatarUrl: string;
  stories: Story[];
  hasUnread: boolean;
}

export const useStoriesStore = create<StoriesState>()(
  persist(
    (set, get) => ({
      stories: [],
      addStory: (story) =>
        set((state) => ({
          stories: [story, ...state.stories],
        })),
      getUserStories: (userId) => {
        return get().stories.filter((s) => s.userId === userId);
      },
      getAllStories: () => {
        const { stories } = get();
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        // Filter stories from last 24 hours
        const recentStories = stories.filter(
          (s) => new Date(s.createdAt) > twentyFourHoursAgo
        );

        // Group by user
        const grouped = recentStories.reduce((acc, story) => {
          if (!acc[story.userId]) {
            acc[story.userId] = {
              userId: story.userId,
              username: story.username,
              avatarUrl: story.avatarUrl,
              stories: [],
              hasUnread: true,
            };
          }
          acc[story.userId].stories.push(story);
          return acc;
        }, {} as Record<string, GroupedStories>);

        return Object.values(grouped);
      },
    }),
    {
      name: 'stories-storage',
    }
  )
);

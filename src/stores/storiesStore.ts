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
  views: string[]; // Array of user IDs who viewed the story
  viewsCount: number;
}

interface StoriesState {
  stories: Story[];
  addStory: (story: Omit<Story, 'views' | 'viewsCount'>) => void;
  addView: (storyId: string, userId: string) => void;
  getUserStories: (userId: string) => Story[];
  getStoryViews: (storyId: string) => string[];
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
          stories: [{ ...story, views: [], viewsCount: 0 }, ...state.stories],
        })),
      
      addView: (storyId, userId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId && !s.views.includes(userId)
              ? { ...s, views: [...s.views, userId], viewsCount: s.viewsCount + 1 }
              : s
          ),
        })),
      
      getUserStories: (userId) => {
        return get().stories.filter((s) => s.userId === userId);
      },
      
      getStoryViews: (storyId) => {
        const story = get().stories.find((s) => s.id === storyId);
        return story?.views || [];
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
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const { state } = JSON.parse(str);
            
            // Validate and transform the state
            if (!state || typeof state !== 'object') {
              console.warn('Invalid state in localStorage, resetting...');
              return null;
            }
            
            return {
              state: {
                stories: Array.isArray(state.stories) ? state.stories.map((story: Record<string, unknown>) => ({
                  ...story,
                  createdAt: typeof story.createdAt === 'string' ? new Date(story.createdAt) : story.createdAt,
                  views: Array.isArray(story.views) ? story.views : []
                })) : []
              }
            };
          } catch (error: unknown) {
            console.error('Error loading stories from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error: unknown) {
            console.error('Error saving stories to localStorage:', error);
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

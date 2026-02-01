import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types';

interface UsersState {
  users: UserProfile[];
  followers: Record<string, string[]>; // userId -> array of follower userIds
  following: Record<string, string[]>; // userId -> array of following userIds
  addUser: (user: UserProfile) => void;
  updateUser: (userId: string, updates: Partial<UserProfile>) => void;
  getUser: (userId: string) => UserProfile | undefined;
  followUser: (currentUserId: string, targetUserId: string) => void;
  unfollowUser: (currentUserId: string, targetUserId: string) => void;
  isFollowing: (currentUserId: string, targetUserId: string) => boolean;
  getFollowersCount: (userId: string) => number;
  getFollowingCount: (userId: string) => number;
  getAllUsers: () => UserProfile[];
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      followers: {},
      following: {},
      
      addUser: (user) =>
        set((state) => {
          // Check if user already exists
          const exists = state.users.some(u => u.uid === user.uid);
          if (exists) return state;
          
          return {
            users: [...state.users, user],
          };
        }),
      
      updateUser: (userId, updates) =>
        set((state) => ({
          users: state.users.map(u => 
            u.uid === userId ? { ...u, ...updates } : u
          ),
        })),
      
      getUser: (userId) => {
        return get().users.find(u => u.uid === userId);
      },
      
      followUser: (currentUserId, targetUserId) =>
        set((state) => {
          const currentFollowing = state.following[currentUserId] || [];
          const targetFollowers = state.followers[targetUserId] || [];
          
          // Check if already following
          if (currentFollowing.includes(targetUserId)) return state;
          
          return {
            following: {
              ...state.following,
              [currentUserId]: [...currentFollowing, targetUserId],
            },
            followers: {
              ...state.followers,
              [targetUserId]: [...targetFollowers, currentUserId],
            },
          };
        }),
      
      unfollowUser: (currentUserId, targetUserId) =>
        set((state) => {
          const currentFollowing = state.following[currentUserId] || [];
          const targetFollowers = state.followers[targetUserId] || [];
          
          return {
            following: {
              ...state.following,
              [currentUserId]: currentFollowing.filter(id => id !== targetUserId),
            },
            followers: {
              ...state.followers,
              [targetUserId]: targetFollowers.filter(id => id !== currentUserId),
            },
          };
        }),
      
      isFollowing: (currentUserId, targetUserId) => {
        const state = get();
        const currentFollowing = state.following[currentUserId] || [];
        return currentFollowing.includes(targetUserId);
      },
      
      getFollowersCount: (userId) => {
        const state = get();
        return (state.followers[userId] || []).length;
      },
      
      getFollowingCount: (userId) => {
        const state = get();
        return (state.following[userId] || []).length;
      },
      
      getAllUsers: () => get().users,
    }),
    {
      name: 'users-storage',
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const { state } = JSON.parse(str);
            
            // Validate the state structure
            if (!state || typeof state !== 'object') {
              console.warn('Invalid state in localStorage, resetting...');
              return null;
            }
            
            return {
              state: {
                users: Array.isArray(state.users) ? state.users.map((user: Record<string, unknown>) => ({
                  ...user,
                  createdAt: typeof user.createdAt === 'string' ? new Date(user.createdAt) : user.createdAt
                })) : [],
                following: state.following || {},
                followers: state.followers || {},
              }
            };
          } catch (error: unknown) {
            console.error('Error loading users from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error: unknown) {
            console.error('Error saving users to localStorage:', error);
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

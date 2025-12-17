import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post } from '@/types';

interface PostsState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'tags' | 'authorId' | 'likedBy'> & { user: { id: string; username: string; avatar: string; fullName: string }; media: { url: string; type: 'image' | 'video' }[]; caption: string }) => void;
  likePost: (postId: string, userId: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  addComment: (postId: string) => void;
  deletePost: (postId: string) => void;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set) => ({
      posts: [],
      addPost: (postData) =>
        set((state) => ({
          posts: [
            {
              id: `post-${Date.now()}`,
              authorId: postData.user.id,
              author: {
                uid: postData.user.id,
                username: postData.user.username,
                displayName: postData.user.fullName,
                avatarUrl: postData.user.avatar,
                bio: '',
                stats: { posts: 0, followers: 0, following: 0 },
                createdAt: new Date(),
              },
              media: postData.media,
              caption: postData.caption,
              tags: [],
              likesCount: 0,
              commentsCount: 0,
              createdAt: new Date(),
              likedBy: [],
              likes: [],
            },
            ...state.posts,
          ],
        })),
      likePost: (postId, userId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId 
              ? { 
                  ...p, 
                  likesCount: p.likesCount + 1,
                  likes: [...(p.likes || []), userId],
                  likedBy: [...(p.likedBy || []), userId],
                } 
              : p
          ),
        })),
      unlikePost: (postId, userId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId 
              ? { 
                  ...p, 
                  likesCount: Math.max(0, p.likesCount - 1),
                  likes: (p.likes || []).filter(id => id !== userId),
                  likedBy: (p.likedBy || []).filter(id => id !== userId),
                } 
              : p
          ),
        })),
      addComment: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
          ),
        })),
      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        })),
    }),
    {
      name: 'posts-storage',
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const { state } = JSON.parse(str);
            
            // Validate that posts is an array
            if (!state.posts || !Array.isArray(state.posts)) {
              console.warn('Invalid posts data in localStorage, resetting...');
              return null;
            }
            
            return {
              state: {
                ...state,
                posts: state.posts.map((post: any) => ({
                  ...post,
                  createdAt: new Date(post.createdAt),
                  author: post.author ? {
                    ...post.author,
                    createdAt: new Date(post.author.createdAt)
                  } : undefined
                }))
              }
            };
          } catch (error) {
            console.error('Error loading posts from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error saving posts to localStorage:', error);
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

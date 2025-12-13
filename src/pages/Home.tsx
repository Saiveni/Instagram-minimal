import { useState, useEffect } from 'react';
import { StoriesBar } from '@/components/feed/StoriesBar';
import { PostCard } from '@/components/feed/PostCard';
import type { Post } from '@/types';

// Mock data for demo purposes (no auth required)
const mockPosts: Post[] = [
  {
    id: '1',
    authorId: 'user1',
    author: {
      uid: 'user1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      bio: 'Photography enthusiast',
      stats: { posts: 42, followers: 1234, following: 567 },
      createdAt: new Date(),
    },
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop' }],
    caption: 'Beautiful sunset views 🌅',
    tags: [],
    likesCount: 128,
    commentsCount: 24,
    createdAt: new Date(),
  },
  {
    id: '2',
    authorId: 'user2',
    author: {
      uid: 'user2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      bio: 'Travel lover',
      stats: { posts: 78, followers: 2345, following: 890 },
      createdAt: new Date(),
    },
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop' }],
    caption: 'Mountain adventures await! ⛰️',
    tags: [],
    likesCount: 256,
    commentsCount: 42,
    createdAt: new Date(),
  },
];

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading with mock data
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  return (
    <div className="max-w-lg mx-auto">
      <StoriesBar />
      
      {loading ? (
        <div className="space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
              <div className="aspect-square bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))
      )}
    </div>
  );
};

export default HomePage;

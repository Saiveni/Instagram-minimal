import { useState, useEffect, useRef } from 'react';
import { StoriesBar } from '@/components/feed/StoriesBar';
import { PostCard } from '@/components/feed/PostCard';
import { useAuthStore } from '@/stores/authStore';
import { usePostsStore } from '@/stores/postsStore';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import type { Post } from '@/types';
import { postsService } from '@/services/firebase/posts';

const HomePage = () => {
  const { user } = useAuthStore();
  const { posts } = usePostsStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, [user]);

  useEffect(() => {
    // Load posts progressively
    if (!loading && posts.length > 0) {
      setVisiblePosts([]);
      posts.forEach((post, index) => {
        setTimeout(() => {
          setVisiblePosts(prev => [...prev, post]);
        }, index * 100);
      });
    }
  }, [posts, loading]);

  useEffect(() => {
    // Subscribe to posts in real-time
    const unsubscribe = postsService.subscribeToPost((fetchedPosts) => {
      // Update local store with Firebase posts
      usePostsStore.setState({ posts: fetchedPosts });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 70) {
      handleRefresh();
    }
    setPullDistance(0);
  };

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  return (
    <div 
      ref={scrollRef}
      className="max-w-lg mx-auto relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 flex justify-center pt-4 z-50"
          >
            <motion.div
              animate={{ rotate: pullDistance > 70 ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw className={`h-6 w-6 ${pullDistance > 70 ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refreshing indicator */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 flex justify-center pt-4 z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <StoriesBar />
      </motion.div>
      
      {loading ? (
        <div className="space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-muted skeleton" />
                <div className="h-4 w-24 bg-muted rounded skeleton" />
              </div>
              <div className="aspect-square bg-muted rounded skeleton shimmer" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-32 bg-muted rounded skeleton" />
                <div className="h-3 w-full bg-muted rounded skeleton" />
                <div className="h-3 w-3/4 bg-muted rounded skeleton" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 text-center px-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"
          >
            <svg
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold mb-2"
          >
            No posts yet
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            When people create posts, you'll see them here
          </motion.p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <PostCard
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default HomePage;

import { useState, useRef, useEffect, useMemo } from 'react';
import { ReelCard } from '@/components/reels/ReelCard';
import { usePostsStore } from '@/stores/postsStore';
import type { Reel } from '@/types';

const ReelsPage = () => {
  const { posts } = usePostsStore();
  
  // Convert video posts to reels format
  const reels = useMemo(() => {
    return posts
      .filter(post => post.media.some(media => media.type === 'video'))
      .map(post => ({
        id: post.id,
        authorId: post.authorId,
        author: post.author,
        videoUrl: post.media.find(media => media.type === 'video')?.url || '',
        caption: post.caption,
        tags: post.tags,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        viewsCount: 0,
        createdAt: post.createdAt,
      } as Reel));
  }, [posts]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const height = containerRef.current.clientHeight;
        const newIndex = Math.round(scrollTop / height);
        setActiveIndex(newIndex);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] text-center px-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reels Yet</h3>
        <p className="text-muted-foreground">
          When people post videos, they'll appear here as reels
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] overflow-y-auto snap-y-mandatory scrollbar-hide"
    >
      {reels.map((reel, index) => (
        <div key={reel.id} className="h-full snap-start">
          <ReelCard reel={reel} isActive={index === activeIndex} />
        </div>
      ))}
    </div>
  );
};

export default ReelsPage;

import { useState, useRef, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReelCard } from '@/components/reels/ReelCard';
import type { Reel, UserProfile } from '@/types';

const mockReels: Reel[] = [
  {
    id: '1',
    authorId: '1',
    author: {
      uid: '1',
      username: 'nature_vibes',
      displayName: 'Nature Vibes',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature',
      bio: '',
      stats: { posts: 0, followers: 0, following: 0 },
      createdAt: new Date(),
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Amazing sunset views 🌅 #nature #sunset #vibes',
    tags: ['nature', 'sunset', 'vibes'],
    likesCount: 12453,
    commentsCount: 234,
    viewsCount: 89234,
    createdAt: new Date(),
  },
  {
    id: '2',
    authorId: '2',
    author: {
      uid: '2',
      username: 'travel_addict',
      displayName: 'Travel Addict',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel',
      bio: '',
      stats: { posts: 0, followers: 0, following: 0 },
      createdAt: new Date(),
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'Exploring the world one city at a time ✈️ #travel #explore',
    tags: ['travel', 'explore'],
    likesCount: 8932,
    commentsCount: 156,
    viewsCount: 45678,
    createdAt: new Date(),
  },
  {
    id: '3',
    authorId: '3',
    author: {
      uid: '3',
      username: 'foodie_life',
      displayName: 'Foodie Life',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=food',
      bio: '',
      stats: { posts: 0, followers: 0, following: 0 },
      createdAt: new Date(),
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    caption: 'The most delicious dish I have ever made! 🍝 #food #cooking',
    tags: ['food', 'cooking'],
    likesCount: 5621,
    commentsCount: 89,
    viewsCount: 23456,
    createdAt: new Date(),
  },
];

const ReelsPage = () => {
  const [reels, setReels] = useState<Reel[]>(mockReels);
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

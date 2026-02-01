import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePostsStore } from '@/stores/postsStore';
import { useUsersStore } from '@/stores/usersStore';
import { useAuthStore } from '@/stores/authStore';
import { SharePostDialog } from '@/components/feed/SharePostDialog';
import { CommentsModal } from '@/components/feed/CommentsModal';
import type { Reel } from '@/types';

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
}

export const ReelCard = ({ reel, isActive }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { user } = useAuthStore();
  const { likePost, unlikePost } = usePostsStore();
  const { followUser, unfollowUser, isFollowing } = useUsersStore();

  const isFollowingAuthor = user && reel.authorId ? isFollowing(user.uid, reel.authorId) : false;

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = () => {
    if (!user) return;
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    if (newLikedState) {
      likePost(reel.id, user.uid);
    } else {
      unlikePost(reel.id, user.uid);
    }
  };

  const handleFollow = () => {
    if (!user || !reel.authorId) return;
    
    if (isFollowingAuthor) {
      unfollowUser(user.uid, reel.authorId);
    } else {
      followUser(user.uid, reel.authorId);
    }
  };

  return (
    <div className="relative h-full w-full bg-black snap-start">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="h-full w-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Pause indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="h-16 w-16 text-white" />
        </div>
      )}

      {/* Right actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
        >
          <Heart className={`h-7 w-7 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          <span className="text-white text-xs">{(reel.likesCount + (liked ? 1 : 0)).toLocaleString()}</span>
        </motion.button>

        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => setCommentsOpen(true)}
        >
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="text-white text-xs">{reel.commentsCount}</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => setShareOpen(true)}
        >
          <Send className="h-7 w-7 text-white" />
          <span className="text-white text-xs">Share</span>
        </button>

        <button onClick={toggleMute}>
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute left-3 right-16 bottom-8 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage src={reel.author?.avatarUrl} />
            <AvatarFallback>{reel.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold">{reel.author?.username}</span>
          {user && reel.authorId !== user.uid && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-white/20"
              onClick={handleFollow}
            >
              {isFollowingAuthor ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        <p className="text-white text-sm line-clamp-2">{reel.caption}</p>

        <div className="flex items-center gap-2 text-white">
          <Music className="h-4 w-4" />
          <span className="text-xs">Original audio</span>
        </div>
      </div>

      {/* Share Dialog */}
      <SharePostDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        postId={reel.id}
        postImage={reel.videoUrl}
        postCaption={reel.caption}
      />

      {/* Comments Modal */}
      <CommentsModal
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        postId={reel.id}
      />
    </div>
  );
};

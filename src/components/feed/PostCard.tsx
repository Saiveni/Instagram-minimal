import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { usePostsStore } from '@/stores/postsStore';
import { CommentsModal } from './CommentsModal';
import { SharePostDialog } from './SharePostDialog';
import { SavePostDialog } from './SavePostDialog';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const { user } = useAuthStore();
  const { likePost, unlikePost, deletePost } = usePostsStore();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  useEffect(() => {
    if (user && post.likes) {
      setLiked(post.likes.includes(user.id));
    }
  }, [user, post.likes]);

  const handleLike = () => {
    if (!user) return;
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    if (newLikedState) {
      likePost(post.id, user.id);
    } else {
      unlikePost(post.id, user.id);
    }
    
    onLike?.(post.id);
  };

  const handleDoubleTap = () => {
    if (!user || liked) return;
    
    setLiked(true);
    likePost(post.id, user.id);
    onLike?.(post.id);
    
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
  };

  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });
  const shouldTruncate = post.caption.length > 100;
  const displayCaption = expanded ? post.caption : post.caption.slice(0, 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border pb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage src={post.author?.avatarUrl} alt={post.author?.username} />
            <AvatarFallback>{post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{post.author?.username}</p>
          </div>
        </Link>
        
        {user?.id === post.authorId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Media */}
      <div 
        className="relative aspect-square bg-muted cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        {post.media[currentMediaIndex]?.type === 'image' ? (
          <img
            src={post.media[currentMediaIndex]?.url}
            alt="Post"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={post.media[currentMediaIndex]?.url}
            className="w-full h-full object-cover"
            controls
          />
        )}

        {/* Carousel indicators */}
        {post.media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {post.media.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentMediaIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentMediaIndex ? 'bg-primary' : 'bg-foreground/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Like animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="h-24 w-24 text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLike}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <motion.div whileTap={{ scale: 0.8 }}>
                <Heart className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </motion.div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCommentsOpen(true)}
              aria-label="Comment"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShareOpen(true)}
              aria-label="Share"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              if (saved) {
                setSaved(false);
              } else {
                setSaveOpen(true);
              }
            }}
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <Bookmark className={`h-6 w-6 ${saved ? 'fill-foreground' : ''}`} />
          </Button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-sm">
          {(post.likesCount + (liked ? 1 : 0)).toLocaleString()} likes
        </p>

        {/* Caption */}
        <p className="text-sm">
          <Link to={`/profile/${post.author?.username}`} className="font-semibold mr-1">
            {post.author?.username}
          </Link>
          {displayCaption}
          {shouldTruncate && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-muted-foreground ml-1"
            >
              ...more
            </button>
          )}
        </p>

        {/* Comments preview */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setCommentsOpen(true)}
            className="text-sm text-muted-foreground"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>

      {/* Modals */}
      <CommentsModal
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        postId={post.id}
        postImage={post.media[0]?.url}
      />
      <SharePostDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        postId={post.id}
        postImage={post.media[0]?.url}
      />
      <SavePostDialog
        open={saveOpen}
        onOpenChange={(open) => {
          setSaveOpen(open);
          if (!open) setSaved(true);
        }}
        postId={post.id}
        postImage={post.media[0]?.url}
      />
    </motion.article>
  );
};

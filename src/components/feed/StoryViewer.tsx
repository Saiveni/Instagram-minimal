import { useState, useEffect, useMemo } from 'react';
import { X, Heart, Send, MoreHorizontal, ChevronLeft, ChevronRight, Pause, Play, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { useStoriesStore } from '@/stores/storiesStore';
import { useUsersStore } from '@/stores/usersStore';

interface Story {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: Date;
  views?: string[];
  viewsCount?: number;
}

interface StoryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: Story[];
  initialIndex?: number;
  isOwnStory?: boolean;
}

export const StoryViewer = ({ open, onOpenChange, stories, initialIndex = 0, isOwnStory = false }: StoryViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showViews, setShowViews] = useState(false);
  const [viewsModalOpen, setViewsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { addView, getStoryViews } = useStoriesStore();
  const { getUser } = useUsersStore();

  // Safety check - if stories array is empty or index is out of bounds, close the viewer
  const safeStories = Array.isArray(stories) ? stories : [];
  const safeIndex = Math.min(Math.max(0, currentStoryIndex), Math.max(0, safeStories.length - 1));
  const currentStory = safeStories[safeIndex];
  const duration = 5000; // 5 seconds per story

  // Track story view when story changes
  useEffect(() => {
    if (open && currentStory && user && !isOwnStory) {
      addView(currentStory.id, user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentStory?.id, user?.uid, isOwnStory]);

  useEffect(() => {
    if (!open || isPaused || safeStories.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentStoryIndex < safeStories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            return 0;
          } else {
            // Close viewer when all stories are done
            onOpenChange(false);
            return 0;
          }
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [open, isPaused, currentStoryIndex, safeStories.length, duration, onOpenChange]);

  useEffect(() => {
    if (open) {
      setCurrentStoryIndex(Math.min(initialIndex, Math.max(0, safeStories.length - 1)));
      setProgress(0);
      setShowViews(false);
    }
  }, [open, initialIndex, safeStories.length]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < safeStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onOpenChange(false);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    // In a real app, this would send the reply
    console.log('Reply:', replyText);
    setReplyText('');
  };

  const viewersList = isOwnStory ? getStoryViews(currentStory.id).map(userId => getUser(userId)).filter(Boolean) : [];

  // Safe date formatting
  const getTimeAgo = useMemo(() => {
    if (!currentStory?.createdAt) return '';
    try {
      const date = currentStory.createdAt instanceof Date 
        ? currentStory.createdAt 
        : new Date(currentStory.createdAt);
      if (isNaN(date.getTime())) return '';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting story date:', error);
      return '';
    }
  }, [currentStory?.createdAt]);

  if (!currentStory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[90vh] p-0 bg-black border-0">
        <div className="relative h-full flex flex-col">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {safeStories.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width:
                      index < currentStoryIndex
                        ? '100%'
                        : index === currentStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={currentStory.avatarUrl} />
                <AvatarFallback>{currentStory.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-semibold">{currentStory.username}</p>
                <p className="text-white/70 text-xs">
                  {getTimeAgo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOwnStory && currentStory.viewsCount !== undefined && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-white hover:bg-white/20 h-auto py-1 px-2"
                  onClick={() => {
                    setIsPaused(true);
                    setViewsModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{currentStory.viewsCount}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Story content */}
          <div className="flex-1 relative flex items-center justify-center">
            {currentStory.mediaType === 'image' ? (
              <img
                src={currentStory.mediaUrl}
                alt="Story"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                src={currentStory.mediaUrl}
                className="max-h-full max-w-full object-contain"
                autoPlay
                muted
              />
            )}

            {/* Navigation areas */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              disabled={currentStoryIndex === 0}
            />
            <button
              onClick={handleNext}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            />

            {/* Navigation buttons */}
            {currentStoryIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}
            {currentStoryIndex < safeStories.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Caption */}
            {currentStory.caption && (
              <div className="absolute bottom-20 left-0 right-0 px-4">
                <p className="text-white text-sm">{currentStory.caption}</p>
              </div>
            )}
          </div>

          {/* Reply input */}
          <div className="p-4 flex items-center gap-2">
            <Input
              placeholder={`Reply to ${currentStory.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
              className="bg-transparent border-white/30 text-white placeholder:text-white/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleReply}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Views Modal */}
        <Dialog open={viewsModalOpen} onOpenChange={(open) => {
          setViewsModalOpen(open);
          if (!open) setIsPaused(false);
        }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Viewed by {currentStory.viewsCount}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {viewersList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No views yet</p>
                ) : (
                  viewersList.map((viewer: any) => (
                    <div key={viewer.uid} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={viewer.avatarUrl} />
                        <AvatarFallback>{viewer.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{viewer.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{viewer.username}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

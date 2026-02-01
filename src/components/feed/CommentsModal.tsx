import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  createdAt: Date;
  likesCount: number;
}

interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postImage?: string;
}

export const CommentsModal = ({ open, onOpenChange, postId, postImage }: CommentsModalProps) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.uid,
      username: user.email?.split('@')[0] || 'user',
      avatarUrl: user.photoURL || '',
      text: commentText,
      createdAt: new Date(),
      likesCount: 0,
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] p-0">
        <div className="flex h-full">
          {/* Post Image */}
          {postImage && (
            <div className="hidden md:flex flex-1 bg-black items-center justify-center">
              <img
                src={postImage}
                alt="Post"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {/* Comments Section */}
          <div className="flex flex-col w-full md:w-[400px]">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 p-4">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground mb-2">No comments yet</p>
                  <p className="text-sm text-muted-foreground">Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatarUrl} />
                        <AvatarFallback>{comment.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <p className="text-sm">
                            <span className="font-semibold mr-2">{comment.username}</span>
                            {comment.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="border-t p-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentText.trim()}
                  variant={commentText.trim() ? 'default' : 'ghost'}
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

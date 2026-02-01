import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PostCard } from './PostCard';
import type { Post } from '@/types';

interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}

export const PostDetailModal = ({ open, onOpenChange, post }: PostDetailModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="...">
          {/* content */}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <PostCard post={post} />
      </DialogContent>
    </Dialog>
  );
};

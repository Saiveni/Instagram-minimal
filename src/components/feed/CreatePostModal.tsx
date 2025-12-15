import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { usePostsStore } from '@/stores/postsStore';
import { toast } from 'sonner';

export const CreatePostModal = () => {
  const { createPostOpen, setCreatePostOpen } = useUIStore();
  const { user } = useAuthStore();
  const { addPost } = usePostsStore();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles([...files, ...selectedFiles]);
    
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user || files.length === 0) return;

    setUploading(true);
    try {
      // Add post to store with current previews
      addPost({
        user: {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
          avatar: user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          fullName: user.user_metadata?.display_name || user.user_metadata?.username || 'User'
        },
        caption,
        media: previews.map((preview, index) => ({
          url: preview,
          type: files[index].type.startsWith('video/') ? 'video' as const : 'image' as const
        }))
      });
      
      toast.success('Post created!');
      setCreatePostOpen(false);
      setFiles([]);
      setPreviews([]);
      setCaption('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {previews.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Click to upload photos or videos</p>
              <p className="text-xs text-muted-foreground mt-2">Up to 10 files</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  {files[index]?.type.startsWith('video') ? (
                    <video src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {previews.length < 10 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={2200}
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {caption.length}/2,200
            </span>
            <Button
              onClick={handleSubmit}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Share'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

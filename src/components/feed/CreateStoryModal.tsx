import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Type, Smile, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useStoriesStore } from '@/stores/storiesStore';
import { useUsersStore } from '@/stores/usersStore';

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateStoryModal = ({ open, onOpenChange }: CreateStoryModalProps) => {
  const { user } = useAuthStore();
  const { addStory } = useStoriesStore();
  const { getUser } = useUsersStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }

    // Check file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !user) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
      
      // Get the stored user to use their current avatar
      const storedUser = getUser(user.id);
      const avatar = storedUser?.avatarUrl || user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
      
      // Add story to store with preview
      addStory({
        id: `story-${Date.now()}`,
        userId: user.id,
        username: username,
        avatarUrl: avatar,
        mediaUrl: preview,
        mediaType: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        caption: caption || undefined,
        createdAt: new Date()
      });
      
      toast.success('Story posted successfully!');
      onOpenChange(false);
      setFile(null);
      setPreview('');
      setCaption('');
    } catch (error) {
      toast.error('Failed to post story');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview('');
    setCaption('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Click to upload photo or video</p>
              <p className="text-xs text-muted-foreground">
                Max file size: 50MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[9/16] max-h-[500px] rounded-lg overflow-hidden bg-black">
                {file?.type.startsWith('video') ? (
                  <video src={preview} className="w-full h-full object-contain" controls />
                ) : (
                  <img src={preview} alt="Story preview" className="w-full h-full object-contain" />
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview('');
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {caption.length}/100
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={uploading} className="flex-1">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Share Story'
                  )}
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

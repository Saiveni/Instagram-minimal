import { useState } from 'react';
import { Bookmark, Plus, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

interface SaveCollection {
  id: string;
  name: string;
  count: number;
}

interface SavePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postImage?: string;
}

export const SavePostDialog = ({ open, onOpenChange, postId, postImage }: SavePostDialogProps) => {
  const { user } = useAuthStore();
  const [collections, setCollections] = useState<SaveCollection[]>([
    { id: 'all', name: 'All Posts', count: 0 },
  ]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  const handleSave = () => {
    if (!selectedCollection) {
      toast.error('Please select a collection');
      return;
    }

    const collection = collections.find((c) => c.id === selectedCollection);
    toast.success(`Saved to ${collection?.name || 'your collection'}`);
    onOpenChange(false);
    setSelectedCollection('');
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    const newCollection: SaveCollection = {
      id: Date.now().toString(),
      name: newCollectionName,
      count: 0,
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setShowCreateNew(false);
    toast.success('Collection created');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="h-12 w-12 bg-primary/20 rounded flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Save to {displayName}'s account</p>
              <p className="text-xs text-muted-foreground">
                Only you can see what you've saved
              </p>
            </div>
          </div>

          {!showCreateNew ? (
            <>
              <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                  {collections.map((collection) => {
                    const isSelected = selectedCollection === collection.id;
                    return (
                      <button
                        key={collection.id}
                        onClick={() => setSelectedCollection(collection.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                            <Bookmark className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{collection.name}</p>
                            <p className="text-xs text-muted-foreground">{collection.count} posts</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              <Button
                variant="outline"
                onClick={() => setShowCreateNew(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateNew(false);
                    setNewCollectionName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCollection} className="flex-1">
                  Create
                </Button>
              </div>
            </div>
          )}

          {!showCreateNew && (
            <Button
              onClick={handleSave}
              disabled={!selectedCollection}
              className="w-full"
            >
              Save Post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

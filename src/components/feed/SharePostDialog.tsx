import { useState } from 'react';
import { Send, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface User {
  uid: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

interface SharePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postImage?: string;
}

// Mock users for sharing
const mockUsers: User[] = [
  {
    uid: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    uid: '2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
  },
  {
    uid: '3',
    username: 'alice_smith',
    displayName: 'Alice Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  },
  {
    uid: '4',
    username: 'bob_jones',
    displayName: 'Bob Jones',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
  },
];

export const SharePostDialog = ({ open, onOpenChange, postId, postImage }: SharePostDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSend = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    // In a real app, this would send the post to selected users
    toast.success(`Post shared with ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`);
    setSelectedUsers([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ScrollArea className="h-[300px]">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                {searchQuery ? 'No users found' : 'Search for users to share'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.uid);
                  return (
                    <button
                      key={user.uid}
                      onClick={() => toggleUser(user.uid)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={selectedUsers.length === 0}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Send {selectedUsers.length > 0 && `(${selectedUsers.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

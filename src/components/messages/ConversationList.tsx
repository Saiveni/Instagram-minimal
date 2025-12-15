import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  currentUserId: string;
  onSelect: (conversation: Conversation) => void;
}

// Mock users data for search
const mockUsers = [
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
  {
    uid: '5',
    username: 'charlie_brown',
    displayName: 'Charlie Brown',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
  },
  {
    uid: '6',
    username: 'diana_prince',
    displayName: 'Diana Prince',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
  },
  {
    uid: '7',
    username: 'evan_peters',
    displayName: 'Evan Peters',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=evan',
  },
];

export const ConversationList = ({ conversations, selectedId, currentUserId, onSelect }: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = conversation.participantProfiles?.find(p => p.uid !== currentUserId);
    return (
      otherUser?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredUsers = mockUsers.filter((user) =>
    user.displayName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleStartChat = (user: typeof mockUsers[0]) => {
    // This would create a new conversation with the selected user
    // For now, we'll just close the dialog
    setSearchDialogOpen(false);
    setUserSearchQuery('');
    // In a real app, you would create a new conversation here
  };

  return (
    <div className="border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Messages</h2>
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="New message">
                <UserPlus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[300px]">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      {userSearchQuery ? 'No users found' : 'Search for users to start chatting'}
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <button
                        key={user.uid}
                        onClick={() => handleStartChat(user)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold text-sm">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </button>
                    ))
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <p className="p-4 text-center text-muted-foreground text-sm">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </p>
        ) : (
          filteredConversations.map((conversation, index) => {
            const otherUser = conversation.participantProfiles?.find(p => p.uid !== currentUserId);
            const isSelected = conversation.id === selectedId;

            return (
              <motion.button
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(conversation)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                  isSelected ? 'bg-muted' : ''
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUser?.avatarUrl} />
                  <AvatarFallback>{otherUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold truncate">{otherUser?.displayName}</p>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: false })}
                </span>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
};

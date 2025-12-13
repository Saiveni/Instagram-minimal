import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Conversation } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  currentUserId: string;
  onSelect: (conversation: Conversation) => void;
}

export const ConversationList = ({ conversations, selectedId, currentUserId, onSelect }: ConversationListProps) => {
  return (
    <div className="border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="p-4 text-center text-muted-foreground text-sm">No conversations yet</p>
        ) : (
          conversations.map((conversation, index) => {
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

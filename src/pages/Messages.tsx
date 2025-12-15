import { useState } from 'react';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { useAuthStore } from '@/stores/authStore';
import type { Conversation, Message } from '@/types';

// Real conversations will be fetched from database
const mockConversations: Conversation[] = [];
const mockMessages: Message[] = [];

const MessagesPage = () => {
  const { user } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages.filter((m) => m.conversationId === conversation.id));
  };

  const handleSendMessage = (text: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: 'current',
      text,
      createdAt: new Date(),
      readBy: [],
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] flex">
      <div className="w-full md:w-80 lg:w-96">
        <ConversationList
          conversations={mockConversations}
          selectedId={selectedConversation?.id || null}
          currentUserId="current"
          onSelect={handleSelectConversation}
        />
      </div>
      <div className="hidden md:flex flex-1">
        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
          currentUserId="current"
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessagesPage;

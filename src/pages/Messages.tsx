import { useState } from 'react';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { useAuthStore } from '@/stores/authStore';
import type { Conversation, Message } from '@/types';

const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['current', '1'],
    participantProfiles: [
      {
        uid: '1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        bio: '',
        stats: { posts: 0, followers: 0, following: 0 },
        createdAt: new Date(),
      },
    ],
    lastMessage: 'Hey! How are you?',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    participants: ['current', '2'],
    participantProfiles: [
      {
        uid: '2',
        username: 'janedoe',
        displayName: 'Jane Doe',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        bio: '',
        stats: { posts: 0, followers: 0, following: 0 },
        createdAt: new Date(),
      },
    ],
    lastMessage: 'See you tomorrow!',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const mockMessages: Message[] = [
  { id: '1', conversationId: '1', senderId: '1', text: 'Hey there!', createdAt: new Date(Date.now() - 1000 * 60 * 10), readBy: [] },
  { id: '2', conversationId: '1', senderId: 'current', text: 'Hi! What\'s up?', createdAt: new Date(Date.now() - 1000 * 60 * 8), readBy: [] },
  { id: '3', conversationId: '1', senderId: '1', text: 'Not much, just chilling. You?', createdAt: new Date(Date.now() - 1000 * 60 * 6), readBy: [] },
  { id: '4', conversationId: '1', senderId: 'current', text: 'Same here, working on some projects.', createdAt: new Date(Date.now() - 1000 * 60 * 5), readBy: [] },
  { id: '5', conversationId: '1', senderId: '1', text: 'Hey! How are you?', createdAt: new Date(Date.now() - 1000 * 60 * 2), readBy: [] },
];

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

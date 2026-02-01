import { useState } from 'react';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { useAuthStore } from '@/stores/authStore';
import { useMessagesStore } from '@/stores/messagesStore';
import { useUsersStore } from '@/stores/usersStore';
import type { Conversation, Message } from '@/types';

const MessagesPage = () => {
  const { user } = useAuthStore();
  const { getUserConversations, getMessages, addMessage, getOrCreateConversation, markAsRead } = useMessagesStore();
  const { getUser } = useUsersStore();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const conversations = user ? getUserConversations(user.uid) : [];
  const messages = selectedConversation ? getMessages(selectedConversation.id) : [];

  // Populate participant profiles
  const conversationsWithProfiles = conversations.map(conv => ({
    ...conv,
    participantProfiles: conv.participants.map(uid => getUser(uid)).filter(Boolean),
  }));

  const selectedConversationWithProfiles = selectedConversation ? {
    ...selectedConversation,
    participantProfiles: selectedConversation.participants.map(uid => getUser(uid)).filter(Boolean),
  } : null;

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (user) {
      markAsRead(conversation.id, user.uid);
    }
  };

  const handleSendMessage = (text: string, mediaUrl?: string, mediaType?: string) => {
    if (!selectedConversation || !user) return;
    if (!text.trim() && !mediaUrl) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: selectedConversation.id,
      senderId: user.uid,
      text,
      mediaUrl,
      createdAt: new Date(),
      readBy: [user.uid],
    };

    addMessage(newMessage);
  };

  // Handler for starting a new conversation from ConversationList
  const handleStartNewConversation = (otherUserId: string) => {
    if (!user) return;
    const conversation = getOrCreateConversation(user.uid, otherUserId);
    setSelectedConversation(conversation);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] flex">
      {/* Conversation list - hide on mobile when chat is open */}
      <div className={`w-full md:w-80 lg:w-96 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationList
          conversations={conversationsWithProfiles}
          selectedId={selectedConversation?.id || null}
          currentUserId={user?.uid || 'current'}
          onSelect={handleSelectConversation}
          onStartNewConversation={handleStartNewConversation}
        />
      </div>
      {/* Chat window - show on mobile when conversation selected */}
      <div className={`flex-1 ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        <ChatWindow
          conversation={selectedConversationWithProfiles}
          messages={messages}
          currentUserId={user?.uid || 'current'}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    </div>
  );
};

export default MessagesPage;

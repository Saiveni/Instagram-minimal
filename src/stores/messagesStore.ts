import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message } from '@/types';

interface MessagesState {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  addConversation: (conversation: Conversation) => void;
  addMessage: (message: Message) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  getUserConversations: (userId: string) => Conversation[];
  getOrCreateConversation: (participant1: string, participant2: string) => Conversation;
  markAsRead: (conversationId: string, userId: string) => void;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},

      addConversation: (conversation) =>
        set((state) => {
          const exists = state.conversations.find(c => c.id === conversation.id);
          if (exists) return state;
          return {
            conversations: [...state.conversations, conversation],
          };
        }),

      addMessage: (message) =>
        set((state) => {
          const conversationMessages = state.messages[message.conversationId] || [];
          return {
            messages: {
              ...state.messages,
              [message.conversationId]: [...conversationMessages, message],
            },
            conversations: state.conversations.map(c =>
              c.id === message.conversationId
                ? { ...c, lastMessage: message.text || 'Media', lastMessageAt: message.createdAt }
                : c
            ),
          };
        }),

      getConversation: (conversationId) => {
        return get().conversations.find(c => c.id === conversationId);
      },

      getMessages: (conversationId) => {
        return get().messages[conversationId] || [];
      },

      getUserConversations: (userId) => {
        return get().conversations.filter(c => c.participants.includes(userId));
      },

      getOrCreateConversation: (participant1, participant2) => {
        const { conversations, addConversation } = get();
        
        // Find existing conversation
        const existing = conversations.find(c =>
          c.participants.includes(participant1) && c.participants.includes(participant2)
        );
        
        if (existing) return existing;
        
        // Create new conversation
        const newConversation: Conversation = {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          participants: [participant1, participant2],
          lastMessage: '',
          lastMessageAt: new Date(),
          unreadCount: 0,
        };
        
        addConversation(newConversation);
        return newConversation;
      },

      markAsRead: (conversationId, userId) =>
        set((state) => {
          const conversationMessages = state.messages[conversationId] || [];
          return {
            messages: {
              ...state.messages,
              [conversationId]: conversationMessages.map(m =>
                !m.readBy.includes(userId) ? { ...m, readBy: [...m.readBy, userId] } : m
              ),
            },
            conversations: state.conversations.map(c =>
              c.id === conversationId ? { ...c, unreadCount: 0 } : c
            ),
          };
        }),
    }),
    {
      name: 'messages-storage',
    }
  )
);

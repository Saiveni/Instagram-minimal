import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc,
  query, 
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Conversation, Message } from '@/types';

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';

export const messagesService = {
  // Create or get conversation
  async getOrCreateConversation(participant1: string, participant2: string): Promise<string> {
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    const participants = [participant1, participant2].sort();
    
    const q = query(
      conversationsRef,
      where('participants', '==', participants)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    
    // Create new conversation
    const docRef = await addDoc(conversationsRef, {
      participants,
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // Send message
  async sendMessage(conversationId: string, senderId: string, text: string, mediaUrl?: string) {
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    
    await addDoc(messagesRef, {
      conversationId,
      senderId,
      text,
      mediaUrl,
      createdAt: serverTimestamp(),
      readBy: [senderId]
    });
    
    // Update conversation last message
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
    await updateDoc(conversationRef, {
      lastMessage: text,
      lastMessageAt: serverTimestamp()
    });
  },

  // Get messages for conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Message;
    });
  },

  // Subscribe to messages
  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Message;
      });
      callback(messages);
    });
  },

  // Mark message as read
  async markAsRead(messageId: string, userId: string) {
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
    await updateDoc(messageRef, {
      readBy: arrayUnion(userId)
    });
  },

  // Get user conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        lastMessageAt: data.lastMessageAt?.toDate() || new Date()
      } as Conversation;
    });
  }
};

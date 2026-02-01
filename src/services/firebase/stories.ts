import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STORIES_COLLECTION = 'stories';

export interface Story {
  id?: string;
  userId: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: Date;
  views?: string[];
}

export const storiesService = {
  // Create a new story
  async createStory(storyData: Omit<Story, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, STORIES_COLLECTION), {
      ...storyData,
      views: [],
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get all stories (less than 24 hours old)
  async getStories(): Promise<Story[]> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const q = query(
      collection(db, STORIES_COLLECTION),
      where('createdAt', '>=', Timestamp.fromDate(twentyFourHoursAgo)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Story[];
  },

  // Get stories by user
  async getStoriesByUser(userId: string): Promise<Story[]> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const q = query(
      collection(db, STORIES_COLLECTION),
      where('userId', '==', userId),
      where('createdAt', '>=', Timestamp.fromDate(twentyFourHoursAgo)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Story[];
  },

  // Delete old stories (older than 24 hours)
  async deleteOldStories(): Promise<void> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const q = query(
      collection(db, STORIES_COLLECTION),
      where('createdAt', '<', Timestamp.fromDate(twentyFourHoursAgo))
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },
};

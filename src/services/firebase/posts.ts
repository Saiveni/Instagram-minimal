import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types';

const POSTS_COLLECTION = 'posts';

export const postsService = {
  // Create a new post
  async createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get all posts
  async getPosts(): Promise<Post[]> {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Post[];
  },

  // Get posts by user
  async getPostsByUser(userId: string): Promise<Post[]> {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Post[];
  },

  // Subscribe to posts in real-time
  subscribeToPost(callback: (posts: Post[]) => void) {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Post[];
      callback(posts);
    });
  },

  // Update post
  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, updates);
  },

  // Delete post
  async deletePost(postId: string): Promise<void> {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
  },

  // Like/Unlike post
  async likePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const post = (await getDocs(query(collection(db, POSTS_COLLECTION), where('__name__', '==', postId)))).docs[0];
    const likes = post.data().likes || [];
    
    if (likes.includes(userId)) {
      await updateDoc(postRef, {
        likes: likes.filter((id: string) => id !== userId),
        likesCount: Math.max(0, (post.data().likesCount || 0) - 1),
      });
    } else {
      await updateDoc(postRef, {
        likes: [...likes, userId],
        likesCount: (post.data().likesCount || 0) + 1,
      });
    }
  },
};

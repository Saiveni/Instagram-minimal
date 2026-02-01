import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

const USERS_COLLECTION = 'users';

export const usersService = {
  // Create or update user profile
  async setUserProfile(userId: string, userData: Omit<UserProfile, 'uid'>): Promise<void> {
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...userData,
      createdAt: userData.createdAt || Timestamp.now(),
    }, { merge: true });
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (docSnap.exists()) {
      return {
        uid: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  },

  // Get all users
  async getAllUsers(): Promise<UserProfile[]> {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as UserProfile[];
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, updates);
  },

  // Follow/Unfollow user
  async followUser(currentUserId: string, targetUserId: string): Promise<void> {
    const currentUserRef = doc(db, USERS_COLLECTION, currentUserId);
    const targetUserRef = doc(db, USERS_COLLECTION, targetUserId);

    const currentUserDoc = await getDoc(currentUserRef);
    const targetUserDoc = await getDoc(targetUserRef);

    const currentFollowing = currentUserDoc.data()?.following || [];
    const targetFollowers = targetUserDoc.data()?.followers || [];

    if (!currentFollowing.includes(targetUserId)) {
      await updateDoc(currentUserRef, {
        following: [...currentFollowing, targetUserId],
      });
      await updateDoc(targetUserRef, {
        followers: [...targetFollowers, currentUserId],
      });
    }
  },

  async unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    const currentUserRef = doc(db, USERS_COLLECTION, currentUserId);
    const targetUserRef = doc(db, USERS_COLLECTION, targetUserId);

    const currentUserDoc = await getDoc(currentUserRef);
    const targetUserDoc = await getDoc(targetUserRef);

    const currentFollowing = currentUserDoc.data()?.following || [];
    const targetFollowers = targetUserDoc.data()?.followers || [];

    await updateDoc(currentUserRef, {
      following: currentFollowing.filter((id: string) => id !== targetUserId),
    });
    await updateDoc(targetUserRef, {
      followers: targetFollowers.filter((id: string) => id !== currentUserId),
    });
  },
};

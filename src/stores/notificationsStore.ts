import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  userId: string; // Who triggered the notification
  targetUserId: string; // Who receives the notification
  postId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  deleteNotification: (notificationId: string) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) =>
        set((state) => {
          // Avoid duplicate notifications (e.g., same user liking same post multiple times)
          const exists = state.notifications.some(
            n => n.type === notification.type &&
                 n.userId === notification.userId &&
                 n.targetUserId === notification.targetUserId &&
                 n.postId === notification.postId
          );

          if (exists) return state;

          const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            read: false,
            createdAt: new Date(),
          };

          return {
            notifications: [newNotification, ...state.notifications],
          };
        }),

      markAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.targetUserId === userId ? { ...n, read: true } : n
          ),
        })),

      getUserNotifications: (userId) => {
        const state = get();
        return state.notifications
          .filter(n => n.targetUserId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUnreadCount: (userId) => {
        const state = get();
        return state.notifications.filter(n => n.targetUserId === userId && !n.read).length;
      },

      deleteNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== notificationId),
        })),
    }),
    {
      name: 'notifications-storage',
    }
  )
);

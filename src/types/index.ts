export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  author?: UserProfile;
  media: MediaItem[];
  caption: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  likedBy?: string[];
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

export interface Reel {
  id: string;
  authorId: string;
  author?: UserProfile;
  videoUrl: string;
  caption: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: UserProfile;
  text: string;
  createdAt: Date;
  likesCount: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantProfiles?: UserProfile[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  createdAt: Date;
  readBy: string[];
}

import { ProfileView } from '@/components/profile/ProfileView';
import { useAuthStore } from '@/stores/authStore';
import { usePostsStore } from '@/stores/postsStore';
import { useUsersStore } from '@/stores/usersStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { updateProfile, signOut as firebaseSignOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect } from 'react';

const ProfilePage = () => {
  const { user, loading, setUser, setSession } = useAuthStore();
  const { posts, getSavedPosts } = usePostsStore();
  const { updateUser, getUser, getFollowersCount, getFollowingCount } = useUsersStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter posts by current user
  const userPosts = useMemo(() => 
    posts.filter(post => post.authorId === user?.uid),
    [posts, user?.uid]
  );

  // Get saved posts for current user
  const savedPosts = useMemo(() => 
    user ? getSavedPosts(user.uid) : [],
    [user, getSavedPosts]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  
  // Get the user from the store to get the latest avatar
  const storedUser = getUser(user.uid);
  
  const mockProfile = {
    uid: user.uid,
    username: user.email?.split('@')[0] || 'user',
    displayName: storedUser?.displayName || displayName,
    avatarUrl: storedUser?.avatarUrl || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
    bio: storedUser?.bio || 'Welcome to my profile!',
    stats: { 
      posts: userPosts.length, 
      followers: getFollowersCount(user.uid), 
      following: getFollowingCount(user.uid) 
    },
    createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
  };

  const handleEditProfile = async (data: Partial<typeof mockProfile>) => {
    try {
      if (!user) return;
      
      // Update Firebase user profile
      await updateProfile(user, {
        displayName: data.displayName || mockProfile.displayName,
        photoURL: data.avatarUrl || mockProfile.avatarUrl,
      });
      
      // Update users store
      updateUser(user.uid, {
        displayName: data.displayName || mockProfile.displayName,
        bio: data.bio || mockProfile.bio,
        avatarUrl: data.avatarUrl || mockProfile.avatarUrl,
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      
      // Clear auth state
      setUser(null);
      setSession(null);
      
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProfileView
      profile={mockProfile}
      posts={userPosts}
      savedPosts={savedPosts}
      reels={[]}
      isOwnProfile={true}
      isFollowing={false}
      onFollow={() => {}}
      onEditProfile={handleEditProfile}
      onSignOut={handleSignOut}
    />
  );
};

export default ProfilePage;

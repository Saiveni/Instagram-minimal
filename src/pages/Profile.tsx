import { ProfileView } from '@/components/profile/ProfileView';
import { useAuthStore } from '@/stores/authStore';
import { usePostsStore } from '@/stores/postsStore';
import { useUsersStore } from '@/stores/usersStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect } from 'react';

const ProfilePage = () => {
  const { user, loading, setUser, setSession } = useAuthStore();
  const { posts } = usePostsStore();
  const { updateUser, getUser, getFollowersCount, getFollowingCount } = useUsersStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter posts by current user
  const userPosts = useMemo(() => 
    posts.filter(post => post.authorId === user?.id),
    [posts, user?.id]
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

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
  
  // Get the user from the store to get the latest avatar
  const storedUser = getUser(user.id);
  
  const mockProfile = {
    uid: user.id,
    username: user.email?.split('@')[0] || 'user',
    displayName: storedUser?.displayName || displayName,
    avatarUrl: storedUser?.avatarUrl || user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
    bio: storedUser?.bio || user.user_metadata?.bio || 'Welcome to my profile!',
    stats: { 
      posts: userPosts.length, 
      followers: getFollowersCount(user.id), 
      following: getFollowingCount(user.id) 
    },
    createdAt: new Date(user.created_at),
  };

  const handleEditProfile = async (data: Partial<typeof mockProfile>) => {
    try {
      // Update Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          bio: data.bio,
          avatar_url: data.avatarUrl,
        },
      });
      
      if (error) throw error;
      
      // Update users store
      updateUser(user.id, {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear auth state
      setUser(null);
      setSession(null);
      
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
      
      // Force navigation to auth page
      window.location.href = '/auth';
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

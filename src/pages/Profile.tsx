import { ProfileView } from '@/components/profile/ProfileView';
import { useAuthStore } from '@/stores/authStore';
import { usePostsStore } from '@/stores/postsStore';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';

const ProfilePage = () => {
  const { user, loading } = useAuthStore();
  const { posts } = usePostsStore();
  const { toast } = useToast();

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
  
  const mockProfile = {
    uid: user.id,
    username: user.email?.split('@')[0] || 'user',
    displayName: displayName,
    avatarUrl: user.user_metadata?.avatar_url || '',
    bio: 'Welcome to my profile!',
    stats: { posts: userPosts.length, followers: 0, following: 0 },
    createdAt: new Date(user.created_at),
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <ProfileView
        profile={mockProfile}
        posts={userPosts}
        reels={[]}
        isOwnProfile={true}
        isFollowing={false}
        onFollow={() => {}}
        onEditProfile={() => {}}
      />
      <div className="max-w-lg mx-auto px-4 pb-8">
        <button
          onClick={handleSignOut}
          className="w-full py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

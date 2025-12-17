import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePostsStore } from '@/stores/postsStore';
import { useUsersStore } from '@/stores/usersStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';

const SearchPage = () => {
  const { posts } = usePostsStore();
  const { users, isFollowing, followUser, unfollowUser } = useUsersStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter users based on search query
  const filteredUsers = users.filter(u => 
    u.uid !== user?.id && (
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleFollow = (targetUserId: string) => {
    if (!user) return;
    
    if (isFollowing(user.id, targetUserId)) {
      unfollowUser(user.id, targetUserId);
    } else {
      followUser(user.id, targetUserId);
    }
  };

  const handlePostClick = (postId: string) => {
    // Navigate to post detail or open modal
    console.log('Open post:', postId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Tabs defaultValue="explore" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="mt-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No posts found' : 'No posts available yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {filteredPosts.map((post, i) => {
                const isVideo = post.media[0]?.type === 'video';
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => handlePostClick(post.id)}
                    className="relative aspect-square bg-muted cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                  >
                    {isVideo ? (
                      <>
                        <video
                          src={post.media[0]?.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute top-2 right-2">
                          <Film className="h-5 w-5 text-white drop-shadow-lg" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={post.media[0]?.url}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((profile) => (
                <motion.div
                  key={profile.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{profile.username}</p>
                      <p className="text-sm text-muted-foreground">{profile.displayName}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowing(user?.id || '', profile.uid) ? 'secondary' : 'default'}
                    onClick={() => handleFollow(profile.uid)}
                  >
                    {isFollowing(user?.id || '', profile.uid) ? 'Following' : 'Follow'}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;

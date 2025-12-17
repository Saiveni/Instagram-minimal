import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Grid, Film, Bookmark, Camera, Loader2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { UserProfile, Post, Reel } from '@/types';
import { toast } from 'sonner';
import { PostDetailModal } from '@/components/feed/PostDetailModal';

interface ProfileViewProps {
  profile: UserProfile;
  posts: Post[];
  reels: Reel[];
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onEditProfile: (data: Partial<UserProfile>) => void;
  onSignOut?: () => void;
}

export const ProfileView = ({
  profile,
  posts,
  reels,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEditProfile,
  onSignOut,
}: ProfileViewProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editData, setEditData] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postDetailOpen, setPostDetailOpen] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const { url } = await uploadToCloudinary(file);
      setEditData((prev) => ({ ...prev, avatarUrl: url }));
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = () => {
    onEditProfile(editData);
    setEditOpen(false);
    toast.success('Profile updated');
  };

  const handleSignOut = () => {
    setSettingsOpen(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setPostDetailOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8"
      >
        <Avatar className="h-32 w-32 md:h-36 md:w-36 ring-4 ring-primary/20">
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback className="text-4xl">{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 className="text-xl font-semibold">{profile.username}</h1>
            {isOwnProfile ? (
              <div className="flex items-center gap-2">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">Edit profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={editData.avatarUrl} />
                            <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground"
                            disabled={uploadingAvatar}
                          >
                            {uploadingAvatar ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Camera className="h-4 w-4" />
                            )}
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Name</Label>
                        <Input
                          id="displayName"
                          value={editData.displayName}
                          onChange={(e) => setEditData((prev) => ({ ...prev, displayName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editData.bio}
                          onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                          maxLength={150}
                        />
                        <span className="text-xs text-muted-foreground">{editData.bio.length}/150</span>
                      </div>
                      <Button onClick={handleSaveProfile} className="w-full">Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive font-semibold"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Button
                variant={isFollowing ? 'secondary' : 'default'}
                size="sm"
                onClick={onFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center md:text-left">
              <span className="font-semibold">{profile.stats.posts}</span>{' '}
              <span className="text-muted-foreground">posts</span>
            </div>
            <button className="text-center md:text-left hover:opacity-70">
              <span className="font-semibold">{profile.stats.followers.toLocaleString()}</span>{' '}
              <span className="text-muted-foreground">followers</span>
            </button>
            <button className="text-center md:text-left hover:opacity-70">
              <span className="font-semibold">{profile.stats.following.toLocaleString()}</span>{' '}
              <span className="text-muted-foreground">following</span>
            </button>
          </div>

          <p className="font-semibold">{profile.displayName}</p>
          {profile.bio && <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>}
        </div>
      </motion.div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-center border-t border-border rounded-none bg-transparent h-auto py-0">
          <TabsTrigger
            value="posts"
            className="flex-1 max-w-[120px] rounded-none border-t-2 border-transparent data-[state=active]:border-foreground py-4"
          >
            <Grid className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="reels"
            className="flex-1 max-w-[120px] rounded-none border-t-2 border-transparent data-[state=active]:border-foreground py-4"
          >
            <Film className="h-4 w-4 mr-2" />
            Reels
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger
              value="saved"
              className="flex-1 max-w-[120px] rounded-none border-t-2 border-transparent data-[state=active]:border-foreground py-4"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground">When you share photos, they'll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePostClick(post)}
                  className="aspect-square bg-muted cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                >
                  {post.media[0]?.type === 'video' ? (
                    <video
                      src={post.media[0]?.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={post.media[0]?.url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reels" className="mt-4">
          {reels.length === 0 ? (
            <div className="text-center py-12">
              <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reels Yet</h3>
              <p className="text-muted-foreground">When you share reels, they'll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {reels.map((reel, index) => (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-[9/16] bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <video
                    src={reel.videoUrl}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="saved" className="mt-4">
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Saved Posts</h3>
              <p className="text-muted-foreground">Save photos and videos that you want to see again.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <PostDetailModal
        open={postDetailOpen}
        onOpenChange={setPostDetailOpen}
        post={selectedPost}
      />
    </div>
  );
};

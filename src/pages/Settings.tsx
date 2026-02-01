import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Lock, Bell, Eye, Heart, Shield, HelpCircle, Info,
  ChevronRight, Moon, Sun, Globe, Download, Trash2, LogOut,
  Languages, Smartphone, Zap, Archive, Clock, UserX, Ban,
  MessageSquare, Video, Image, Tag, MapPin, Link2, Share2,
  BookMarked, CheckCircle, AlertCircle, Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser, setSession } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [messageRequests, setMessageRequests] = useState(true);
  const [saveOriginalPhotos, setSaveOriginalPhotos] = useState(false);
  const [storiesSharing, setStoriesSharing] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [allowTags, setAllowTags] = useState(true);
  const [showInExplore, setShowInExplore] = useState(true);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
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

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', onClick: () => navigate('/profile') },
        { icon: Lock, label: 'Change Password', onClick: () => toast({ title: 'Coming Soon', description: 'Password change feature coming soon!' }) },
        {
          icon: Shield,
          label: 'Private Account',
          toggle: true,
          value: privateAccount,
          onChange: setPrivateAccount,
        },
        { icon: Archive, label: 'Archive', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Clock, label: 'Your Activity', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: BookMarked, label: 'Saved', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: CheckCircle, label: 'Close Friends', onClick: () => toast({ title: 'Coming Soon' }) },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          toggle: true,
          value: pushNotifications,
          onChange: setPushNotifications,
        },
        {
          icon: Bell,
          label: 'Email Notifications',
          toggle: true,
          value: emailNotifications,
          onChange: setEmailNotifications,
        },
        { icon: Heart, label: 'Likes', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: MessageSquare, label: 'Comments', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: User, label: 'Follows', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Video, label: 'Live Videos', onClick: () => toast({ title: 'Coming Soon' }) },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Eye,
          label: 'Activity Status',
          toggle: true,
          value: activityStatus,
          onChange: setActivityStatus,
        },
        {
          icon: Eye,
          label: 'Message Requests',
          toggle: true,
          value: messageRequests,
          onChange: setMessageRequests,
        },
        {
          icon: MessageSquare,
          label: 'Allow Comments',
          toggle: true,
          value: allowComments,
          onChange: setAllowComments,
        },
        {
          icon: Tag,
          label: 'Allow Mentions',
          toggle: true,
          value: allowMentions,
          onChange: setAllowMentions,
        },
        {
          icon: Tag,
          label: 'Allow Tags',
          toggle: true,
          value: allowTags,
          onChange: setAllowTags,
        },
        { icon: UserX, label: 'Blocked Accounts', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Ban, label: 'Restricted Accounts', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Download, label: 'Download Your Data', onClick: () => toast({ title: 'Coming Soon', description: 'Your data download will be ready soon' }) },
      ],
    },
    {
      title: 'Content & Display',
      items: [
        {
          icon: Share2,
          label: 'Story Sharing',
          toggle: true,
          value: storiesSharing,
          onChange: setStoriesSharing,
        },
        {
          icon: Globe,
          label: 'Show in Explore',
          toggle: true,
          value: showInExplore,
          onChange: setShowInExplore,
        },
        {
          icon: Download,
          label: 'Save Original Photos',
          toggle: true,
          value: saveOriginalPhotos,
          onChange: setSaveOriginalPhotos,
        },
        { icon: Image, label: 'Photo Quality', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Video, label: 'Video Quality', onClick: () => toast({ title: 'Coming Soon' }) },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: theme === 'dark' ? Sun : Moon,
          label: 'Dark Mode',
          toggle: true,
          value: theme === 'dark',
          onChange: toggleTheme,
        },
        { icon: Languages, label: 'Language', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Globe, label: 'Website Permissions', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Link2, label: 'Linked Accounts', onClick: () => toast({ title: 'Coming Soon' }) },
      ],
    },
    {
      title: 'Help & Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: AlertCircle, label: 'Report a Problem', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Info, label: 'Privacy Policy', onClick: () => toast({ title: 'Coming Soon' }) },
        { icon: Info, label: 'Terms of Service', onClick: () => toast({ title: 'Coming Soon' }) },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'About Instagram', onClick: () => toast({ title: 'Instagram Minimal', description: 'Version 1.0.0' }) },
        { icon: Smartphone, label: 'App Version', onClick: () => toast({ title: 'App Version', description: '1.0.0' }) },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        { icon: Trash2, label: 'Delete Account', onClick: () => toast({ title: 'Coming Soon', description: 'Account deletion feature coming soon', variant: 'destructive' }), danger: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="space-y-6">
            {settingsSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                  {section.title}
                </h2>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.label}>
                      {itemIndex > 0 && <Separator className="my-2" />}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          item.toggle ? '' : 'hover:bg-muted cursor-pointer'
                        } ${item.danger ? 'hover:bg-destructive/10' : ''}`}
                        onClick={!item.toggle ? item.onClick : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.danger ? 'bg-destructive/10' : 'bg-primary/10'
                          }`}>
                            <item.icon className={`h-4 w-4 ${
                              item.danger ? 'text-destructive' : 'text-primary'
                            }`} />
                          </div>
                          <span className={`font-medium ${
                            item.danger ? 'text-destructive' : 'text-foreground'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                        {item.toggle ? (
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onChange}
                          />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;

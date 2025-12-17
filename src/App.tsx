import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useUsersStore } from "@/stores/usersStore";
import HomePage from "./pages/Home";
import ReelsPage from "./pages/Reels";
import MessagesPage from "./pages/Messages";
import SearchPage from "./pages/Search";
import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { setSession, setLoading, user, loading } = useAuthStore();
  const { addUser, getUser, updateUser } = useUsersStore();

  // Add user to users store when they log in
  useEffect(() => {
    if (user) {
      const username = user.email?.split('@')[0] || 'user';
      const displayName = user.user_metadata?.display_name || username;
      const avatar = user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
      
      // Check if user exists in store
      const existingUser = getUser(user.id);
      
      if (existingUser) {
        // Update existing user with latest Supabase metadata (but keep stored avatar if it exists and is different)
        updateUser(user.id, {
          displayName: user.user_metadata?.display_name || existingUser.displayName,
          bio: user.user_metadata?.bio || existingUser.bio,
          // Keep the stored avatarUrl unless it's the default dicebear, then use Supabase if available
          avatarUrl: existingUser.avatarUrl && !existingUser.avatarUrl.includes('dicebear') 
            ? existingUser.avatarUrl 
            : user.user_metadata?.avatar_url || existingUser.avatarUrl,
        });
      } else {
        // Add new user
        addUser({
          uid: user.id,
          username: username,
          displayName: displayName,
          avatarUrl: avatar,
          bio: user.user_metadata?.bio || 'Welcome to my profile!',
          stats: { posts: 0, followers: 0, following: 0 },
          createdAt: new Date(user.created_at),
        });
      }
    }
  }, [user, addUser, getUser, updateUser]);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession, setLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

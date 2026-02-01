import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from "@/stores/authStore";
import { useUsersStore } from "@/stores/usersStore";
import HomePage from "./pages/Home";
import ReelsPage from "./pages/Reels";
import MessagesPage from "./pages/Messages";
import SearchPage from "./pages/Search";
import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/Settings";
import NotificationsPage from "./pages/Notifications";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const AppContent = () => {
  const { setSession, setLoading, user, loading } = useAuthStore();
  const { addUser, getUser, updateUser } = useUsersStore();

  // Add user to users store when they log in
  useEffect(() => {
    if (user) {
      const username = user.email?.split('@')[0] || 'user';
      const displayName = user.displayName || username;
      const avatar = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
      
      // Check if user exists in store
      const existingUser = getUser(user.uid);
      
      if (existingUser) {
        // Update existing user with latest Firebase metadata (but keep stored avatar if it exists and is different)
        updateUser(user.uid, {
          displayName: user.displayName || existingUser.displayName,
          // Keep the stored avatarUrl unless it's the default dicebear, then use Firebase if available
          avatarUrl: existingUser.avatarUrl && !existingUser.avatarUrl.includes('dicebear') 
            ? existingUser.avatarUrl 
            : user.photoURL || existingUser.avatarUrl,
        });
      } else {
        // Add new user
        addUser({
          uid: user.uid,
          username: username,
          displayName: displayName,
          avatarUrl: avatar,
          bio: 'Welcome to my profile!',
          stats: { posts: 0, followers: 0, following: 0 },
          createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
        });
      }
    }
  }, [user, addUser, getUser, updateUser]);

  useEffect(() => {
    // Listen for Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setSession(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
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
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;

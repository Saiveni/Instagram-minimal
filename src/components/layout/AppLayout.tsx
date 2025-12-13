import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CreatePostModal } from '@/components/feed/CreatePostModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileNav />
      <CreatePostModal />
    </div>
  );
};

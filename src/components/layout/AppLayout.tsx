import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { DesktopFooter } from './DesktopFooter';
import { CreatePostModal } from '@/components/feed/CreatePostModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 pb-16">
        <Outlet />
      </main>
      <MobileNav />
      <DesktopFooter />
      <CreatePostModal />
    </div>
  );
};

/**
 * Global Layout Component
 * Single layout wrapper applied to ALL pages
 * Contains: Top navbar, Collapsible sidebar, Main content area, Footer
 */

import React, { ReactNode, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { Footer } from './Footer';
import { useGlobalStore } from '@/lib/stores/globalStore';
import { cn } from '@/lib/utils';

interface GlobalLayoutProps {
  children: ReactNode;
}

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { ui } = useGlobalStore();
  const location = useLocation();

  // Pages that should not have the standard layout (e.g., auth pages)
  const noLayoutRoutes = ['/login', '/signup', '/auth'];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  if (isNoLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300',
            ui.sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="p-6 lg:p-8">
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default GlobalLayout;

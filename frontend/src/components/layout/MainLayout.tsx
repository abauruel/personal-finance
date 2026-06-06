import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
            <Sidebar mobile onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

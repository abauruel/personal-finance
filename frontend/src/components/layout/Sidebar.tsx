import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ArrowUpDown,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Tag,
  Settings,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onNavigate }) => {
  const { clearAuth } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  const handleLogout = () => {
    clearAuth();
    window.location.href = ROUTES.LOGIN;
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: Home },
    { name: 'Payments', path: ROUTES.TRANSACTIONS, icon: ArrowUpDown },
    { name: 'Analytics', path: ROUTES.REPORTS, icon: TrendingUp },
    { name: 'Cards', path: ROUTES.ACCOUNTS, icon: CreditCard },
    { name: 'Categories', path: ROUTES.CATEGORIES, icon: Tag },
    { name: 'Services', path: ROUTES.RECURRING, icon: RefreshCw },
  ];

  return (
    <aside className={cn(mobile ? 'flex h-full shrink-0' : 'hidden lg:flex lg:shrink-0')}>
      <div className={cn('flex flex-col bg-white border-r border-gray-100', mobile ? 'w-72' : 'w-20')}>
        {/* Logo */}
        <div className={cn('py-8', mobile ? 'px-6 flex items-center justify-start gap-3' : 'flex items-center justify-center')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {mobile && <span className="text-lg font-semibold text-gray-900">Personal Finance</span>}
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav
            className={cn(
              'flex-1 mt-4',
              mobile ? 'flex flex-col px-4 space-y-2' : 'flex flex-col items-center space-y-4',
            )}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  title={item.name}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl transition-all duration-200',
                      mobile ? 'h-12 px-4 flex items-center gap-3' : 'w-12 h-12 flex items-center justify-center',
                      isActive
                        ? mobile
                          ? 'bg-primary/10 text-primary'
                          : 'bg-linear-to-br from-primary to-primary-dark text-gray-500 shadow-lg'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                    )
                  }
                >
                  {({ isActive }) => {
                    const iconColor = isActive
                      ? mobile
                        ? undefined
                        : '#2f3035'
                      : undefined;

                    return (
                      <>
                        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} style={{ color: iconColor }} />
                        {mobile && <span className="text-sm font-medium text-gray-800">{item.name}</span>}
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className={cn('mt-auto pb-6', mobile ? 'flex flex-col space-y-2 px-4' : 'flex flex-col items-center space-y-4')}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              className={cn(
                'rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200',
                mobile ? 'h-12 px-4 flex items-center gap-3 justify-start' : 'w-12 h-12 flex items-center justify-center',
              )}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {mobile && <span className="text-sm font-medium text-gray-800">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>

            {/* Settings */}
            <button
              title="Settings"
              className={cn(
                'rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200',
                mobile ? 'h-12 px-4 flex items-center gap-3 justify-start' : 'w-12 h-12 flex items-center justify-center',
              )}
            >
              <Settings className="h-5 w-5" />
              {mobile && <span className="text-sm font-medium text-gray-800">Settings</span>}
            </button>

            {/* User Profile with Logout */}
            <div className={cn('relative group', mobile ? 'mt-2' : '')}>
              <button
                onClick={handleLogout}
                title="Logout"
                className={cn(
                  'bg-linear-to-br from-primary to-primary-dark text-white hover:opacity-90 transition-opacity',
                  mobile
                    ? 'w-full h-12 rounded-xl px-4 flex items-center justify-start gap-3'
                    : 'w-12 h-12 rounded-full flex items-center justify-center',
                )}
              >
                <User className="w-5 h-5" />
                {mobile && <span className="text-sm font-semibold">Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ArrowUpDown,
  TrendingUp,
  CreditCard,
  Clock,
  RefreshCw,
  LifeBuoy,
  Settings,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const { clearAuth } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = ROUTES.LOGIN;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual dark mode logic
  };

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: Home },
    { name: 'Payments', path: ROUTES.TRANSACTIONS, icon: ArrowUpDown },
    { name: 'Analytics', path: ROUTES.REPORTS, icon: TrendingUp },
    { name: 'Cards', path: ROUTES.ACCOUNTS, icon: CreditCard },
    { name: 'History', path: '/history', icon: Clock },
    { name: 'Services', path: ROUTES.RECURRING, icon: RefreshCw },
    { name: 'Help', path: '/help', icon: LifeBuoy },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-20 bg-white border-r border-gray-100">
        {/* Logo */}
        <div className="flex items-center justify-center py-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 flex flex-col items-center space-y-4 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={({ isActive }) =>
                    cn(
                      'w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-br from-primary to-primary-dark text-gray-500 shadow-lg'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                    )
                  }
                >
                  {({ isActive }) => (
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{ color: isActive ? '#2f3035' : undefined }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="flex flex-col items-center space-y-4 mt-auto pb-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Settings */}
            <button
              title="Settings"
              className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile with Logout */}
            <div className="relative group">
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

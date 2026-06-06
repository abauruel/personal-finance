import React, { useState } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../lib/constants';
import { getInitials } from '../../lib/utils';
import { SettingsModal } from '../ui/SettingsModal';
import { useSettings } from '../../contexts/SettingsContext';
import { getNavbarMessages } from '../../lib/featureLocale';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { user, clearAuth } = useAuthStore();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = ROUTES.LOGIN;
  };

  const firstName = user?.name.split(' ')[0] || 'User';
  const messages = getNavbarMessages(settings.locale);

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Greeting Section */}
        <div className="shrink-0 w-full lg:w-auto">
          <div className="flex items-start justify-between lg:block">
            <h1 className="text-2xl font-bold text-gray-900">
              {messages.greeting(firstName)}
            </h1>
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
              title="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{messages.subtitle}</p>
        </div>

        {/* Search and User Section */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={messages.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '3rem', paddingRight: '5rem' }}
              className="w-full lg:w-96 h-11 text-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white placeholder:text-gray-400 transition-all"
            />
            <span className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">⌘F</span>
          </div>

          {/* Notifications */}
          <button className="relative w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          {user && (
            <div className="relative group shrink-0">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                {getInitials(user.name)}
              </div>
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
};

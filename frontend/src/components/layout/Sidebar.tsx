import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../lib/constants';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    { name: 'Transações', path: ROUTES.TRANSACTIONS, icon: '💸' },
    { name: 'Contas', path: ROUTES.ACCOUNTS, icon: '🏦' },
    { name: 'Categorias', path: ROUTES.CATEGORIES, icon: '🏷️' },
    { name: 'Recorrentes', path: ROUTES.RECURRING, icon: '🔄' },
    { name: 'Relatórios', path: ROUTES.REPORTS, icon: '📈' },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { ROUTES } from '../lib/constants';
import { MainLayout } from '../components/layout';

// Feature pages - will be implemented
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import TransactionsPage from '../features/transactions/pages/TransactionsPage';
import AccountsPage from '../features/accounts/pages/AccountsPage';
import CategoriesPage from '../features/categories/pages/CategoriesPage';
import RecurringPage from '../features/recurring/pages/RecurringPage';
import ReportsPage from '../features/reports/pages/ReportsPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.TRANSACTIONS}
          element={
            <PrivateRoute>
              <MainLayout>
                <TransactionsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.ACCOUNTS}
          element={
            <PrivateRoute>
              <MainLayout>
                <AccountsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.CATEGORIES}
          element={
            <PrivateRoute>
              <MainLayout>
                <CategoriesPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.RECURRING}
          element={
            <PrivateRoute>
              <MainLayout>
                <RecurringPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <PrivateRoute>
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* 404 - Not found */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

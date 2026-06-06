import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { useFormatters } from '../../../hooks/useFormatters';
import { useSettings } from '../../../contexts/SettingsContext';
import { getDashboardMessages } from '../lib/dashboardLocale';

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: {
    name: string;
    icon: string;
  };
  account: {
    name: string;
  };
  status?: 'success' | 'pending' | 'failed';
}

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  onFilter?: () => void;
}

type SortField = 'date' | 'description' | 'amount' | 'category' | 'account' | 'status';
type SortDirection = 'asc' | 'desc';

export function RecentTransactionsTable({ transactions, onFilter }: RecentTransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { settings } = useSettings();
  const { formatCurrency } = useFormatters();
  const messages = getDashboardMessages(settings.locale);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(settings.locale, {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.name.toLowerCase().includes(query) ||
          t.account.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description, settings.locale);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.name.localeCompare(b.category.name, settings.locale);
          break;
        case 'account':
          comparison = a.account.name.localeCompare(b.account.name, settings.locale);
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '', settings.locale);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [transactions, searchQuery, sortField, sortDirection, settings.locale]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {messages.statuses.success}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {messages.statuses.pending}
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {messages.statuses.failed}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {messages.statuses.success}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{messages.recentTransactions}</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full sm:flex-1 xl:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={messages.searchTransactions}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:min-w-55 xl:min-w-65 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          {/* Filter Button */}
          <button
            onClick={onFilter}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{messages.filter}</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('description')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  {messages.transaction}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  {messages.date}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  {messages.amount}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  {messages.category}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('account')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  {messages.account}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  {messages.status}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  {messages.noTransactionsFound}
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                        {transaction.category.icon}
                      </div>
                      <span className="font-medium text-gray-900">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatDate(transaction.date)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}
                    >
                      {transaction.amount >= 0 ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm text-gray-700">{transaction.category.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary-light/20 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{transaction.account.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(transaction.status || 'success')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{messages.noTransactionsFound}</div>
        ) : (
          paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
                    {transaction.category.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <span
                  className={`font-semibold ml-2 ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}
                >
                  {transaction.amount >= 0 ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{messages.categoryLabel}</span>
                  <span className="text-gray-700">{transaction.category.name}</span>
                </div>
                {getStatusBadge(transaction.status || 'success')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            {messages.showingResults(
              startIndex + 1,
              Math.min(endIndex, filteredAndSortedTransactions.length),
              filteredAndSortedTransactions.length
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {messages.previous}
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {messages.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../../accounts/api/accountsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import { Button } from '../../../components/ui/Button';
import { useSettings } from '../../../contexts/SettingsContext';
import { getPaymentTypeLabel, getTransactionMessages, getTransactionStatusLabel } from '../../../lib/featureLocale';

interface TransactionFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  status?: string;
  paymentType?: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClear,
}: TransactionFiltersProps) {
  const { settings } = useSettings();
  const messages = getTransactionMessages(settings.locale);
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const handleChange = (key: keyof TransactionFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  const statusOptions = [
    { value: '', label: messages.filtersPanel.all },
    { value: 'PENDING', label: getTransactionStatusLabel('PENDING', settings.locale) },
    { value: 'PAID', label: getTransactionStatusLabel('PAID', settings.locale) },
    { value: 'CANCELLED', label: getTransactionStatusLabel('CANCELLED', settings.locale) },
  ];

  const paymentTypeOptions = [
    { value: '', label: messages.filtersPanel.all },
    { value: 'DEBIT', label: getPaymentTypeLabel('DEBIT', settings.locale) },
    { value: 'CREDIT', label: getPaymentTypeLabel('CREDIT', settings.locale) },
    { value: 'PIX', label: getPaymentTypeLabel('PIX', settings.locale) },
    { value: 'CASH', label: getPaymentTypeLabel('CASH', settings.locale) },
    { value: 'TRANSFER', label: getPaymentTypeLabel('TRANSFER', settings.locale) },
  ];

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder={messages.filtersPanel.searchPlaceholder}
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {messages.filtersPanel.startDate}
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {messages.filtersPanel.endDate}
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {messages.filtersPanel.category}
          </label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">{messages.filtersPanel.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {messages.filtersPanel.account}
          </label>
          <select
            value={filters.accountId || ''}
            onChange={(e) => handleChange('accountId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">{messages.filtersPanel.allAccounts}</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {messages.filtersPanel.paymentType}
          </label>
          <select
            value={filters.paymentType || ''}
            onChange={(e) => handleChange('paymentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            {paymentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {messages.filtersPanel.status}
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {activeFiltersCount > 0 ? (
            <span className="font-medium">
              {messages.filtersPanel.activeFilters(activeFiltersCount)}
            </span>
          ) : (
            <span>{messages.filtersPanel.noActiveFilters}</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="secondary"
            onClick={onClear}
            className="flex items-center gap-2"
          >
            <X size={16} />
            {messages.filtersPanel.clearFilters}
          </Button>
        )}
      </div>
    </div>
  );
}

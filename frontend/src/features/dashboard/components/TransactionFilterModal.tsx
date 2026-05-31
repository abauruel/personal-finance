import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar } from 'lucide-react';

export interface FilterOptions {
  dateRange: {
    from: string;
    to: string;
  };
  categories: string[];
  accounts: string[];
  amountRange: {
    min: number;
    max: number;
  };
  status: string[];
}

interface TransactionFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

const MOCK_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Travel',
  'Other'
];

const MOCK_ACCOUNTS = [
  'Checking Account',
  'Savings Account',
  'Credit Card',
  'Investment Account'
];

const STATUS_OPTIONS = ['success', 'pending', 'failed'];

export function TransactionFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters
}: TransactionFilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { from: '', to: '' },
    categories: [],
    accounts: [],
    amountRange: { min: 0, max: 10000 },
    status: [],
    ...initialFilters
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: { from: '', to: '' },
      categories: [],
      accounts: [],
      amountRange: { min: 0, max: 10000 },
      status: []
    });
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleAccount = (account: string) => {
    setFilters(prev => ({
      ...prev,
      accounts: prev.accounts.includes(account)
        ? prev.accounts.filter(a => a !== account)
        : [...prev.accounts, account]
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Advanced Filters
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Filters Content */}
                <div className="space-y-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={filters.dateRange.from}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, from: e.target.value }
                          }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={filters.dateRange.to}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, to: e.target.value }
                          }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.categories.includes(category)
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accounts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accounts
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_ACCOUNTS.map((account) => (
                        <button
                          key={account}
                          onClick={() => toggleAccount(account)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.accounts.includes(account)
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {account}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min</label>
                        <input
                          type="number"
                          value={filters.amountRange.min}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            amountRange: { ...prev.amountRange, min: Number(e.target.value) }
                          }))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Max</label>
                        <input
                          type="number"
                          value={filters.amountRange.max}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            amountRange: { ...prev.amountRange, max: Number(e.target.value) }
                          }))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="10000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => toggleStatus(status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filters.status.includes(status)
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

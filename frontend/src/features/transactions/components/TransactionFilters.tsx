import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../../accounts/api/accountsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import { Button } from '../../../components/ui/Button';

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

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'PAID', label: 'Pago' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'DEBIT', label: 'Débito' },
  { value: 'CREDIT', label: 'Crédito' },
  { value: 'PIX', label: 'PIX' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'TRANSFER', label: 'Transferência' },
];

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClear,
}: TransactionFiltersProps) {
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
          placeholder="Buscar por descrição..."
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
            Data Início
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
            Data Fim
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
            Categoria
          </label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">Todas</option>
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
            Conta
          </label>
          <select
            value={filters.accountId || ''}
            onChange={(e) => handleChange('accountId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">Todas</option>
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
            Tipo de Pagamento
          </label>
          <select
            value={filters.paymentType || ''}
            onChange={(e) => handleChange('paymentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            {PAYMENT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            {STATUS_OPTIONS.map((option) => (
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
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span>Nenhum filtro ativo</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="secondary"
            onClick={onClear}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}

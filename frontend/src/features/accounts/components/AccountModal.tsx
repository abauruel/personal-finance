import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Account } from '../../../types/models.types';

const accountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD']),
  initialBalance: z.number().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => Promise<void>;
  account?: Account;
  isLoading?: boolean;
}

const ACCOUNT_TYPES = [
  { value: 'CHECKING', label: 'Conta Corrente', icon: '💳' },
  { value: 'SAVINGS', label: 'Poupança', icon: '🏦' },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: '💳' },
];

export function AccountModal({
  isOpen,
  onClose,
  onSubmit,
  account,
  isLoading,
}: AccountModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || '',
      type: account?.type || 'CHECKING',
      initialBalance: account?.initialBalance || 0,
    },
  });

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        type: account.type,
        initialBalance: account.initialBalance,
      });
    } else {
      reset({
        name: '',
        type: 'CHECKING',
        initialBalance: 0,
      });
    }
  }, [account, reset]);

  const handleFormSubmit = async (data: AccountFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handled by parent
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {account ? 'Editar Conta' : 'Nova Conta'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome da Conta *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ex: Banco do Brasil"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tipo de Conta *
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Saldo Inicial
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                {...register('initialBalance', { valueAsNumber: true })}
                placeholder="0,00"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
            {errors.initialBalance && (
              <p className="text-red-500 text-sm mt-1">
                {errors.initialBalance.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1.5">
              {account
                ? 'Este valor não afetará o saldo atual'
                : 'O saldo inicial será o saldo atual da conta'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Salvando...' : account ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type {
  RecurringTransaction,
  PaymentType,
  RecurringFrequency,
} from '../../../types/models.types';
import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../../accounts/api/accountsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';

const recurringSchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
  paymentType: z.enum(['DEBIT', 'CREDIT', 'PIX', 'CASH', 'TRANSFER']).optional(),
  dayOfMonth: z.number().min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().optional(),
  active: z.boolean(),
});

type RecurringFormData = z.infer<typeof recurringSchema>;

interface RecurringModalProps {
  isOpen: boolean;
  recurring?: RecurringTransaction;
  onClose: () => void;
  onSubmit: (data: RecurringFormData) => void;
  isLoading?: boolean;
}

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: 'DEBIT', label: 'Débito' },
  { value: 'CREDIT', label: 'Crédito' },
  { value: 'PIX', label: 'PIX' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'TRANSFER', label: 'Transferência' },
];

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
];

export function RecurringModal({
  isOpen,
  recurring,
  onClose,
  onSubmit,
  isLoading,
}: RecurringModalProps) {
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RecurringFormData>({
    resolver: zodResolver(recurringSchema),
    defaultValues: recurring
      ? {
        categoryId: recurring.categoryId,
        accountId: recurring.accountId,
        description: recurring.description,
        amount: recurring.amount,
        frequency: recurring.frequency,
        paymentType: recurring.paymentType,
        dayOfMonth: recurring.dayOfMonth,
        startDate: new Date(recurring.startDate).toISOString().split('T')[0],
        endDate: recurring.endDate ? new Date(recurring.endDate).toISOString().split('T')[0] : '',
        active: recurring.active,
      }
      : {
        frequency: 'MONTHLY',
        paymentType: 'DEBIT',
        dayOfMonth: 1,
        startDate: new Date().toISOString().split('T')[0],
        active: true,
      },
  });

  useEffect(() => {
    if (recurring) {
      reset({
        categoryId: recurring.categoryId,
        accountId: recurring.accountId,
        description: recurring.description,
        amount: recurring.amount,
        frequency: recurring.frequency,
        paymentType: recurring.paymentType,
        dayOfMonth: recurring.dayOfMonth,
        startDate: new Date(recurring.startDate).toISOString().split('T')[0],
        endDate: recurring.endDate ? new Date(recurring.endDate).toISOString().split('T')[0] : '',
        active: recurring.active,
      });
    }
  }, [recurring, reset]);

  const frequency = watch('frequency');

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h2" className="text-xl font-semibold text-gray-900">
                      {recurring ? 'Editar Recorrência' : 'Nova Recorrência'}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        {...register('categoryId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Selecione...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>
                      )}
                    </div>

                    {/* Account */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conta *
                      </label>
                      <select
                        {...register('accountId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Selecione...</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name}
                          </option>
                        ))}
                      </select>
                      {errors.accountId && (
                        <p className="text-sm text-red-500 mt-1">{errors.accountId.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <Input
                      {...register('description')}
                      placeholder="Ex: Netflix, Aluguel, Conta de Luz..."
                      error={errors.description?.message}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('amount', { valueAsNumber: true })}
                        error={errors.amount?.message}
                      />
                    </div>

                    {/* Payment Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Pagamento
                      </label>
                      <select
                        {...register('paymentType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {PAYMENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.paymentType && (
                        <p className="text-sm text-red-500 mt-1">{errors.paymentType.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequência *
                      </label>
                      <select
                        {...register('frequency')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {FREQUENCIES.map((freq) => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                      {errors.frequency && (
                        <p className="text-sm text-red-500 mt-1">{errors.frequency.message}</p>
                      )}
                    </div>

                    {/* Day of Month (only for MONTHLY) */}
                    {frequency === 'MONTHLY' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dia do Mês *
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="1-31"
                          {...register('dayOfMonth', { valueAsNumber: true })}
                          error={errors.dayOfMonth?.message}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Início *
                      </label>
                      <Input type="date" {...register('startDate')} error={errors.startDate?.message} />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Término (opcional)
                      </label>
                      <Input type="date" {...register('endDate')} error={errors.endDate?.message} />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('active')}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Ativo (gerar transações automaticamente)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Salvando...' : recurring ? 'Salvar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

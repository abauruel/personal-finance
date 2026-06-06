import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type {
  Transaction,
} from '../../../types/models.types';
import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../../accounts/api/accountsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import { useSettings } from '../../../contexts/SettingsContext';
import { getPaymentTypeLabel, getTransactionMessages, getTransactionStatusLabel } from '../../../lib/featureLocale';

const buildTransactionSchema = (messages: ReturnType<typeof getTransactionMessages>) => z.object({
  transactionType: z.enum(['EXPENSE', 'INCOME']),
  accountId: z.string().min(1, messages.form.validation.accountRequired),
  categoryId: z.string().min(1, messages.form.validation.categoryRequired),
  date: z.string().min(1, messages.form.validation.dateRequired),
  competenceDate: z.string().min(1, messages.form.validation.dateRequired),
  amount: z.number().min(0.01, messages.form.validation.amountMin),
  description: z.string().min(1, messages.form.validation.descriptionRequired),
  paymentType: z.enum(['DEBIT', 'CREDIT', 'PIX', 'CASH', 'TRANSFER']),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
  notes: z.string().optional(),
  isRecurring: z.boolean(),
  recurringId: z.string().optional(),
});

type TransactionFormData = z.infer<ReturnType<typeof buildTransactionSchema>>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const toCompetenceMonthInput = (value: Date | string) => {
  const parsedDate = new Date(value);
  const year = parsedDate.getUTCFullYear();
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
};

export function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
  isLoading,
}: TransactionFormProps) {
  const { settings } = useSettings();
  const messages = getTransactionMessages(settings.locale);
  const transactionSchema = buildTransactionSchema(messages);
  const [hasManualCompetence, setHasManualCompetence] = useState(false);

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
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
        transactionType: transaction.amount < 0 ? 'EXPENSE' : 'INCOME',
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        date: new Date(transaction.date).toISOString().split('T')[0],
        competenceDate: toCompetenceMonthInput(transaction.competenceDate || transaction.date),
        amount: Math.abs(transaction.amount),
        description: transaction.description,
        paymentType: transaction.paymentType,
        status: transaction.status,
        notes: transaction.notes || '',
        isRecurring: transaction.isRecurring,
        recurringId: transaction.recurringId || '',
      }
      : {
        transactionType: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        competenceDate: new Date().toISOString().slice(0, 7),
        status: 'PENDING',
        paymentType: 'DEBIT',
        isRecurring: false,
      },
  });

  const selectedAccountId = watch('accountId');
  const selectedDate = watch('date');
  const selectedTransactionType = watch('transactionType');

  const computedCompetenceMonth = useMemo(() => {
    if (!selectedDate) {
      return '';
    }

    const transactionDate = new Date(`${selectedDate}T00:00:00`);
    const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
    let competenceMonth = transactionDate.getMonth() + 1;
    let competenceYear = transactionDate.getFullYear();

    if (
      selectedAccount?.type === 'CREDIT_CARD' &&
      selectedTransactionType === 'EXPENSE' &&
      selectedAccount.closingDay &&
      transactionDate.getDate() > selectedAccount.closingDay
    ) {
      competenceMonth += 1;
      if (competenceMonth > 12) {
        competenceMonth = 1;
        competenceYear += 1;
      }
    }

    return `${competenceYear}-${String(competenceMonth).padStart(2, '0')}`;
  }, [accounts, selectedAccountId, selectedDate, selectedTransactionType]);

  useEffect(() => {
    if (transaction) {
      setHasManualCompetence(false);
      reset({
        transactionType: transaction.amount < 0 ? 'EXPENSE' : 'INCOME',
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        date: new Date(transaction.date).toISOString().split('T')[0],
        competenceDate: toCompetenceMonthInput(transaction.competenceDate || transaction.date),
        amount: Math.abs(transaction.amount),
        description: transaction.description,
        paymentType: transaction.paymentType,
        status: transaction.status,
        notes: transaction.notes || '',
        isRecurring: transaction.isRecurring,
        recurringId: transaction.recurringId || '',
      });
      return;
    }

    setHasManualCompetence(false);
    reset((currentValues) => ({
      ...currentValues,
      competenceDate: computedCompetenceMonth || new Date().toISOString().slice(0, 7),
    }));
  }, [transaction, reset, computedCompetenceMonth]);

  useEffect(() => {
    if (!hasManualCompetence && computedCompetenceMonth) {
      setValue('competenceDate', computedCompetenceMonth, { shouldValidate: true });
    }
  }, [computedCompetenceMonth, hasManualCompetence, setValue]);

  const handleFormSubmit = (data: TransactionFormData) => {
    const absAmount = Math.abs(data.amount);

    onSubmit({
      ...data,
      competenceDate: `${data.competenceDate}-01`,
      amount: data.transactionType === 'EXPENSE' ? -absAmount : absAmount,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {transaction ? messages.form.editTitle : messages.form.createTitle}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Account Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.transactionType}
        </label>
        <select
          {...register('transactionType')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="EXPENSE">{messages.form.expense}</option>
          <option value="INCOME">{messages.form.income}</option>
        </select>
      </div>

      {/* Account Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.account}
        </label>
        <select
          {...register('accountId')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{messages.form.accountPlaceholder}</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} - {account.type}
            </option>
          ))}
        </select>
        {errors.accountId && (
          <p className="text-sm text-red-500 mt-1">{errors.accountId.message}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.category}
        </label>
        <select
          {...register('categoryId')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{messages.form.categoryPlaceholder}</option>
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

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.date}
        </label>
        <Input type="date" {...register('date')} error={errors.date?.message} />
      </div>

      {/* Competence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.competence}
        </label>
        <Input
          type="month"
          {...register('competenceDate', {
            onChange: () => setHasManualCompetence(true),
          })}
          error={errors.competenceDate?.message}
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.amount}
        </label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.description}
        </label>
        <Input
          {...register('description')}
          placeholder={messages.form.descriptionPlaceholder}
          error={errors.description?.message}
        />
      </div>

      {/* Payment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.paymentType}
        </label>
        <select
          {...register('paymentType')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {(['DEBIT', 'CREDIT', 'PIX', 'CASH', 'TRANSFER'] as const).map((type) => (
            <option key={type} value={type}>
              {getPaymentTypeLabel(type, settings.locale)}
            </option>
          ))}
        </select>
        {errors.paymentType && (
          <p className="text-sm text-red-500 mt-1">
            {errors.paymentType.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.status}
        </label>
        <select
          {...register('status')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {(['PENDING', 'PAID', 'CANCELLED'] as const).map((status) => (
            <option key={status} value={status}>
              {getTransactionStatusLabel(status, settings.locale)}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {messages.form.notes}
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={messages.form.notesPlaceholder}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} isFullWidth>
          {isLoading ? messages.form.saving : messages.form.save}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          isFullWidth
        >
          {messages.form.cancel}
        </Button>
      </div>
    </form>
  );
}

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Account } from '../../../types/models.types';
import { useSettings } from '../../../contexts/SettingsContext';
import { CURRENCIES } from '../../../types/settings.types';
import { getAccountMessages, getAccountTypeLabel } from '../../../lib/featureLocale';

const buildAccountSchema = (nameRequired: string) => z.object({
  name: z.string().min(1, nameRequired),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD']),
  initialBalance: z.number().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

type AccountFormData = z.infer<ReturnType<typeof buildAccountSchema>>;

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => Promise<void>;
  account?: Account;
  isLoading?: boolean;
}

const accountTypeDefaultColors = {
  CHECKING: '#3B82F6',
  SAVINGS: '#22C55E',
  CREDIT_CARD: '#F97316',
} as const;

export function AccountModal({
  isOpen,
  onClose,
  onSubmit,
  account,
  isLoading,
}: AccountModalProps) {
  const { settings } = useSettings();
  const messages = getAccountMessages(settings.locale);
  const currencySymbol = CURRENCIES[settings.currency].symbol;
  const accountSchema = buildAccountSchema(messages.modal.validation.nameRequired);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || '',
      type: account?.type || 'CHECKING',
      initialBalance: account?.initialBalance || 0,
      color: account?.color || '#3B82F6',
    },
  });

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        type: account.type,
        initialBalance: account.initialBalance,
        color: account.color || '#3B82F6',
      });
    } else {
      reset({
        name: '',
        type: 'CHECKING',
        initialBalance: 0,
        color: '#3B82F6',
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
            {account ? messages.modal.editTitle : messages.modal.createTitle}
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
              {messages.modal.accountName}
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder={messages.modal.accountNamePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {messages.modal.accountType}
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              {['CHECKING', 'SAVINGS', 'CREDIT_CARD'].map((type) => (
                <option key={type} value={type}>
                  {getAccountTypeLabel(type, settings.locale)}
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
              {messages.modal.initialBalance}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                {...register('initialBalance', { valueAsNumber: true })}
                placeholder={messages.modal.initialBalancePlaceholder}
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
                ? messages.modal.editHint
                : messages.modal.createHint}
            </p>
          </div>

          {/* Card Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cor do Card
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register('color')}
                className="h-11 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
              <div className="flex gap-2">
                {Object.values(accountTypeDefaultColors).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('color', color, { shouldValidate: true })}
                    className="h-7 w-7 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={`Selecionar ${color}`}
                  />
                ))}
              </div>
            </div>
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
              {messages.modal.cancel}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? messages.modal.saving : account ? messages.modal.update : messages.modal.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

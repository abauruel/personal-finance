import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Account } from '../../../types/models.types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const accountSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD']),
  initialBalance: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
});

type AccountFormData = z.infer<typeof accountSchema>;

type AccountSubmitData = {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  initialBalance?: number;
  color: string;
};

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: AccountSubmitData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const accountTypeLabels = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Conta Poupança',
  CREDIT_CARD: 'Cartão de Crédito',
};

const accountTypeDefaultColors = {
  CHECKING: '#3B82F6',
  SAVINGS: '#22C55E',
  CREDIT_CARD: '#F97316',
} as const;

export function AccountForm({ account, onSubmit, onCancel, isLoading = false }: AccountFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: account
      ? {
        name: account.name,
        type: account.type,
        initialBalance: String(account.initialBalance || 0),
        color: account.color || '#3B82F6',
      }
      : {
        type: 'CHECKING',
        initialBalance: '0',
        color: '#3B82F6',
      },
  });

  const handleFormSubmit = async (data: AccountFormData) => {
    const transformedData = {
      ...data,
      initialBalance: data.initialBalance ? parseFloat(data.initialBalance) : undefined,
    };
    await onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Conta
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Nubank, Itaú, Bradesco"
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Conta
        </label>
        <select
          id="type"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('type')}
        >
          <option value="">Selecione um tipo</option>
          {Object.entries(accountTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 mb-2">
          Saldo Inicial
        </label>
        <Input
          id="initialBalance"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.initialBalance?.message}
          {...register('initialBalance')}
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
          Cor do Card
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color"
            type="color"
            className="h-11 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
            {...register('color')}
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
        {errors.color && (
          <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          isFullWidth
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading} isFullWidth>
          {isLoading ? 'Salvando...' : account ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Category } from '../../../types/models.types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const commonIcons = [
  '🏠', '⚡', '🍔', '🚗', '🎮', '💊', '📚', '✈️', '🎬', '👕',
  '💰', '🎁', '🏋️', '🐕', '📱', '🌐', '☕', '🍕', '🛒', '💳',
  '🎵', '🏥', '🚌', '🏪', '💼', '🔧', '🎨', '📦', '🏦', '🎓',
];

const commonColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6', // teal
];

export function CategoryForm({ category, onSubmit, onCancel, isLoading = false }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
        name: category.name,
        icon: category.icon,
        color: category.color,
      }
      : {
        icon: '💰',
        color: '#3B82F6',
      },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Categoria
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Alimentação, Transporte, Lazer"
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ícone
        </label>
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
            style={{ backgroundColor: selectedColor }}
          >
            {selectedIcon}
          </div>
          <input type="hidden" {...register('icon')} />
        </div>
        <div className="grid grid-cols-10 gap-2">
          {commonIcons.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon)}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl ${selectedIcon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                }`}
            >
              {icon}
            </button>
          ))}
        </div>
        {errors.icon && (
          <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor
        </label>
        <input type="hidden" {...register('color')} />
        <div className="grid grid-cols-10 gap-2">
          {commonColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-8 h-8 rounded-lg transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                }`}
              style={{ backgroundColor: color }}
            />
          ))}
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
          {isLoading ? 'Salvando...' : category ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}

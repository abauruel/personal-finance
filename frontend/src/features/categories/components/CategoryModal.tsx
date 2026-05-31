import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Category } from '../../../types/models.types';
import { Button } from '../../../components/ui/Button';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
}

const PRESET_COLORS = [
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Roxo', value: '#a855f7' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Cinza', value: '#6b7280' },
];

const COMMON_ICONS = [
  '🍔', '🍕', '🍜', '☕', '🛒', '🏠', '🚗', '⚡', 
  '💳', '💰', '🎮', '📱', '👕', '🎓', '🏥', '✈️',
  '🎬', '🎵', '🏋️', '🎨', '📚', '🐕', '🌳', '🎁',
];

export const CategoryModal = ({ isOpen, onClose, onSubmit, category, isLoading }: CategoryModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: '',
      color: PRESET_COLORS[0].value,
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon,
        color: category.color,
      });
    } else {
      reset({
        name: '',
        icon: '',
        color: PRESET_COLORS[0].value,
      });
    }
  }, [category, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    {category ? 'Editar Categoria' : 'Nova Categoria'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      placeholder="Ex: Alimentação, Transporte..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Ícone */}
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                      Ícone * {selectedIcon && <span className="text-2xl ml-2">{selectedIcon}</span>}
                    </label>
                    <input
                      {...register('icon')}
                      type="text"
                      id="icon"
                      placeholder="Digite um emoji ou escolha abaixo"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
                    />
                    {errors.icon && (
                      <p className="mt-2 text-sm text-red-600">{errors.icon.message}</p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {COMMON_ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setValue('icon', icon)}
                          className={`text-2xl w-12 h-12 rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedIcon === icon ? 'bg-primary/10 ring-2 ring-primary' : ''
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Cor *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setValue('color', color.value)}
                          className={`w-12 h-12 rounded-lg transition-all ${
                            selectedColor === color.value
                              ? 'ring-4 ring-offset-2 ring-primary scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    {errors.color && (
                      <p className="mt-2 text-sm text-red-600">{errors.color.message}</p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleClose}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      className="flex-1"
                    >
                      {category ? 'Salvar' : 'Criar'}
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
};

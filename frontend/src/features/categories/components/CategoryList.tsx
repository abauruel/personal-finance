import { Pencil, Trash2, Star } from 'lucide-react';
import type { Category } from '../../../types/models.types';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const CategoryList = ({ categories, onEdit, onDelete, isLoading }: CategoryListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Star className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma categoria ainda
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Crie sua primeira categoria para organizar suas transações
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative h-48 rounded-2xl p-6 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all group"
          style={{ backgroundColor: category.color }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-6 translate-y-6" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col">
            {/* Icon & Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">
                {category.icon}
              </div>
              {category.isDefault && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  <span className="text-xs font-medium">Padrão</span>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
            </div>

            {/* Actions - Show on hover */}
            {!category.isDefault && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(category)}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="text-sm font-medium">Editar</span>
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Excluir</span>
                </button>
              </div>
            )}

            {/* Info text for default categories */}
            {category.isDefault && (
              <div className="text-xs text-white/80 mt-2">
                Categoria padrão do sistema
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

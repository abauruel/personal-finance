import { useState } from 'react';
import { Plus, Tag, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../../../components/ui/Button';
import { useCategories } from '../hooks/useCategories';
import { CategoryModal } from '../components/CategoryModal';
import { CategoryList } from '../components/CategoryList';
import type { Category } from '../../../types/models.types';

const CategoriesPage = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, isCreating, isUpdating } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data: { name: string; icon: string; color: string }) => {
    try {
      if (selectedCategory) {
        await updateCategory({ id: selectedCategory.id, data });
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await createCategory(data);
        toast.success('Categoria criada com sucesso!');
      }
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar categoria';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id);

    if (category?.isDefault) {
      toast.error('Não é possível deletar categorias padrão');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await deleteCategory(id);
      toast.success('Categoria excluída com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir categoria';
      toast.error(message);
    }
  };

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);
  const totalCategories = categories.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 mt-1">Organize suas transações por categorias</p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Tag className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total de Categorias</p>
            <p className="text-3xl font-bold text-gray-900">{totalCategories}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Categorias Padrão</p>
            <p className="text-3xl font-bold text-gray-900">{defaultCategories.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Minhas Categorias</p>
            <p className="text-3xl font-bold text-gray-900">{customCategories.length}</p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {customCategories.length > 0 ? 'Todas as Categorias' : 'Comece criando sua primeira categoria'}
          </h2>
          <p className="text-gray-500 mt-1">
            {customCategories.length > 0
              ? 'Categorias padrão não podem ser editadas ou excluídas'
              : 'Organize suas transações criando categorias personalizadas'
            }
          </p>
        </div>

        <CategoryList
          categories={categories}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={selectedCategory}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default CategoriesPage;

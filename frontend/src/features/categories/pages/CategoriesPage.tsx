import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '../../../components/ui';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { categoriesApi } from '../api/categoriesApi';
import { CategoryForm } from '../components/CategoryForm';
import type { Category } from '../../../types/models.types';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error: any) {
      toast.error('Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedCategory) {
        await categoriesApi.update(selectedCategory.id, data);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await categoriesApi.create(data);
        toast.success('Categoria criada com sucesso!');
      }
      await loadCategories();
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar categoria';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Não é possível deletar categorias padrão');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await categoriesApi.delete(id);
      toast.success('Categoria excluída com sucesso!');
      await loadCategories();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir categoria';
      toast.error(message);
    }
  };

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Categoria
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <p className="text-gray-600 text-center py-8">Carregando...</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Categorias Padrão */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Categorias Padrão
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {defaultCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    Padrão
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Categorias Personalizadas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Minhas Categorias
            </h2>
            {customCategories.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <Tag size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Nenhuma categoria personalizada</p>
                  <Button variant="primary" onClick={() => handleOpenModal()}>
                    Criar primeira categoria
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {customCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.isDefault)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;

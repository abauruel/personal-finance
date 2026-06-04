import { useState } from 'react';
import { Plus, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { RecurringModal } from '../components/RecurringModal';
import { RecurringList } from '../components/RecurringList';
import { useRecurring } from '../hooks/useRecurring';
import type { RecurringTransaction, CreateRecurringDto, UpdateRecurringDto } from '../../../types/models.types';

export default function RecurringPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const {
    recurrings,
    isLoading,
    isError,
    createRecurring,
    updateRecurring,
    toggleRecurring,
    deleteRecurring,
    generateTransactions,
    isCreating,
    isUpdating,
    isGenerating,
  } = useRecurring();

  const handleOpenModal = (recurring?: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRecurring(undefined);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: CreateRecurringDto | UpdateRecurringDto) => {
    const payload = {
      ...data,
      endDate: data.endDate || undefined,
    };

    try {
      if (editingRecurring) {
        await updateRecurring({ id: editingRecurring.id, data: payload });
      } else {
        await createRecurring(payload as CreateRecurringDto);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving recurring:', error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleRecurring(id);
    } catch (error) {
      console.error('Error toggling recurring:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta recorrência?')) {
      try {
        await deleteRecurring(id);
      } catch (error) {
        console.error('Error deleting recurring:', error);
      }
    }
  };

  const handleGenerate = async () => {
    if (window.confirm('Deseja gerar as transações recorrentes agora? (Normalmente isto acontece automaticamente no dia 1 de cada mês)')) {
      try {
        const result = await generateTransactions();
        alert(`Transações geradas com sucesso!\nSucesso: ${result.success}\nErros: ${result.errors}`);
      } catch (error) {
        console.error('Error generating transactions:', error);
        alert('Erro ao gerar transações. Verifique o console para mais detalhes.');
      }
    }
  };

  const filteredRecurrings = recurrings.filter((r) => {
    if (filter === 'active') return r.active;
    if (filter === 'inactive') return !r.active;
    return true;
  });

  const activeCount = recurrings.filter((r) => r.active).length;
  const inactiveCount = recurrings.filter((r) => !r.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações Recorrentes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie suas despesas e receitas recorrentes
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Gerando...' : 'Gerar Agora'}
          </Button>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus size={16} />
            Nova Recorrência
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Calendar className="text-blue-600 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-medium text-blue-900">Geração Automática</h3>
          <p className="text-sm text-blue-700 mt-1">
            As transações recorrentes são geradas automaticamente no dia 1 de cada mês às 00:00.
            Você também pode gerar manualmente clicando no botão "Gerar Agora".
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total</div>
          <div className="text-2xl font-bold text-gray-900">{recurrings.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Ativas</div>
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Inativas</div>
          <div className="text-2xl font-bold text-gray-400">{inactiveCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'all'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Todas ({recurrings.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'active'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Ativas ({activeCount})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${filter === 'inactive'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Inativas ({inactiveCount})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin text-primary" size={32} />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-medium text-red-900">Erro ao carregar</h3>
            <p className="text-sm text-red-700 mt-1">
              Não foi possível carregar as transações recorrentes. Tente novamente.
            </p>
          </div>
        </div>
      ) : filteredRecurrings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-card border border-gray-100">
          <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Nenhuma recorrência cadastrada' : `Nenhuma recorrência ${filter === 'active' ? 'ativa' : 'inativa'}`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? 'Crie sua primeira transação recorrente para automatizar suas finanças.'
              : `Não há transações recorrentes ${filter === 'active' ? 'ativas' : 'inativas'} no momento.`
            }
          </p>
          {filter === 'all' && (
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Criar Primeira Recorrência
            </Button>
          )}
        </div>
      ) : (
        <RecurringList
          recurrings={filteredRecurrings}
          onEdit={handleOpenModal}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <RecurringModal
        isOpen={isModalOpen}
        recurring={editingRecurring}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}

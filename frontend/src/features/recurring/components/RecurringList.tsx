import { Edit2, Trash2, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { RecurringTransaction } from '../../../types/models.types';

interface RecurringListProps {
  recurrings: RecurringTransaction[];
  onEdit: (recurring: RecurringTransaction) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const frequencyLabels = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
};

const paymentTypeLabels = {
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
  TRANSFER: 'Transferência',
};

export function RecurringList({
  recurrings,
  onEdit,
  onToggle,
  onDelete,
}: RecurringListProps) {
  const getNextGenerationDate = (recurring: RecurringTransaction): Date => {
    const today = new Date();

    if (recurring.frequency === 'MONTHLY') {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, recurring.dayOfMonth);
      return nextMonth;
    }

    // Simplified for WEEKLY and YEARLY
    return new Date(today.getFullYear(), today.getMonth() + 1, 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequência
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próxima
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recurrings.map((recurring) => {
              const nextDate = getNextGenerationDate(recurring);

              return (
                <tr
                  key={recurring.id}
                  className={`hover:bg-gray-50 transition ${!recurring.active ? 'opacity-50' : ''
                    }`}
                >
                  {/* Status Toggle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggle(recurring.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${recurring.active ? 'bg-primary' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${recurring.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {recurring.description}
                        </div>
                        {recurring.account && (
                          <div className="text-sm text-gray-500">
                            {recurring.account.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recurring.category && (
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{recurring.category.icon}</span>
                        <span className="text-sm text-gray-900">
                          {recurring.category.name}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign size={14} className="text-gray-400 mr-1" />
                      {recurring.amount.toFixed(2)}
                    </div>
                  </td>

                  {/* Frequency */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {frequencyLabels[recurring.frequency]}
                      {recurring.frequency === 'MONTHLY' && ` - Dia ${recurring.dayOfMonth}`}
                    </span>
                  </td>

                  {/* Next Generation */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recurring.active ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        {format(nextDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Inativa</span>
                    )}
                  </td>

                  {/* Payment Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {paymentTypeLabels[recurring.paymentType]}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(recurring)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(recurring.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

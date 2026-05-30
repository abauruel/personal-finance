import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentTransactionsProps {
  transactions: Array<{
    id: string;
    date: Date;
    description: string;
    amount: number;
    category: {
      name: string;
      icon: string;
    };
    account: {
      name: string;
    };
  }>;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Transações Recentes</h2>
        <div className="text-center py-8 text-gray-500">
          Nenhuma transação registrada
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Transações Recentes</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-3 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{transaction.category.icon}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.category.name} • {transaction.account.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(transaction.date), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

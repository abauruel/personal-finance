import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  type: 'balance' | 'income' | 'expense';
}

export function StatCard({ title, value, type }: StatCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const getIcon = () => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="text-green-500" size={24} />;
      case 'expense':
        return <ArrowDownRight className="text-red-500" size={24} />;
      default:
        return <Wallet className="text-blue-500" size={24} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        {getIcon()}
      </div>
      <p className={`text-2xl font-bold ${getColor()}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

import React from 'react';
import { Card } from '../../../components/ui';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-sm text-gray-500 mb-1">Saldo Total</div>
          <div className="text-2xl font-bold text-gray-900">R$ 0,00</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Receitas do Mês</div>
          <div className="text-2xl font-bold text-green-600">R$ 0,00</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Despesas do Mês</div>
          <div className="text-2xl font-bold text-red-600">R$ 0,00</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Balanço</div>
          <div className="text-2xl font-bold text-gray-900">R$ 0,00</div>
        </Card>
      </div>

      <Card title="Transações Recentes">
        <p className="text-gray-600 text-center py-8">
          Dashboard em desenvolvimento...
        </p>
      </Card>
    </div>
  );
};

export default DashboardPage;

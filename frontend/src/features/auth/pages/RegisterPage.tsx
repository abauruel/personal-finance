import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../lib/constants';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-6xl">💰</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Personal Finance
          </h1>
          <p className="mt-2 text-gray-600">
            Crie sua conta
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-center text-gray-600">
            Página de cadastro em desenvolvimento...
          </p>
          <div className="mt-6 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

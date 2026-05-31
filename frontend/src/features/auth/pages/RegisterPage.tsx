import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '../../../lib/constants';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const { name, email, password } = data;
      const response = await authApi.register({ name, email, password });

      setAuth(response.user, response.accessToken, response.refreshToken);

      toast.success('Conta criada com sucesso!');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-700 rounded-3xl mb-6 shadow-xl shadow-violet-500/30">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Personal Finance
          </h1>
          <p className="text-slate-500 text-base">
            Comece a gerenciar suas finanças hoje
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100/50 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Criar conta
            </h2>
            <p className="text-slate-500">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" isFullWidth disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-600">
              Já tem uma conta?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ao criar uma conta, você concorda com nossos termos
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

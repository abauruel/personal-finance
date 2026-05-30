import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="mt-4 text-xl font-semibold text-center text-gray-900">
              Algo deu errado
            </h1>
            <p className="mt-2 text-sm text-center text-gray-600">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            {this.state.error && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="mt-6">
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="primary"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

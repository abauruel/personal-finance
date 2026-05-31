
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/common';
import { Toaster } from 'sonner';
import { SettingsProvider } from './contexts/SettingsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;

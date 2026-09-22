import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/query-client';
import { AppRouter } from './routes/AppRouter';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

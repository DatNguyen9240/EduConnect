import ErrorBoundary from '@pages/Error/Error';
import { Suspense } from 'react';
import './styles/GlobalStyle/index.css';
import Loading from '@components/common/loading';

import { RouterProvider } from 'react-router-dom';
import { RouterConfig } from '@/routes/RouterConfig';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from './contexts/app.context';
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  const router = RouterConfig();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <RouterProvider router={router} />
          </Suspense>
          <ToastContainer />
        </ErrorBoundary>
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

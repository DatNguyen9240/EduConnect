import ErrorBoundary from '@pages/Error/Error';
import { Suspense, useContext } from 'react';
import './styles/GlobalStyle/index.css';
import Loading from '@components/common/loading';

import { RouterProvider } from 'react-router-dom';
import { RouterConfig } from '@/routes/RouterConfig';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { AppProvider, AppContext } from './contexts/app.context';
import { SelectedStudentProvider, useSelectedStudent } from './contexts/selected-student.context';
import ParentProfileSelector from './components/ui/ParentProfileSelector';
import React from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppGuard() {
  const { userInfo } = useContext(AppContext);
  const { selectedStudent, isLoaded } = useSelectedStudent();
  const [showSelector, setShowSelector] = React.useState(false);

  if (!isLoaded) {
    return null;
  }

  // Khi chưa chọn con (login lần đầu), hiển thị selector KHÔNG có nút close
  if (userInfo?.role === 'Parent' && !selectedStudent) {
    return <ParentProfileSelector />;
  }

  // Khi chọn lại con (từ SelectedStudentInfo), showSelector sẽ là true và truyền onClose
  if (showSelector) {
    return (
      <ParentProfileSelector
        onSelect={() => setShowSelector(false)}
        onClose={() => setShowSelector(false)}
      />
    );
  }

  // Nếu đã chọn con hoặc không phải Parent, render app như bình thường
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={RouterConfig()} />
      </Suspense>
      <ToastContainer />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <SelectedStudentProvider>
          <AppGuard />
        </SelectedStudentProvider>
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

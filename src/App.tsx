import ErrorBoundary from '@pages/Error/Error';
import { Suspense, useContext } from 'react';
import './styles/GlobalStyle/index.css';
import Loading from '@components/common/loading';

import { RouterProvider } from 'react-router-dom';
import { RouterConfig } from '@/routes/RouterConfig';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, AppContext } from './contexts/app.context';
import { SelectedStudentProvider, useSelectedStudent } from './contexts/selected-student.context';
import ParentProfileSelector from './components/ui/ParentProfileSelector';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from './contexts/notification.context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_AUTH_CONFIG } from './constants/googleAuth';
import useSilentLogin from './hooks/useSilentLogin';

// Component để xử lý silent login
const SilentLoginHandler = () => {
  const { silentLogin } = useSilentLogin();

  useEffect(() => {
    // Xử lý sự kiện silent login
    const handleSilentLoginEvent = async () => {
      console.log('Silent login event received');
      await silentLogin();
    };

    // Đăng ký listener
    window.addEventListener('silent-login-required', handleSilentLoginEvent);

    // Cleanup
    return () => {
      window.removeEventListener('silent-login-required', handleSilentLoginEvent);
    };
  }, [silentLogin]);

  return null; // Component này không render gì cả
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_CONFIG.CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <SelectedStudentProvider>
            <NotificationProvider>
              <SilentLoginHandler />
              <AppGuard />
            </NotificationProvider>
          </SelectedStudentProvider>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

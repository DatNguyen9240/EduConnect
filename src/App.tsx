import ErrorBoundary from "@pages/Error/Error";
import { Suspense } from "react";
import "./styles/GlobalStyle/index.css";
import Loading from "@components/common/loading";

import { RouterProvider } from "react-router-dom";
import { RouterConfig } from "@/routes/RouterConfig";

function App() {
  const router = RouterConfig();

  return (
    <ErrorBoundary>
      <div className="h-screen overflow-y-auto">
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;

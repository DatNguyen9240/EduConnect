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
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

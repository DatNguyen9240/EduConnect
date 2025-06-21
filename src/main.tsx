import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/GlobalStyle/index.css';
import App from './App.tsx';
import { GOOGLE_AUTH_CONFIG } from '@constants/googleAuth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_CONFIG.CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

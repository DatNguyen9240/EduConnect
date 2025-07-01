import { GoogleLogin as GoogleLoginComponent, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import type { GoogleUser, GoogleLoginProps } from '@/types';

export const GoogleLogin = ({ onSuccess, onError, className = '' }: GoogleLoginProps) => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        onError?.('No credential received');
        return;
      }
      // Decode the JWT token to get user information
      const credentialResponseDecoded = jwtDecode(credentialResponse.credential) as GoogleUser;

      // Call the success callback with user data and credential
      onSuccess(credentialResponseDecoded, credentialResponse.credential);
    } catch (error) {
      console.error('Error decoding Google token:', error);
      onError?.(error);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    onError?.('Google login failed');
  };

  return (
    <div className={className}>
      <GoogleLoginComponent onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

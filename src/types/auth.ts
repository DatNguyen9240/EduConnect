// Google OAuth User Interface (for JWT token from One Tap)
export interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
}

// Google Login Props Interface
export interface GoogleLoginProps {
  onSuccess: (user: GoogleUser, credential: string) => void;
  onError?: (error: unknown) => void;
  className?: string;
  children?: React.ReactNode;
}

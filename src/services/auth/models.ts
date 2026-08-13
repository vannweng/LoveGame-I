export type AuthStatus = 'loading' | 'signedOut' | 'authenticated';

export interface AuthUser {
  id: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
}

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
}

import { useCallback, useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { FirebaseGoogleAuthService } from './FirebaseGoogleAuthService';
import type { AuthState } from './models';

WebBrowser.maybeCompleteAuthSession();

const authService = new FirebaseGoogleAuthService();
const webClientId = '50227382857-92jmcr1nm20fedogrkdgisb4v551fr9s.apps.googleusercontent.com';
const androidClientId = '50227382857-tqhs8fihkfsnchla80116ron00cnvfif.apps.googleusercontent.com';

export function useGoogleAuthentication() {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    user: null,
    error: null,
  });
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId,
    webClientId,
  });

  const handleUserChange = useCallback((user: AuthState['user']): void => {
    setAuthState({ status: user ? 'authenticated' : 'signedOut', user, error: null });
  }, []);

  const handleGoogleResponse = useCallback(async (): Promise<void> => {
    if (!response || response.type === 'cancel' || response.type === 'dismiss') {
      return;
    }

    if (response.type !== 'success') {
      setAuthState((state) => ({ ...state, error: 'Google 登入失敗，請重試。' }));
      return;
    }

    const idToken = response.params.id_token;

    if (!idToken) {
      setAuthState((state) => ({ ...state, error: '未取得 Google 登入憑證，請重試。' }));
      return;
    }

    try {
      await authService.signInWithGoogleIdToken(idToken);
    } catch {
      setAuthState((state) => ({ ...state, error: '登入失敗，請重試。' }));
    }
  }, [response]);

  useEffect(() => authService.subscribe(handleUserChange), [handleUserChange]);
  useEffect(() => {
    void handleGoogleResponse();
  }, [handleGoogleResponse]);

  async function signIn(): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        await authService.signInWithGooglePopup();
      } catch {
        setAuthState((state) => ({ ...state, error: '登入失敗，請重試。' }));
      }
      return;
    }

    if (!request) {
      setAuthState((state) => ({ ...state, error: '登入服務尚未就緒，請重試。' }));
      return;
    }

    setAuthState((state) => ({ ...state, error: null }));
    await promptAsync();
  }

  async function signOut(): Promise<void> {
    try {
      await authService.signOut();
    } catch {
      setAuthState((state) => ({ ...state, error: '登出失敗，請重試。' }));
    }
  }

  return { authState, signIn, signOut };
}

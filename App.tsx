import { useEffect, useMemo, useState } from 'react';
import { DotGothic16_400Regular, useFonts } from '@expo-google-fonts/dotgothic16';
import { AuthLoadingView } from '@/application/providers/AuthLoadingView';
import { GameplayBootstrap } from '@/application/providers/GameplayBootstrap';
import { LocalAccountResetService } from '@/application/account/LocalAccountResetService';
import { DevPreviewSession } from '@/application/dev/DevPreviewSession';
import { SignInView } from '@/features/auth/ui/SignInView';
import { useGoogleAuthentication } from '@/infrastructure/auth';
import { secureStorage } from '@/infrastructure/storage/secureStorage';
import type { AuthUser } from '@/infrastructure/auth/models';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ DotGothic16_400Regular });
  const { authState, signIn, signOut } = useGoogleAuthentication();
  const [developmentUser, setDevelopmentUser] = useState<AuthUser | null>(null);
  const [devPreviewReady, setDevPreviewReady] = useState(!__DEV__);
  const preview = useMemo(() => new DevPreviewSession(), []);
  const accountReset = useMemo(() => new LocalAccountResetService(secureStorage), []);
  useEffect(() => {
    if (!__DEV__) return;
    void preview.restore().then(setDevelopmentUser).catch(() => setDevelopmentUser(null)).finally(() => setDevPreviewReady(true));
  }, [preview]);
  if ((!fontsLoaded && !fontError) || authState.status === 'loading' || !devPreviewReady) return <AuthLoadingView />;
  if (authState.status === 'signedOut' && !developmentUser) return <SignInView error={authState.error} onSignIn={() => void signIn()} onContinueAsDev={__DEV__ ? () => void preview.start().then(setDevelopmentUser) : undefined} />;
  const user = authState.user ?? developmentUser;
  if (!user) return <AuthLoadingView />;
  const signOutCurrentUser = developmentUser ? () => preview.clear().then(() => setDevelopmentUser(null)) : signOut;
  const resetAndSignOut = async () => {
    await accountReset.resetUserData(user.id);
    await signOutCurrentUser();
  };
  return <GameplayBootstrap key={user.id} user={user} onResetAndSignOut={resetAndSignOut} onSignOut={() => void signOutCurrentUser()} />;
}

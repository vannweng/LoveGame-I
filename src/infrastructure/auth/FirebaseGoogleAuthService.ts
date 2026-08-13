import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from './firebaseClient';
import type { AuthUser } from './models';

export class FirebaseGoogleAuthService {
  subscribe(onChange: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(firebaseAuth, (user) => onChange(user ? toAuthUser(user) : null));
  }

  async signInWithGoogleIdToken(idToken: string): Promise<void> {
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(firebaseAuth, credential);
  }

  async signInWithGooglePopup(): Promise<void> {
    await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  }

  async signOut(): Promise<void> {
    await signOut(firebaseAuth);
  }
}

function toAuthUser(user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null }): AuthUser {
  return {
    id: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
  };
}

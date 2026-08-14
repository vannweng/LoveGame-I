import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  browserPopupRedirectResolver,
  getAuth,
  inMemoryPersistence,
  initializeAuth,
} from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth';
import { Platform } from 'react-native';

import { secureStorage } from '../storage/secureStorage';

const firebaseConfig = {
  apiKey: 'AIzaSyCVhJFArhyBbxglJLOFVmb9-X_YPxMVubw',
  authDomain: 'lovegame-i-dev.firebaseapp.com',
  projectId: 'lovegame-i-dev',
  storageBucket: 'lovegame-i-dev.firebasestorage.app',
  messagingSenderId: '50227382857',
  appId: '1:50227382857:web:63a60aeadb97a89f490d98',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseFirestore = getFirestore(firebaseApp);

export const firebaseAuth =
  Platform.OS === 'web'
    ? initializeWebAuth()
    : initializeReactNativeAuth();

function initializeWebAuth() {
  try {
    return initializeAuth(firebaseApp, {
      persistence: inMemoryPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

function initializeReactNativeAuth() {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(secureStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

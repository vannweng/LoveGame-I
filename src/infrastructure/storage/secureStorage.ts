import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};
const webSessionStorage = new Map<string, string>();

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return webSessionStorage.get(key) ?? null;

    const encryptedValue = await SecureStore.getItemAsync(key, options);
    if (encryptedValue !== null) return encryptedValue;

    return migrateLegacyValue(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      webSessionStorage.set(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value, options);
    await AsyncStorage.removeItem(key);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      webSessionStorage.delete(key);
      return;
    }

    await Promise.all([
      SecureStore.deleteItemAsync(key, options),
      AsyncStorage.removeItem(key),
    ]);
  },
};

async function migrateLegacyValue(key: string): Promise<string | null> {
  const legacyValue = await AsyncStorage.getItem(key);
  if (legacyValue === null) return null;

  await SecureStore.setItemAsync(key, legacyValue, options);
  await AsyncStorage.removeItem(key);
  return legacyValue;
}

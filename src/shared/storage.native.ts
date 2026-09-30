import { useLocalStorage } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readStorage<T>(key: string): Promise<T | null> {
    if (!useLocalStorage) return null;

    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
}

export async function writeStorage(key: string, value: unknown): Promise<void> {
    if (!useLocalStorage) return;

    await AsyncStorage.setItem(key, JSON.stringify(value));
}

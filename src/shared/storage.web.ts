import { useLocalStorage } from './config';

export async function readStorage<T>(key: string): Promise<T | null> {
    if (!useLocalStorage || typeof window === `undefined`) return null;

    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
}

export async function writeStorage(key: string, value: unknown): Promise<void> {
    if (!useLocalStorage || typeof window === `undefined`) return;

    window.localStorage.setItem(key, JSON.stringify(value));
}

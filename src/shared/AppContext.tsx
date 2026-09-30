import { isHexColor } from './color';
import { readStorage, writeStorage } from './storage';
import { APP_URL, DEFAULT_ACCENT, STORAGE_KEY } from './config';
import type { LocalUser, QRRecord, QRSettings, QRSaveSettings, Theme } from './types';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface StoredState {
    version: 1;
    theme: Theme;
    accent: string;
    users: LocalUser[];
    records: QRRecord[];
    activeUserId: string | null;
}

interface AppState {
    ready: boolean;
    theme: Theme;
    accent: string;
    notice: string | null;
    user: LocalUser | null;
    records: QRRecord[];
    storageError: string | null;
    logout: () => void;
    toggleTheme: () => void;
    notify: (message: string) => void;
    deleteQR: (id: string) => void;
    setAccent: (color: string) => void;
    login: (name: string, email: string) => void;
    saveQR: (settings: QRSaveSettings, payload: string) => QRRecord;
}

const initialState: StoredState = {
    version: 1,
    users: [],
    records: [],
    theme: `dark`,
    activeUserId: null,
    accent: DEFAULT_ACCENT,
};

const AppContext = createContext<AppState | null>(null);
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function readSavedState(value: unknown): StoredState {
    if (!value || typeof value !== `object`) return initialState;

    const saved = value as Partial<StoredState>;
    if (saved.version !== 1 || !Array.isArray(saved.users) || !Array.isArray(saved.records)) {
        throw new Error(`Saved data could not be read. You can keep using the generator.`);
    }

    const users = saved.users.filter((user) => (
        user && typeof user.id === `string`
        && typeof user.name === `string` && typeof user.email === `string`
    ));
    const records = saved.records.filter((record) => (
        record && typeof record.id === `string`
        && typeof record.title === `string` && typeof record.payload === `string`
        && typeof record.content === `string` && typeof record.createdAt === `string`
        && typeof record.color === `string` && isHexColor(record.color)
        && typeof record.includeLogo === `boolean` && typeof record.wifiHidden === `boolean`
        && typeof record.emailBody === `string` && typeof record.emailSubject === `string`
        && typeof record.wifiPassword === `string` && typeof record.customLogoUrl === `string`
        && [`WPA`, `WEP`, `nopass`].includes(record.wifiSecurity)
        && [`url`, `text`, `email`, `wifi`].includes(record.contentType)
        && [`brand`, `site`, `custom`].includes(record.logoMode)
        && (record.ownerId === null || typeof record.ownerId === `string`)
    )).slice(0, 500);

    return {
        version: 1,
        users,
        records,
        theme: saved.theme === `light` ? `light` : `dark`,
        accent: saved.accent && isHexColor(saved.accent) ? saved.accent.toUpperCase() : DEFAULT_ACCENT,
        activeUserId: users.some((user) => user.id === saved.activeUserId) ? saved.activeUserId! : null,
    };
}

function getTitle(settings: QRSettings, payload: string): string {
    if (payload === APP_URL) return `QR Code GenR8`;
    if (settings.contentType === `wifi`) return settings.content.trim().slice(0, 60);
    if (settings.contentType === `email`) return `Email ${settings.content.trim()}`;
    if (settings.contentType === `url`) {
        try { return new URL(payload).hostname; } catch { /* Use the entered text below. */ }
    }

    return settings.content.trim().slice(0, 60) || `Untitled QR code`;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [state, setState] = useState<StoredState>(initialState);
    const [storageError, setStorageError] = useState<string | null>(null);
    const persistence = useRef<Promise<void>>(Promise.resolve());
    const latestState = useRef(state);
    latestState.current = state;

    useEffect(() => {
        let active = true;

        readStorage<unknown>(STORAGE_KEY)
            .then((saved) => { if (active && saved) setState(readSavedState(saved)); })
            .catch(() => {
                if (active) setStorageError(`Device storage is unavailable. Changes will stay in this session.`);
            })
            .finally(() => { if (active) setReady(true); });

        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!ready) return;

        const timer = setTimeout(() => {
            persistence.current = persistence.current
                .then(() => writeStorage(STORAGE_KEY, latestState.current))
                .then(() => setStorageError(null))
                .catch(() => {
                    setStorageError(`Device storage is unavailable or full. Changes will stay in this session.`);
                });
        }, 150);

        return () => clearTimeout(timer);
    }, [ready, state]);

    useEffect(() => {
        if (!ready || typeof window === `undefined`) return;

        const persist = () => { void writeStorage(STORAGE_KEY, latestState.current).catch(() => {}); };
        window.addEventListener(`pagehide`, persist);
        return () => window.removeEventListener(`pagehide`, persist);
    }, [ready]);

    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(null), 4800);
        return () => clearTimeout(timer);
    }, [notice]);

    const notify = useCallback((message: string) => setNotice(message), []);
    const setAccent = useCallback((color: string) => {
        if (!isHexColor(color)) return;
        const accent = color.toUpperCase();
        setState((previous) => previous.accent === accent ? previous : { ...previous, accent });
    }, []);
    const toggleTheme = useCallback(() => {
        setState((previous) => ({ ...previous, theme: previous.theme === `dark` ? `light` : `dark` }));
    }, []);

    const login = useCallback((name: string, email: string) => {
        const safeName = name.trim().slice(0, 60);
        const safeEmail = email.trim().toLowerCase().slice(0, 254);
        if (!safeName) throw new Error(`Enter your name to create a local profile.`);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) throw new Error(`Enter a valid email address.`);

        setState((previous) => {
            const existing = previous.users.find((profile) => profile.email === safeEmail);
            const profile = { id: existing?.id ?? makeId(`profile`), name: safeName, email: safeEmail };

            return {
                ...previous,
                activeUserId: profile.id,
                users: existing
                    ? previous.users.map((user) => user.id === profile.id ? profile : user)
                    : [...previous.users, profile],
                records: previous.records.map((record) => record.ownerId === null ? { ...record, ownerId: profile.id } : record),
            };
        });
        notify(`Your local profile is ready. Saved codes stay on this device.`);
    }, [notify]);

    const logout = useCallback(() => {
        setState((previous) => ({ ...previous, activeUserId: null }));
        notify(`Signed out of your local profile.`);
    }, [notify]);

    const saveQR = useCallback((settings: QRSaveSettings, payload: string): QRRecord => {
        const existing = state.records.find((record) => (
            record.id === settings.id && record.ownerId === state.activeUserId
        ));
        const record: QRRecord = {
            ...settings,
            payload,
            id: existing?.id ?? makeId(`qr`),
            ownerId: state.activeUserId,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
            title: getTitle(settings, payload),
        };

        setState((previous) => ({
            ...previous,
            records: existing
                ? previous.records.map((item) => item.id === existing.id && item.ownerId === state.activeUserId ? record : item)
                : [record, ...previous.records].slice(0, 500),
        }));
        notify(existing
            ? `QR code updated in your local collection.`
            : state.activeUserId ? `QR code saved to your local collection.` : `QR code saved on this device. Create a local profile to collect it.`);
        return record;
    }, [notify, state.activeUserId, state.records]);

    const deleteQR = useCallback((id: string) => {
        setState((previous) => ({
            ...previous,
            records: previous.records.filter((record) => record.id !== id || record.ownerId !== previous.activeUserId),
        }));
        notify(`QR code removed from your collection.`);
    }, [notify]);

    const user = useMemo(() => state.users.find((profile) => profile.id === state.activeUserId) ?? null, [state.users, state.activeUserId]);
    const records = useMemo(() => state.records.filter((record) => record.ownerId === state.activeUserId), [state.records, state.activeUserId]);
    const value = useMemo<AppState>(() => ({
        user,
        ready,
        notice,
        records,
        login,
        logout,
        notify,
        saveQR,
        deleteQR,
        setAccent,
        toggleTheme,
        storageError,
        theme: state.theme,
        accent: state.accent,
    }), [user, ready, notice, records, login, logout, notify, saveQR, deleteQR, setAccent, toggleTheme, storageError, state.theme, state.accent]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(): AppState {
    const context = useContext(AppContext);
    if (!context) throw new Error(`useApp must be used inside AppProvider.`);
    return context;
}

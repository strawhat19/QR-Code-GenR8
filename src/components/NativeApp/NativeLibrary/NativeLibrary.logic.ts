import { useState } from 'react';
import { useApp } from '../../../shared/AppContext';
import type { QRRecord } from '../../../shared/types';
import { getMatrix, resolveLogo } from '../../../shared/qr';
import { exportNativeQr } from '../../../shared/download.native';

export function useNativeLibrary(onClose: () => void) {
    const app = useApp();
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState(``);

    async function download(record: QRRecord) {
        setBusyId(record.id);
        setError(``);

        try {
            await exportNativeQr({
                color: record.color,
                payload: record.payload,
                logoUrl: resolveLogo(record, record.payload),
            });
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : `This code could not be exported.`);
        } finally {
            setBusyId(null);
        }
    }

    function logout() {
        app.logout();
        onClose();
    }

    return { app, error, busyId, logout, download };
}

export function savedMatrix(payload: string) {
    try {
        return getMatrix(payload);
    } catch {
        return null;
    }
}

export function savedLogo(record: QRRecord) {
    try {
        return resolveLogo(record, record.payload);
    } catch {
        return undefined;
    }
}

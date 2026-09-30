import { useApp } from '../../shared/AppContext';
import { LayoutAnimation } from 'react-native';
import type { QRSettings } from '../../shared/types';
import { exportNativeQr } from '../../shared/download.native';
import { APP_URL, defaultSettings } from '../../shared/config';
import { useMemo, useState, useDeferredValue } from 'react';
import { buildPayload, getMatrix, resolveLogo } from '../../shared/qr';

export type NativePage = `about` | `terms` | `contact` | `privacy`;

export const nativeElement = (id: string) => ({ nativeID: id, testID: id });

export function useNativeApp() {
    const app = useApp();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(``);
    const [profileOpen, setProfileOpen] = useState(false);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const [page, setPage] = useState<NativePage | null>(null);
    const [settings, setSettings] = useState<QRSettings>({ ...defaultSettings, content: APP_URL });
    const liveSettings = useMemo(() => ({ ...settings, color: app.accent }), [settings, app.accent]);
    const deferredSettings = useDeferredValue(liveSettings);

    const content = useMemo(() => {
        try {
            const payload = buildPayload(deferredSettings);

            return { payload, error: `` };
        } catch (caught) {
            return {
                payload: ``,
                error: caught instanceof Error ? caught.message : `Add your content to create a QR code.`,
            };
        }
    }, [
        deferredSettings.content,
        deferredSettings.contentType,
        deferredSettings.emailSubject,
        deferredSettings.emailBody,
        deferredSettings.wifiPassword,
        deferredSettings.wifiSecurity,
        deferredSettings.wifiHidden,
    ]);

    const matrix = useMemo(() => {
        try {
            return { matrix: content.payload ? getMatrix(content.payload) : null, error: `` };
        } catch (caught) {
            return {
                matrix: null,
                error: caught instanceof Error ? caught.message : `This content is too long for a QR code.`,
            };
        }
    }, [content.payload]);

    const logo = useMemo(() => {
        try {
            return {
                logoUrl: content.payload ? resolveLogo(deferredSettings, content.payload) : undefined,
                error: ``,
            };
        } catch (caught) {
            return {
                logoUrl: undefined,
                error: caught instanceof Error ? caught.message : `Choose a valid public logo URL.`,
            };
        }
    }, [content.payload, deferredSettings]);

    const preview = {
        ...content,
        logoUrl: logo.logoUrl,
        matrix: matrix.matrix,
        error: content.error || matrix.error || logo.error,
    };

    function setField<K extends keyof QRSettings>(field: K, value: QRSettings[K]) {
        if ([`includeLogo`, `logoMode`, `wifiSecurity`].includes(field)) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }

        setError(``);
        setSettings((current) => ({ ...current, [field]: value }));
    }

    function changeType(contentType: QRSettings[`contentType`]) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError(``);
        setSettings((current) => ({
            ...current,
            contentType,
            content: contentType === `url` ? APP_URL : ``,
        }));
    }

    function save() {
        try {
            const payload = buildPayload(liveSettings);

            getMatrix(payload);
            resolveLogo(liveSettings, payload);
            setError(``);

            app.saveQR(liveSettings, payload);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : `This QR code could not be saved.`);
        }
    }

    async function download() {
        setBusy(true);
        setError(``);

        try {
            const payload = buildPayload(liveSettings);

            await exportNativeQr({
                payload,
                color: app.accent,
                logoUrl: resolveLogo(liveSettings, payload),
            });
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : `This QR code could not be exported.`);
        } finally {
            setBusy(false);
        }
    }

    function closeProfile() {
        setProfileOpen(false);
    }

    return {
        app, page, busy, error, preview, settings,
        save, setPage, setField, download, changeType,
        profileOpen, libraryOpen, closeProfile, setProfileOpen, setLibraryOpen,
    };
}

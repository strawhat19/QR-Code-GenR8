import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { appUrl } from '../../shared/routes.web';
import { useApp } from '../../shared/AppContext';
import { defaultSettings } from '../../shared/config';
import { buildPayload, resolveLogo } from '../../shared/qr';
import type { ContentType, QRRecord, QRSettings } from '../../shared/types';

export function useGenerator(record?: QRRecord | null) {
    const { accent, setAccent, saveQR, notify, user } = useApp();
    const [format, setFormat] = useState<`svg` | `png`>(`png`);
    const [exporting, setExporting] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);
    const [draft, setDraft] = useState<QRSettings>(() => ({
        ...defaultSettings,
        ...record,
        content: record?.content || appUrl(),
        color: record?.color || accent,
    }));
    const settings = useMemo(() => ({ ...draft, color: accent }), [draft, accent]);

    useEffect(() => {
        if (!record) return;
        setDraft(record);
        setAccent(record.color);
    }, [record?.id]);

    function update<K extends keyof QRSettings>(key: K, value: QRSettings[K]) {
        setDraft((current) => ({ ...current, [key]: value }));
    }

    function changeType(contentType: ContentType) {
        setDraft((current) => ({
            ...current,
            contentType,
            content: contentType === `url` ? appUrl() : ``,
            logoMode: current.logoMode === `site` && contentType !== `url` ? `brand` : current.logoMode,
        }));
    }

    const result = useMemo(() => {
        try { return { payload: buildPayload(draft), error: `` }; }
        catch (error) { return { payload: ``, error: error instanceof Error ? error.message : `Check your content.` }; }
    }, [draft]);
    const deferredPayload = useDeferredValue(result.payload);
    const updating = result.payload !== deferredPayload;
    const payload = deferredPayload || appUrl();
    const logoResult = useMemo(() => {
        try { return { url: resolveLogo(settings, payload), error: `` }; }
        catch (error) { return { url: undefined, error: error instanceof Error ? error.message : `Check the image URL.` }; }
    }, [settings.includeLogo, settings.logoMode, settings.customLogoUrl, accent, payload]);

    useEffect(() => { setLogoFailed(false); }, [logoResult.url]);
    const error = result.error || logoResult.error;
    const canUse = !error && !updating && !exporting && !!result.payload;

    async function download() {
        if (!canUse) return;
        if (logoFailed && settings.includeLogo) {
            notify(`This logo could not load. Choose another image or turn the logo off.`);
            return;
        }
        setExporting(true);
        try {
            const { downloadQr } = await import('../../shared/download.web');
            await downloadQr(settings, result.payload, format);
            notify(`Your ${format.toUpperCase()} is ready. Scan it before printing or sharing.`);
        } catch (error) {
            notify(error instanceof Error ? error.message : `The download could not finish. Please try again.`);
        } finally { setExporting(false); }
    }

    function save() {
        if (!canUse) return;
        saveQR(settings, result.payload);
        notify(record ? `Updated your saved code on this browser.` : user ? `Saved to your QR collection on this browser.` : `Saved on this browser. Sign in with a local profile to see your collection.`);
    }

    return {
        user, error, format, accent, payload, canUse, settings, updating,
        exporting, logoFailed, logoResult, update, changeType, setAccent,
        setFormat, setLogoFailed, download, save,
    };
}

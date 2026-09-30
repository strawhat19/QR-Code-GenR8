import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../shared/AppContext';
import { getBrandDataUrl } from '../../shared/qr';
import type { QRRecord } from '../../shared/types';
import { getThemeTokens } from '../../shared/color';
import { basePath, pageHref, useRoute } from '../../shared/routes.web';

export function useWebsite() {
    const app = useApp();
    const route = useRoute();
    const [accountOpen, setAccountOpen] = useState(false);
    const [editing, setEditing] = useState<QRRecord | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const tokens = useMemo<Record<string, string>>(() => {
        const rgb = app.accent.slice(1).match(/.{2}/g)?.map((channel) => parseInt(channel, 16)) || [94, 59, 190];
        const brightness = rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114;
        return {
            ...getThemeTokens(app.accent, app.theme),
            '--on-accent': brightness > 155 ? `#171020` : `#FFFFFF`,
        };
    }, [app.accent, app.theme]);

    useEffect(() => {
        document.documentElement.style.colorScheme = app.theme;
        document.body.style.backgroundColor = tokens[`--bg`];
        document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`, app.accent);
        document.getElementById(`qr-favicon`)?.setAttribute(`href`, getBrandDataUrl(app.accent));
    }, [tokens, app.accent, app.theme]);

    useEffect(() => {
        const name = route.page === `home` ? `Your links. Your look.` : route.page === `library` ? `My QR codes` : `${route.page[0].toUpperCase()}${route.page.slice(1)}`;
        document.title = `QR Code GenR8 — ${name}`;
        setMenuOpen(false);
    }, [route.page]);

    useEffect(() => {
        if (process.env.NODE_ENV !== `production` || !(`serviceWorker` in navigator)) return;
        const register = () => {
            void navigator.serviceWorker.register(`${basePath}sw.js`, { scope: basePath }).catch(() => {
                // The generator remains usable when offline installation is unavailable.
            });
        };
        if (document.readyState === `complete`) register();
        else window.addEventListener(`load`, register, { once: true });
        return () => window.removeEventListener(`load`, register);
    }, []);

    function editRecord(record: QRRecord) {
        setEditing(record);
        route.navigate(`home`);
    }

    function createNew() {
        setEditing(null);
        route.navigate(`home`);
    }

    return { ...app, ...route, tokens, editing, menuOpen, accountOpen, pageHref, createNew, editRecord, setMenuOpen, setAccountOpen };
}

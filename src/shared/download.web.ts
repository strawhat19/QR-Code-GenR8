import type { QRSettings } from './types';
import { buildQrSvg, resolveLogo } from './qr';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

async function embedLogo(url?: string): Promise<string | undefined> {
    if (!url || url.startsWith(`data:image/`)) return url;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch(url, {
            mode: `cors`,
            credentials: `omit`,
            referrerPolicy: `no-referrer`,
            signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Image unavailable`);
        const blob = await response.blob();
        if (!blob.type.startsWith(`image/`) || blob.size > MAX_IMAGE_BYTES) throw new Error(`Invalid image`);
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error(`Image could not be read`));
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(blob);
        });
    } catch {
        throw new Error(`This image host blocks downloads. Use an image URL with CORS enabled, choose the GenR8 logo, or turn the logo off.`);
    } finally {
        clearTimeout(timeout);
    }
}

function triggerDownload(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement(`a`);
    link.id = `qr-export-download-link`;
    link.className = `qr-export-download-link`;
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadQr(settings: QRSettings, payload: string, format: `svg` | `png`) {
    const logoUrl = await embedLogo(resolveLogo(settings, payload));
    const svg = buildQrSvg({ payload, color: settings.color, logoUrl });
    const name = `genr8-${settings.contentType}-${Date.now()}`;

    if (format === `svg`) {
        triggerDownload(new Blob([svg], { type: `image/svg+xml;charset=utf-8` }), `${name}.svg`);
        return;
    }

    const canvas = document.createElement(`canvas`);
    canvas.id = `qr-export-canvas`;
    canvas.className = `qr-export-canvas`;
    canvas.width = 2048;
    canvas.height = 2048;
    const context = canvas.getContext(`2d`);
    if (!context) throw new Error(`Your browser could not create an image. Try the SVG download.`);

    const objectUrl = URL.createObjectURL(new Blob([svg], { type: `image/svg+xml` }));
    try {
        const image = new Image();
        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error(`Your browser could not render this logo. Try SVG or the GenR8 logo.`));
            image.src = objectUrl;
        });
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, 2048, 2048);
        const png = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error(`PNG export is unavailable. Try SVG.`)), `image/png`);
        });
        triggerDownload(png, `${name}.png`);
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

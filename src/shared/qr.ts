import qrcode from 'qrcode-generator';
import type { QRSettings } from './types';
import { qrInkColor } from './color';
import { getBrandDataUrl } from './brand';

export { getBrandSvg, getBrandDataUrl } from './brand';

export interface QRMatrix {
    size: number;
    path: string;
}

const MAX_PAYLOAD_BYTES = 1100;
const matrixCache = new Map<string, QRMatrix>();

// A platform-independent UTF-8 encoder also preserves emoji on native devices.
function toUtf8(input: string): number[] {
    const bytes: number[] = [];

    for (const character of input) {
        let code = character.codePointAt(0)!;
        if (code >= 0xD800 && code <= 0xDFFF) code = 0xFFFD;

        if (code < 0x80) bytes.push(code);
        else if (code < 0x800) bytes.push(0xC0 | code >> 6, 0x80 | code & 0x3F);
        else if (code < 0x10000) bytes.push(0xE0 | code >> 12, 0x80 | code >> 6 & 0x3F, 0x80 | code & 0x3F);
        else bytes.push(0xF0 | code >> 18, 0x80 | code >> 12 & 0x3F, 0x80 | code >> 6 & 0x3F, 0x80 | code & 0x3F);
    }

    return bytes;
}

qrcode.stringToBytes = toUtf8;

function validateSize(payload: string): string {
    if (!payload.trim()) throw new Error(`Add something to turn into a QR code.`);
    if (toUtf8(payload).length > MAX_PAYLOAD_BYTES) {
        throw new Error(`This is too long for a clear QR code. Try a shorter link or message.`);
    }

    return payload;
}

function httpUrl(input: string): URL {
    const value = input.trim();
    const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(value);
    let url: URL;

    try { url = new URL(hasProtocol ? value : `https://${value}`); }
    catch { throw new Error(`Enter a valid website address, like https://example.com.`); }

    if (![`http:`, `https:`].includes(url.protocol) || !url.hostname) {
        throw new Error(`Use a website address beginning with http:// or https://.`);
    }

    return url;
}

const escapeWifi = (value: string) => value.replace(/([\\;,:"])/g, `\\$1`);

export function buildPayload(settings: QRSettings): string {
    let payload: string;
    const content = settings.content.trim();

    if (settings.contentType === `url`) {
        if (!content) throw new Error(`Enter the website address for your QR code.`);
        payload = httpUrl(content).href;
    } else if (settings.contentType === `text`) {
        payload = settings.content;
    } else if (settings.contentType === `email`) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content)) throw new Error(`Enter a valid email address.`);

        const query: string[] = [];
        if (settings.emailSubject) query.push(`subject=${encodeURIComponent(settings.emailSubject)}`);
        if (settings.emailBody) query.push(`body=${encodeURIComponent(settings.emailBody)}`);
        payload = `mailto:${encodeURIComponent(content).replace(/%40/g, `@`)}${query.length ? `?${query.join(`&`)}` : ``}`;
    } else if (settings.contentType === `wifi`) {
        if (!content) throw new Error(`Enter your Wi-Fi network name.`);
        if (settings.wifiSecurity !== `nopass` && !settings.wifiPassword) throw new Error(`Enter the network password, or choose an open network.`);

        const password = settings.wifiSecurity === `nopass` ? `` : `P:${escapeWifi(settings.wifiPassword)};`;
        payload = `WIFI:T:${settings.wifiSecurity};S:${escapeWifi(settings.content)};${password}H:${settings.wifiHidden ? `true` : `false`};;`;
    } else {
        throw new Error(`Choose a supported QR content type.`);
    }

    return validateSize(payload);
}

export function getMatrix(payload: string): QRMatrix {
    const cached = matrixCache.get(payload);
    if (cached) return cached;

    validateSize(payload);
    const symbol = qrcode(0, `H`);
    symbol.addData(payload, `Byte`);
    symbol.make();

    const count = symbol.getModuleCount();
    const segments: string[] = [];

    for (let row = 0; row < count; row += 1) {
        let col = 0;
        while (col < count) {
            if (!symbol.isDark(row, col)) { col += 1; continue; }

            const start = col;
            while (col < count && symbol.isDark(row, col)) col += 1;
            const width = col - start;
            segments.push(`M${start + 4} ${row + 4}h${width}v1h-${width}z`);
        }
    }

    // Keep the four-module quiet zone and every original module intact.
    const matrix = { size: count + 8, path: segments.join(``) };
    if (matrixCache.size >= 8) matrixCache.delete(matrixCache.keys().next().value!);
    matrixCache.set(payload, matrix);
    return matrix;
}

function isPublicImageUrl(input: string): boolean {
    try {
        const url = new URL(input);
        const host = url.hostname.toLowerCase();
        if (![`http:`, `https:`].includes(url.protocol) || url.username || url.password) return false;
        if (host === `localhost` || host.endsWith(`.localhost`) || host.endsWith(`.local`)) return false;
        if (host.startsWith(`[`) || /^127\./.test(host) || /^0\./.test(host) || /^10\./.test(host)) return false;
        if (/^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
        return Boolean(host);
    } catch { return false; }
}

export function resolveLogo(settings: QRSettings, payload: string): string | undefined {
    if (!settings.includeLogo) return undefined;
    if (settings.logoMode === `brand`) return getBrandDataUrl(settings.color);
    if (settings.logoMode === `custom`) {
        const url = settings.customLogoUrl.trim();
        if (!url) return undefined;
        if (!isPublicImageUrl(url)) throw new Error(`Use a public image URL beginning with http:// or https://.`);
        return url;
    }

    if (settings.contentType !== `url`) return getBrandDataUrl(settings.color);
    const url = httpUrl(payload);
    return `${url.origin}/favicon.ico`;
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
    [`&`]: `&amp;`,
    [`<`]: `&lt;`,
    [`>`]: `&gt;`,
    [`"`]: `&quot;`,
    [`'`]: `&apos;`,
}[character]!));

export function buildQrSvg({ payload, color, logoUrl }: {
    payload: string;
    color: string;
    logoUrl?: string;
}): string {
    const { size, path } = getMatrix(payload);
    const symbolSize = size - 8;
    const logoSize = symbolSize * 0.13;
    const plateSize = symbolSize * 0.16;
    const center = size / 2;
    const logo = logoUrl
        ? `<rect x="${center - plateSize / 2}" y="${center - plateSize / 2}" width="${plateSize}" height="${plateSize}" rx="0.6" fill="#FFFFFF"/><image href="${escapeXml(logoUrl)}" x="${center - logoSize / 2}" y="${center - logoSize / 2}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/>`
        : ``;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="1024" height="1024" role="img" aria-labelledby="qr-title"><title id="qr-title">Generated QR code</title><rect width="${size}" height="${size}" fill="#FFFFFF"/><path d="${path}" fill="${qrInkColor(color)}" shape-rendering="crispEdges"/>${logo}</svg>`;
}

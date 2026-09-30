import type { QRSettings } from './types';

export const useLocalStorage = true;
export const DEFAULT_ACCENT = `#5E3BBE`;
export const STORAGE_KEY = `qr-code-genr8:v1`;
export const APP_URL = typeof window !== `undefined`
    ? `${window.location.origin}${window.location.pathname}`
    : `https://piratechs.com/apps/Library/Tools/QR-Code-GenR8/`;

export const defaultSettings: QRSettings = {
    emailBody: ``,
    emailSubject: ``,
    content: APP_URL,
    logoMode: `brand`,
    contentType: `url`,
    customLogoUrl: ``,
    wifiHidden: false,
    wifiPassword: ``,
    includeLogo: true,
    wifiSecurity: `WPA`,
    color: DEFAULT_ACCENT,
};

import type { Theme } from './types';
import { DEFAULT_ACCENT } from './config';

export interface HSV {
    h: number;
    s: number;
    v: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function isHexColor(color: string): boolean {
    return /^#[\da-f]{6}$/i.test(color);
}

function hexToRgb(color: string): [number, number, number] {
    const safeColor = isHexColor(color) ? color : DEFAULT_ACCENT;
    return [1, 3, 5].map((start) => parseInt(safeColor.slice(start, start + 2), 16)) as [number, number, number];
}

function rgbToHex(rgb: number[]): string {
    return `#${rgb.map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, `0`)).join(``)}`.toUpperCase();
}

export function hexToHsv(color: string): HSV {
    const [r, g, b] = hexToRgb(color).map((channel) => channel / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;

    if (delta) {
        if (max === r) hue = ((g - b) / delta) % 6;
        if (max === g) hue = (b - r) / delta + 2;
        if (max === b) hue = (r - g) / delta + 4;
    }

    return {
        h: ((hue * 60) + 360) % 360,
        s: max ? delta / max * 100 : 0,
        v: max * 100,
    };
}

export function hsvToHex({ h, s, v }: HSV): string {
    const hue = ((h % 360) + 360) % 360 / 60;
    const value = clamp(v / 100);
    const chroma = value * clamp(s / 100);
    const x = chroma * (1 - Math.abs(hue % 2 - 1));
    const m = value - chroma;
    const rgb = hue < 1 ? [chroma, x, 0]
        : hue < 2 ? [x, chroma, 0]
        : hue < 3 ? [0, chroma, x]
        : hue < 4 ? [0, x, chroma]
        : hue < 5 ? [x, 0, chroma]
        : [chroma, 0, x];

    return rgbToHex(rgb.map((channel) => (channel + m) * 255));
}

function luminance(rgb: number[]): number {
    const channels = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function qrInkColor(color: string): string {
    const rgb = hexToRgb(color);
    let scale = 1;

    while (luminance(rgb.map((channel) => channel * scale)) > 0.18) scale -= 0.02;
    return rgbToHex(rgb.map((channel) => channel * scale));
}

export function getThemeTokens(accent: string, theme: Theme): Record<string, string> {
    const rgb = hexToRgb(accent);
    const color = rgbToHex(rgb);
    const dark = theme === `dark`;
    const mix = (amount: number, base: number) => rgbToHex(rgb.map((channel) => channel * amount + base * (1 - amount)));

    return {
        [`--accent`]: color,
        [`--accent-rgb`]: rgb.join(`, `),
        [`--accent-soft`]: mix(dark ? 0.34 : 0.1, dark ? 22 : 255),
        [`--accent-text`]: dark ? mix(0.42, 255) : qrInkColor(color),
        [`--bg`]: dark ? mix(0.22, 10) : mix(0.045, 255),
        [`--surface`]: dark ? mix(0.24, 20) : `#FFFFFF`,
        [`--surface-raised`]: dark ? mix(0.23, 31) : mix(0.065, 255),
        [`--line`]: dark ? mix(0.3, 56) : mix(0.16, 230),
        [`--text`]: dark ? `#FCFAFF` : `#221B35`,
        [`--muted`]: dark ? mix(0.13, 192) : `#736A86`,
        [`--on-accent`]: luminance(rgb) > 0.35 ? `#181222` : `#FFFFFF`,
        [`--qr-ink`]: qrInkColor(color),
    };
}

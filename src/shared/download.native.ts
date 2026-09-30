import { fetch } from 'expo/fetch';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { buildQrSvg } from './qr';

type NativeExportOptions = {
    color: string;
    payload: string;
    logoUrl?: string;
};

async function embedPublicLogo(logoUrl?: string) {
    if (!logoUrl || logoUrl.startsWith(`data:`)) return logoUrl;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
        const response = await fetch(logoUrl, { signal: controller.signal });
        const mimeType = response.headers.get(`content-type`)?.split(`;`)[0];

        if (!response.ok || !mimeType?.startsWith(`image/`)) {
            throw new Error(`That logo could not be downloaded. Try another public image URL.`);
        }

        if (Number(response.headers.get(`content-length`)) > 2_000_000) {
            throw new Error(`Choose a logo image smaller than 2 MB.`);
        }

        const bytes = await response.bytes();

        if (bytes.byteLength > 2_000_000) {
            throw new Error(`Choose a logo image smaller than 2 MB.`);
        }

        const image = new File(Paths.cache, `genr8-logo-${Date.now()}.bin`);

        try {
            image.create();
            image.write(bytes);

            return `data:${mimeType};base64,${await image.base64()}`;
        } finally {
            if (image.exists) image.delete();
        }
    } catch (caught) {
        if (controller.signal.aborted) {
            throw new Error(`The logo image took too long to load. Try another URL or turn the logo off.`);
        }

        throw caught;
    } finally {
        clearTimeout(timeout);
    }
}

export async function exportNativeQr(options: NativeExportOptions) {
    if (!await Sharing.isAvailableAsync()) {
        throw new Error(`File sharing is unavailable on this device.`);
    }

    const logoUrl = await embedPublicLogo(options.logoUrl);
    const svg = buildQrSvg({ ...options, logoUrl });
    const file = new File(Paths.cache, `qr-genr8-${Date.now()}.svg`);

    file.create();
    file.write(svg);

    await Sharing.shareAsync(file.uri, {
        UTI: `public.svg-image`,
        mimeType: `image/svg+xml`,
        dialogTitle: `Export your QR code`,
    });
}

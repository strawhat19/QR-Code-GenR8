import type { NativePage } from '../NativeApp.logic';

export const nativePages: Record<NativePage, { title: string; paragraphs: string[] }> = {
    about: {
        title: `Small codes. Big possibilities.`,
        paragraphs: [
            `QR Code GenR8 is a little tool for connecting the real world to your next idea. Turn links, text, email, and Wi-Fi details into QR codes, then give them a color and logo of their own.`,
            `You can create and export codes without an account. A local profile keeps your saved library together on this device. Built by Piratechs.`,
        ],
    },
    terms: {
        title: `Terms of use`,
        paragraphs: [
            `Use QR Code GenR8 to generate codes for content you have the right to share. You are responsible for the destination, text, and images included in your codes. Do not use the tool for deceptive, unlawful, or harmful content.`,
            `The tool is provided as available. Scan your final code before printing or sharing it, especially after adding a custom logo. Generated codes are static: changing a destination requires a new QR code.`,
            `Local profiles and saved libraries are stored on this device. Clearing app data or uninstalling the app can remove them. There is currently no cloud backup or account recovery.`,
        ],
    },
    contact: {
        title: `Let’s stay connected.`,
        paragraphs: [
            `Have an idea, found a problem, or want to build something together? Visit Piratechs to get in touch with the team behind QR Code GenR8.`,
        ],
    },
    privacy: {
        title: `Your codes stay yours.`,
        paragraphs: [
            `QR generation happens on your device. Your selected color, theme, local profile, and saved codes are stored in device storage. No backend account, cloud synchronization, or analytics service is connected.`,
            `Choosing a website icon or a public custom image asks that image’s host for the file. That host can receive the usual connection details, such as your IP address. The image is embedded in exported SVG files so it can travel with your code.`,
            `A local profile uses your name and email to organize this device’s library. It does not verify your identity or provide secure authentication. You can delete saved QR codes from your library or clear app data to remove all locally stored information.`,
        ],
    },
};

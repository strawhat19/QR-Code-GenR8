export type ContentType = `url` | `text` | `email` | `wifi`;
export type LogoMode = `brand` | `site` | `custom`;
export type Theme = `dark` | `light`;

export interface QRSettings {
    color: string;
    content: string;
    includeLogo: boolean;
    logoMode: LogoMode;
    contentType: ContentType;
    customLogoUrl: string;
    emailBody: string;
    emailSubject: string;
    wifiHidden: boolean;
    wifiPassword: string;
    wifiSecurity: `WPA` | `WEP` | `nopass`;
}

export interface QRRecord extends QRSettings {
    id: string;
    title: string;
    payload: string;
    createdAt: string;
    ownerId: string | null;
}

export type QRSaveSettings = QRSettings & { id?: string };

export interface LocalUser {
    id: string;
    name: string;
    email: string;
}

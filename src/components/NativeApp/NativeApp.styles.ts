import { StyleSheet } from 'react-native';
import { qrInkColor } from '../../shared/color';

function shade(hex: string, amount: number) {
    const channels = [1, 3, 5].map((offset) => {
        return Math.round(parseInt(hex.slice(offset, offset + 2), 16) * amount);
    });

    return `rgb(${channels.join(`, `)})`;
}

function lightness(hex: string) {
    const [red, green, blue] = [1, 3, 5].map((offset) => {
        const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;

        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function tint(hex: string, amount: number) {
    const channels = [1, 3, 5].map((offset) => {
        const channel = parseInt(hex.slice(offset, offset + 2), 16);

        return Math.round(channel + (255 - channel) * amount);
    });

    return `rgb(${channels.join(`, `)})`;
}

export function createNativeStyles(accent: string, theme: `dark` | `light`) {
    const dark = theme === `dark`;
    const ink = dark ? `#FFFFFF` : `#241831`;
    const muted = dark ? `#D5CBE5` : `#746780`;
    const panel = dark ? shade(accent, 0.35) : `#FFFFFF`;
    const canvas = dark ? qrInkColor(accent) : tint(accent, 0.96);
    const field = dark ? shade(accent, 0.25) : tint(accent, 0.97);
    const line = dark ? `rgba(255,255,255,0.13)` : tint(accent, 0.85);
    const buttonInk = lightness(accent) > 0.179 ? `#000000` : `#FFFFFF`;

    return StyleSheet.create({
        screen: { flex: 1, backgroundColor: canvas },
        content: { gap: 18, padding: 20, paddingBottom: 32 },
        header: { gap: 12, flexDirection: `row`, alignItems: `center` },
        brand: { flex: 1, gap: 9, flexDirection: `row`, alignItems: `center` },
        brandCopy: { gap: 3 },
        brandName: { color: ink, fontSize: 17, fontWeight: `800`, letterSpacing: -0.6 },
        brandTagline: { color: dark ? `#E7DDFB` : muted, fontSize: 10, letterSpacing: 1.7 },
        headerAction: { height: 42, minWidth: 42, borderRadius: 14, alignItems: `center`, justifyContent: `center`, backgroundColor: dark ? `rgba(255,255,255,0.13)` : tint(accent, 0.9) },
        headerIcon: { color: ink, fontSize: 21 },
        hero: { gap: 9, paddingTop: 8 },
        eyebrow: { color: dark ? `#E7DDFB` : muted, fontSize: 11, fontWeight: `600`, letterSpacing: 1.8 },
        heading: { color: ink, fontSize: 34, fontWeight: `800`, lineHeight: 36, letterSpacing: -1.4 },
        introduction: { color: dark ? `#ECE3FA` : muted, maxWidth: 330, fontSize: 14, lineHeight: 21 },
        card: { gap: 19, padding: 20, borderWidth: 1, borderColor: line, borderRadius: 26, backgroundColor: panel },
        toolTopRow: { gap: 12, flexDirection: `row`, alignItems: `center` },
        contentField: { flex: 1 },
        previewSection: { gap: 9, alignItems: `center` },
        previewFrame: { padding: 10, borderRadius: 19, backgroundColor: `#FFFFFF` },
        previewMeta: { color: muted, fontSize: 11, letterSpacing: 0.5 },
        typeRow: { gap: 6, flexDirection: `row` },
        typeButton: { flex: 1, gap: 4, paddingVertical: 11, borderWidth: 1, borderColor: line, borderRadius: 12, alignItems: `center`, backgroundColor: field },
        typeButtonActive: { borderColor: accent, backgroundColor: dark ? shade(accent, 0.45) : tint(accent, 0.9) },
        typeIcon: { color: ink, fontSize: 15 },
        typeLabel: { color: muted, fontSize: 10, fontWeight: `600` },
        typeLabelActive: { color: dark ? `#FFFFFF` : accent },
        group: { gap: 9 },
        label: { color: ink, fontSize: 12, fontWeight: `600` },
        input: { color: ink, minHeight: 48, padding: 14, borderWidth: 1, borderColor: line, borderRadius: 12, backgroundColor: field, fontSize: 13 },
        multiline: { minHeight: 90, textAlignVertical: `top` },
        colorHeader: { gap: 12, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
        hexInput: { color: ink, width: 98, paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderColor: line, borderRadius: 9, fontSize: 12, fontFamily: `monospace` },
        hueTrack: { height: 30, borderRadius: 15, justifyContent: `center` },
        hueSpectrum: { height: 15, overflow: `hidden`, borderRadius: 8, flexDirection: `row` },
        hueSegment: { flex: 1, height: 15 },
        hueThumb: { position: `absolute`, width: 26, height: 26, borderWidth: 4, borderColor: `#FFFFFF`, borderRadius: 14, elevation: 3, shadowColor: `#000000`, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
        helper: { color: muted, fontSize: 11, lineHeight: 16 },
        switchRow: { gap: 15, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
        switchCopy: { flex: 1, gap: 4 },
        logoRow: { gap: 6, flexDirection: `row`, flexWrap: `wrap` },
        logoChoice: { gap: 6, padding: 10, borderWidth: 1, borderColor: line, borderRadius: 10, flexDirection: `row`, alignItems: `center` },
        logoLabel: { color: ink, fontSize: 11 },
        actionRow: { gap: 8, flexDirection: `row` },
        button: { flex: 1, gap: 8, minHeight: 49, padding: 12, borderRadius: 14, flexDirection: `row`, alignItems: `center`, justifyContent: `center`, backgroundColor: accent },
        secondaryButton: { borderWidth: 1, borderColor: line, backgroundColor: field },
        buttonText: { color: buttonInk, fontSize: 13, fontWeight: `700` },
        secondaryButtonText: { color: ink },
        disabled: { opacity: 0.4 },
        error: { color: dark ? `#FFB7C5` : `#AD2841`, fontSize: 12, lineHeight: 18 },
        notice: { color: ink, padding: 12, borderRadius: 12, backgroundColor: dark ? `rgba(255,255,255,0.12)` : tint(accent, 0.9), fontSize: 12, lineHeight: 17 },
        benefits: { gap: 13, flexDirection: `row`, justifyContent: `space-between` },
        benefit: { flex: 1, gap: 7, alignItems: `center` },
        benefitIcon: { color: dark ? `#E9DFFD` : accent, fontSize: 21 },
        benefitText: { color: dark ? `#ECE3FA` : muted, fontSize: 10, textAlign: `center`, lineHeight: 15 },
        libraryHeading: { color: ink, fontSize: 21, fontWeight: `700`, letterSpacing: -0.4 },
        libraryAction: { gap: 10, padding: 17, borderWidth: 1, borderColor: line, borderRadius: 20, flexDirection: `row`, alignItems: `center`, backgroundColor: panel },
        libraryCopy: { flex: 1, gap: 5 },
        footer: { gap: 13, paddingTop: 9, alignItems: `center` },
        footerLinks: { gap: 17, flexDirection: `row`, flexWrap: `wrap`, justifyContent: `center` },
        footerLink: { color: dark ? `#ECE3FA` : muted, fontSize: 11 },
        copyright: { color: dark ? `#E7DDFB` : muted, fontSize: 10 },
        modalScreen: { flex: 1, backgroundColor: dark ? shade(accent, 0.3) : canvas },
        modalContent: { gap: 20, padding: 24, paddingBottom: 36 },
        modalHeader: { gap: 16, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
        modalTitle: { flex: 1, color: ink, fontSize: 29, fontWeight: `800`, letterSpacing: -0.8 },
        closeButton: { width: 42, height: 42, borderRadius: 14, alignItems: `center`, justifyContent: `center`, backgroundColor: field },
        body: { color: muted, fontSize: 14, lineHeight: 23 },
        record: { gap: 13, padding: 15, borderWidth: 1, borderColor: line, borderRadius: 16, backgroundColor: panel },
        recordTitle: { color: ink, fontSize: 14, fontWeight: `700` },
        recordMeta: { color: muted, fontSize: 11 },
    });
}

export type NativeStyles = ReturnType<typeof createNativeStyles>;

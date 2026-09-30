import { memo, useEffect, useState } from 'react';
import { qrInkColor } from '../../../shared/color';
import Svg, { G, Path, Rect, Image, SvgXml, SvgUri } from 'react-native-svg';

type NativeQRCodeProps = {
    color: string;
    logoUrl?: string;
    dimension?: number;
    id?: string;
    matrix: { size: number; path: string };
};

export function brandXml(dataUrl: string) {
    return decodeURIComponent(dataUrl.slice(dataUrl.indexOf(`,`) + 1));
}

function NativeQRCode({ matrix, color, logoUrl, dimension = 188, id = `native-qr-preview` }: NativeQRCodeProps) {
    const [logoFailed, setLogoFailed] = useState(false);
    const plateSize = (matrix.size - 8) * 0.16;
    const logoSize = (matrix.size - 8) * 0.13;
    const logoStart = (matrix.size - logoSize) / 2;
    const plateStart = (matrix.size - plateSize) / 2;

    useEffect(() => { setLogoFailed(false); }, [logoUrl]);

    return (
        <Svg
            id={id}
            nativeID={id}
            width={dimension}
            height={dimension}
            accessibilityLabel={`Your generated QR code`}
            viewBox={`0 0 ${matrix.size} ${matrix.size}`}
        >
            <Rect id={`${id}-paper`} width={matrix.size} height={matrix.size} fill={`#FFFFFF`} />
            <Path id={`${id}-modules`} d={matrix.path} fill={qrInkColor(color)} />
            {logoUrl && !logoFailed && (
                <G id={`${id}-center-logo`}>
                    <Rect
                        id={`${id}-logo-plate`}
                        x={plateStart}
                        y={plateStart}
                        width={plateSize}
                        height={plateSize}
                        rx={0.6}
                        fill={`#FFFFFF`}
                    />
                    <G id={`${id}-logo-image-container`} transform={`translate(${logoStart} ${logoStart})`}>
                        {logoUrl.startsWith(`data:image/svg+xml`) ? (
                            <SvgXml xml={brandXml(logoUrl)} width={logoSize} height={logoSize} />
                        ) : /\.svg(?:\?|$)/i.test(logoUrl) ? (
                            <SvgUri
                                uri={logoUrl}
                                width={logoSize}
                                height={logoSize}
                                onError={() => setLogoFailed(true)}
                            />
                        ) : (
                            <Image
                                id={`${id}-logo-image`}
                                href={{ uri: logoUrl }}
                                width={logoSize}
                                height={logoSize}
                                preserveAspectRatio={`xMidYMid meet`}
                            />
                        )}
                    </G>
                </G>
            )}
        </Svg>
    );
}

export default memo(NativeQRCode);

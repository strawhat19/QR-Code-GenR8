import { memo, useMemo, useState, useEffect } from 'react';
import { getMatrix } from '../../shared/qr';
import { qrInkColor } from '../../shared/color';

type QRPreviewProps = {
    id?: string;
    size?: number;
    color: string;
    payload: string;
    logoUrl?: string;
    className?: string;
    onLogoError?: () => void;
};

export const QRPreview = memo(function QRPreview({
    color, payload, logoUrl, onLogoError,
    size = 220, id = `qr-preview-svg`, className = ``,
}: QRPreviewProps) {
    const matrix = useMemo(() => getMatrix(payload), [payload]);
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const plate = (matrix.size - 8) * .16;
    const logo = (matrix.size - 8) * .13;
    const center = matrix.size / 2;

    useEffect(() => { setFailedUrl(null); }, [logoUrl]);

    return (
        <svg
            id={id}
            role={`img`}
            width={size}
            height={size}
            xmlns={`http://www.w3.org/2000/svg`}
            className={`qr-preview-svg ${className}`}
            aria-labelledby={`${id}-title`}
            viewBox={`0 0 ${matrix.size} ${matrix.size}`}
        >
            <title id={`${id}-title`} className={`qr-preview-title`}>
                {`QR code for ${payload.slice(0, 120)}`}
            </title>
            <rect
                x={0}
                y={0}
                fill={`#FFFFFF`}
                width={matrix.size}
                height={matrix.size}
                id={`${id}-background`}
                className={`qr-preview-background`}
            />
            <path
                d={matrix.path}
                fill={qrInkColor(color)}
                shapeRendering={`crispEdges`}
                id={`${id}-modules`}
                className={`qr-preview-modules`}
            />
            {logoUrl && failedUrl !== logoUrl && (
                <g id={`${id}-logo-group`} className={`qr-preview-logo-group`}>
                    <rect
                        rx={1}
                        width={plate}
                        height={plate}
                        fill={`#FFFFFF`}
                        x={center - plate / 2}
                        y={center - plate / 2}
                        id={`${id}-logo-plate`}
                        className={`qr-preview-logo-plate`}
                    />
                    <image
                        width={logo}
                        height={logo}
                        href={logoUrl}
                        x={center - logo / 2}
                        y={center - logo / 2}
                        id={`${id}-center-logo`}
                        className={`qr-preview-center-logo`}
                        preserveAspectRatio={`xMidYMid meet`}
                        onError={() => { setFailedUrl(logoUrl); onLogoError?.(); }}
                    />
                </g>
            )}
        </svg>
    );
});

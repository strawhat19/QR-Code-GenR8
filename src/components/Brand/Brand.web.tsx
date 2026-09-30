import './Brand.scss';
import { useApp } from '../../shared/AppContext';
import { getBrandDataUrl } from '../../shared/qr';

export function Brand({ id = `brand`, compact = false }: { id?: string; compact?: boolean }) {
    const { accent } = useApp();

    return (
        <span id={id} className={`brand ${compact ? `brand--compact` : ``}`}>
            <img
                width={48}
                height={48}
                alt={`QR Code GenR8 icon`}
                src={getBrandDataUrl(accent)}
                id={`${id}-icon`}
                className={`brand-icon`}
            />
            {!compact && (
                <span id={`${id}-wordmark`} className={`brand-wordmark`}>
                    <span id={`${id}-name`} className={`brand-name`}>
                        {`QR Code `}
                    </span>
                    <span id={`${id}-genr8`} className={`brand-genr8`}>
                        {`GenR8`}
                    </span>
                </span>
            )}
        </span>
    );
}

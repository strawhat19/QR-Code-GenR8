import './ColorPicker.scss';
import { Icon } from '../Icon/Icon.web';
import { useColorPicker } from './useColorPicker';

const swatches = [`#5E3BBE`, `#3D70FF`, `#DA4566`, `#137B68`, `#B46B18`];

type ColorPickerProps = {
    color: string;
    onChange: (color: string) => void;
};

export function ColorPicker({ color, onChange }: ColorPickerProps) {
    const picker = useColorPicker(color, onChange);

    return (
        <div id={`color-picker`} className={`color-picker`}>
            <div id={`color-picker-heading`} className={`color-picker-heading`}>
                <label htmlFor={`color-hex-input`} id={`color-picker-label`} className={`field-label`}>
                    {`Make it your color`}
                </label>
                <span id={`color-picker-live-label`} className={`color-picker-live-label`}>
                    <span id={`color-picker-live-dot`} className={`color-picker-live-dot`} />
                    {`LIVE THEME`}
                </span>
            </div>
            <div id={`color-picker-controls`} className={`color-picker-controls`}>
                <div
                    tabIndex={0}
                    role={`slider`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(picker.hsv.s)}
                    aria-valuetext={`${Math.round(picker.hsv.s)}% saturation, ${Math.round(picker.hsv.v)}% brightness`}
                    aria-label={`Color field. Left and right adjust saturation; up and down adjust brightness.`}
                    id={`color-saturation-dragger`}
                    className={`color-saturation-dragger`}
                    style={{ backgroundColor: `hsl(${picker.hsv.h}, 100%, 50%)` }}
                    onPointerUp={picker.pointerUp}
                    onPointerCancel={picker.pointerUp}
                    onLostPointerCapture={picker.pointerUp}
                    onKeyDown={(event) => picker.keyboard(event, `field`)}
                    onPointerDown={(event) => picker.pointerDown(event, `field`)}
                    onPointerMove={(event) => picker.pointerMove(event, `field`)}
                >
                    <span
                        aria-hidden={true}
                        id={`color-saturation-thumb`}
                        className={`color-saturation-thumb`}
                        style={{ left: `${picker.hsv.s}%`, top: `${100 - picker.hsv.v}%` }}
                    />
                </div>
                <div id={`color-picker-values`} className={`color-picker-values`}>
                    <div
                        tabIndex={0}
                        role={`slider`}
                        aria-valuemin={0}
                        aria-valuemax={360}
                        aria-valuenow={Math.round(picker.hsv.h)}
                        aria-label={`Color hue`}
                        id={`color-hue-dragger`}
                        className={`color-hue-dragger`}
                        onPointerUp={picker.pointerUp}
                        onPointerCancel={picker.pointerUp}
                        onLostPointerCapture={picker.pointerUp}
                        onKeyDown={(event) => picker.keyboard(event, `hue`)}
                        onPointerDown={(event) => picker.pointerDown(event, `hue`)}
                        onPointerMove={(event) => picker.pointerMove(event, `hue`)}
                    >
                        <span
                            aria-hidden={true}
                            id={`color-hue-thumb`}
                            className={`color-hue-thumb`}
                            style={{ left: `${picker.hsv.h / 3.6}%` }}
                        />
                    </div>
                    <div id={`color-hex-field`} className={`color-hex-field`}>
                        <span id={`color-hex-preview`} className={`color-hex-preview`} style={{ background: color }} />
                        <input
                            type={`text`}
                            maxLength={7}
                            spellCheck={false}
                            value={picker.hex}
                            id={`color-hex-input`}
                            className={`color-hex-input`}
                            aria-label={`Theme color hexadecimal value`}
                            onBlur={() => picker.setHex(color.toUpperCase())}
                            onChange={(event) => picker.changeHex(event.target.value)}
                        />
                        <Icon name={`palette`} size={14} id={`color-hex-palette-icon`} />
                    </div>
                    <div id={`color-swatches`} className={`color-swatches`}>
                        {swatches.map((swatch, index) => (
                            <button
                                type={`button`}
                                key={swatch}
                                id={`color-swatch-${index}`}
                                className={`color-swatch`}
                                title={`Use ${swatch}`}
                                aria-label={`Use ${swatch}`}
                                aria-pressed={color.toLowerCase() === swatch.toLowerCase()}
                                style={{ backgroundColor: swatch }}
                                onClick={() => onChange(swatch)}
                            >
                                {color.toLowerCase() === swatch.toLowerCase() && (
                                    <Icon name={`check`} size={12} id={`color-swatch-check-${index}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import './Generator.scss';
import { Icon } from '../Icon/Icon.web';
import { useGenerator } from './useGenerator';
import { qrInkColor } from '../../shared/color';
import { QRPreview } from '../QRPreview/QRPreview.web';
import { ColorPicker } from '../ColorPicker/ColorPicker.web';
import type { ContentType, QRRecord, LogoMode } from '../../shared/types';

const contentTypes: { type: ContentType; label: string; icon: string }[] = [
    { type: `url`, label: `Link`, icon: `link` },
    { type: `text`, label: `Text`, icon: `text` },
    { type: `email`, label: `Email`, icon: `mail` },
    { type: `wifi`, label: `Wi-Fi`, icon: `wifi` },
];
const logoModes: { mode: LogoMode; label: string; icon: string }[] = [
    { mode: `brand`, label: `GenR8`, icon: `sparkles` },
    { mode: `site`, label: `Site icon`, icon: `globe` },
    { mode: `custom`, label: `Image URL`, icon: `image` },
];
const contentLabels: Record<ContentType, string> = {
    url: `Where should your code go?`,
    text: `What should your code say?`,
    email: `Who should get the email?`,
    wifi: `What's your network name?`,
};
const placeholders: Record<ContentType, string> = {
    url: `https://your-next-big-idea.com`,
    text: `A message worth sharing…`,
    email: `hello@example.com`,
    wifi: `Your Wi-Fi network`,
};

export function Generator({ record }: { record?: QRRecord | null }) {
    const tool = useGenerator(record);
    const { settings } = tool;
    const paleColor = qrInkColor(tool.accent).toLowerCase() !== tool.accent.toLowerCase();

    return (
        <section id={`qr-generator`} className={`qr-generator`} aria-label={`Create your QR code`}>
            <div id={`generator-heading`} className={`generator-heading`}>
                <div id={`generator-heading-title`} className={`generator-heading-title`}>
                    <span id={`generator-heading-symbol`} className={`generator-heading-symbol`}>
                        <Icon name={`scan`} size={19} id={`generator-scan-icon`} />
                    </span>
                    <h2 id={`generator-title`} className={`generator-title`}>
                        {`Your QR studio`}
                    </h2>
                </div>
                <span id={`generator-free-label`} className={`generator-free-label`}>
                    <Icon name={`zap`} size={11} id={`generator-free-icon`} />
                    {`ALWAYS FREE`}
                </span>
            </div>
            <div id={`generator-workspace`} className={`generator-workspace`}>
                <div id={`generator-editor`} className={`generator-editor`}>
                    <div id={`generator-content-types`} className={`generator-content-types`} role={`group`} aria-label={`QR content type`}>
                        {contentTypes.map(({ type, label, icon }) => (
                            <button
                                key={type}
                                type={`button`}
                                id={`generator-type-${type}`}
                                className={`generator-type ${settings.contentType === type ? `is-active` : ``}`}
                                aria-pressed={settings.contentType === type}
                                onClick={() => tool.changeType(type)}
                            >
                                <Icon name={icon} size={14} id={`generator-type-${type}-icon`} />
                                <span id={`generator-type-${type}-label`} className={`generator-type-label`}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div id={`generator-content-field`} className={`generator-content-field`}>
                        <label htmlFor={`generator-content-input`} id={`generator-content-label`} className={`field-label`}>
                            {contentLabels[settings.contentType]}
                        </label>
                        <div id={`generator-input-wrap`} className={`generator-input-wrap`}>
                            {settings.contentType !== `text` && (
                                <Icon name={contentTypes.find((item) => item.type === settings.contentType)?.icon || `link`} size={15} id={`generator-input-icon`} />
                            )}
                            {settings.contentType === `text` ? (
                                <textarea
                                    rows={3}
                                    maxLength={600}
                                    value={settings.content}
                                    id={`generator-content-input`}
                                    className={`text-input generator-text-input`}
                                    placeholder={placeholders.text}
                                    aria-describedby={`generator-content-hint`}
                                    onChange={(event) => tool.update(`content`, event.target.value)}
                                />
                            ) : (
                                <input
                                    spellCheck={false}
                                    autoComplete={`off`}
                                    maxLength={600}
                                    value={settings.content}
                                    id={`generator-content-input`}
                                    className={`text-input generator-url-input`}
                                    type={settings.contentType === `email` ? `email` : `text`}
                                    inputMode={settings.contentType === `url` ? `url` : settings.contentType === `email` ? `email` : `text`}
                                    placeholder={placeholders[settings.contentType]}
                                    aria-describedby={`generator-content-hint`}
                                    onChange={(event) => tool.update(`content`, event.target.value)}
                                />
                            )}
                        </div>
                        <p id={`generator-content-hint`} className={`generator-content-hint`}>
                            {settings.contentType === `url` ? `Try it out — this link leads right back here.` : `Your preview updates as you type.`}
                        </p>
                    </div>
                    {settings.contentType === `email` && (
                        <div id={`generator-email-fields`} className={`generator-extra-fields`}>
                            <label id={`generator-email-subject-label`} htmlFor={`generator-email-subject`} className={`field-label`}>
                                {`Subject (optional)`}
                            </label>
                            <input
                                type={`text`}
                                maxLength={120}
                                value={settings.emailSubject}
                                id={`generator-email-subject`}
                                className={`text-input`}
                                placeholder={`Let's talk`}
                                onChange={(event) => tool.update(`emailSubject`, event.target.value)}
                            />
                            <label id={`generator-email-body-label`} htmlFor={`generator-email-body`} className={`field-label`}>
                                {`Message (optional)`}
                            </label>
                            <textarea
                                rows={2}
                                maxLength={300}
                                value={settings.emailBody}
                                id={`generator-email-body`}
                                className={`text-input`}
                                onChange={(event) => tool.update(`emailBody`, event.target.value)}
                            />
                        </div>
                    )}
                    {settings.contentType === `wifi` && (
                        <div id={`generator-wifi-fields`} className={`generator-extra-fields`}>
                            <div id={`generator-wifi-row`} className={`generator-wifi-row`}>
                                <div id={`generator-wifi-password-field`} className={`generator-wifi-password-field`}>
                                    <label id={`generator-wifi-password-label`} htmlFor={`generator-wifi-password`} className={`field-label`}>
                                        {`Password`}
                                    </label>
                                    <input
                                        type={`password`}
                                        autoComplete={`off`}
                                        maxLength={128}
                                        value={settings.wifiPassword}
                                        disabled={settings.wifiSecurity === `nopass`}
                                        id={`generator-wifi-password`}
                                        className={`text-input`}
                                        onChange={(event) => tool.update(`wifiPassword`, event.target.value)}
                                    />
                                </div>
                                <div id={`generator-wifi-security-field`} className={`generator-wifi-security-field`}>
                                    <label id={`generator-wifi-security-label`} htmlFor={`generator-wifi-security`} className={`field-label`}>
                                        {`Security`}
                                    </label>
                                    <select
                                        value={settings.wifiSecurity}
                                        id={`generator-wifi-security`}
                                        className={`text-input`}
                                        onChange={(event) => tool.update(`wifiSecurity`, event.target.value as QRRecord[`wifiSecurity`])}
                                    >
                                        <option id={`wifi-security-wpa`} className={`wifi-security-option`} value={`WPA`}>{`WPA / WPA2`}</option>
                                        <option id={`wifi-security-wep`} className={`wifi-security-option`} value={`WEP`}>{`WEP`}</option>
                                        <option id={`wifi-security-open`} className={`wifi-security-option`} value={`nopass`}>{`Open`}</option>
                                    </select>
                                </div>
                            </div>
                            <label id={`generator-hidden-network-label`} className={`generator-checkbox-label`}>
                                <input
                                    type={`checkbox`}
                                    checked={settings.wifiHidden}
                                    id={`generator-hidden-network`}
                                    className={`generator-checkbox`}
                                    onChange={(event) => tool.update(`wifiHidden`, event.target.checked)}
                                />
                                {`Hidden network`}
                            </label>
                        </div>
                    )}
                    <ColorPicker color={tool.accent} onChange={tool.setAccent} />
                    <div id={`generator-logo-settings`} className={`generator-logo-settings`}>
                        <div id={`generator-logo-heading`} className={`generator-logo-heading`}>
                            <span id={`generator-logo-title`} className={`generator-logo-title`}>
                                <Icon name={`image`} size={14} id={`generator-logo-icon`} />
                                {`Add a little identity`}
                            </span>
                            <button
                                type={`button`}
                                role={`switch`}
                                aria-label={`Include a center logo`}
                                aria-checked={settings.includeLogo}
                                id={`generator-logo-toggle`}
                                className={`generator-logo-toggle ${settings.includeLogo ? `is-on` : ``}`}
                                onClick={() => tool.update(`includeLogo`, !settings.includeLogo)}
                            >
                                <span id={`generator-logo-toggle-thumb`} className={`generator-logo-toggle-thumb`} />
                            </button>
                        </div>
                        {settings.includeLogo && (
                            <div id={`generator-logo-options`} className={`generator-logo-options`}>
                                <div id={`generator-logo-modes`} className={`generator-logo-modes`} role={`group`} aria-label={`Center logo source`}>
                                    {logoModes.map(({ mode, label, icon }) => (
                                        <button
                                            key={mode}
                                            type={`button`}
                                            disabled={mode === `site` && settings.contentType !== `url`}
                                            id={`generator-logo-mode-${mode}`}
                                            className={`generator-logo-mode ${settings.logoMode === mode ? `is-active` : ``}`}
                                            aria-pressed={settings.logoMode === mode}
                                            onClick={() => tool.update(`logoMode`, mode)}
                                        >
                                            <Icon name={icon} size={12} id={`generator-logo-mode-${mode}-icon`} />
                                            <span id={`generator-logo-mode-${mode}-label`} className={`generator-logo-mode-label`}>
                                                {label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {settings.logoMode === `custom` && (
                                    <div id={`generator-custom-logo-field`} className={`generator-custom-logo-field`}>
                                        <label htmlFor={`generator-custom-logo-url`} id={`generator-custom-logo-label`} className={`sr-only`}>
                                            {`Public image URL`}
                                        </label>
                                        <input
                                            type={`url`}
                                            maxLength={2048}
                                            inputMode={`url`}
                                            spellCheck={false}
                                            value={settings.customLogoUrl}
                                            id={`generator-custom-logo-url`}
                                            className={`text-input`}
                                            placeholder={`https://your-site.com/logo.png`}
                                            onChange={(event) => tool.update(`customLogoUrl`, event.target.value)}
                                        />
                                        <p id={`generator-custom-logo-hint`} className={`generator-content-hint`}>
                                            {`Use a public image URL. Downloads need CORS access.`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p id={`generator-browser-note`} className={`generator-browser-note`}>
                        <Icon name={`lock`} size={11} id={`generator-browser-lock-icon`} />
                        {`Made on your device. Your content stays here.`}
                    </p>
                </div>
                <div id={`generator-preview-panel`} className={`generator-preview-panel`}>
                    <div id={`generator-preview-heading`} className={`generator-preview-heading`}>
                        <span id={`generator-preview-label`} className={`eyebrow generator-preview-label`}>
                            {`THE GOOD PART`}
                        </span>
                        <span id={`generator-preview-status`} className={`generator-preview-status`}>
                            <span id={`generator-preview-status-dot`} className={`generator-preview-status-dot`} />
                            {tool.updating ? `Updating` : tool.error ? `Add content` : `Live preview`}
                        </span>
                    </div>
                    <div id={`generator-preview-stage`} className={`generator-preview-stage`}>
                        <span id={`generator-preview-corner-tl`} className={`generator-preview-corner generator-preview-corner--tl`} />
                        <span id={`generator-preview-corner-tr`} className={`generator-preview-corner generator-preview-corner--tr`} />
                        <span id={`generator-preview-corner-bl`} className={`generator-preview-corner generator-preview-corner--bl`} />
                        <span id={`generator-preview-corner-br`} className={`generator-preview-corner generator-preview-corner--br`} />
                        <div id={`generator-qr-paper`} className={`generator-qr-paper ${tool.error ? `has-error` : ``}`}>
                            <QRPreview
                                size={230}
                                color={tool.accent}
                                payload={tool.payload}
                                logoUrl={tool.logoResult.url}
                                id={`generator-qr-svg`}
                                onLogoError={() => tool.setLogoFailed(true)}
                            />
                        </div>
                    </div>
                    <p id={`generator-preview-hint`} className={`generator-preview-hint`}>
                        <Icon name={`scan`} size={14} id={`generator-preview-scan-icon`} />
                        {`Go on, give it a scan.`}
                    </p>
                    <div id={`generator-download-actions`} className={`generator-download-actions`}>
                        <button
                            type={`button`}
                            disabled={!tool.canUse}
                            id={`generator-download-button`}
                            className={`button button--primary generator-download-button`}
                            onClick={tool.download}
                        >
                            <Icon name={`download`} size={16} id={`generator-download-icon`} />
                            <span id={`generator-download-text`} className={`generator-download-text`}>
                                {tool.exporting ? `Preparing…` : `Download ${tool.format.toUpperCase()}`}
                            </span>
                        </button>
                        <label htmlFor={`generator-download-format`} id={`generator-format-label`} className={`sr-only`}>
                            {`Download format`}
                        </label>
                        <select
                            value={tool.format}
                            id={`generator-download-format`}
                            className={`generator-download-format`}
                            onChange={(event) => tool.setFormat(event.target.value as `png` | `svg`)}
                        >
                            <option id={`generator-format-png`} className={`generator-format-option`} value={`png`}>{`PNG`}</option>
                            <option id={`generator-format-svg`} className={`generator-format-option`} value={`svg`}>{`SVG`}</option>
                        </select>
                    </div>
                    <button
                        type={`button`}
                        disabled={!tool.canUse}
                        id={`generator-save-button`}
                        className={`button button--ghost generator-save-button`}
                        onClick={tool.save}
                    >
                        <Icon name={`grid`} size={14} id={`generator-save-icon`} />
                        <span id={`generator-save-label`} className={`generator-save-label`}>
                            {`Save to my codes`}
                        </span>
                    </button>
                    <p id={`generator-export-detail`} className={`generator-export-detail`}>
                        {tool.format === `png` ? `2048 × 2048 px · crisp & ready to share` : `Vector SVG · made for any size`}
                    </p>
                    {(tool.error || tool.logoFailed || paleColor) && (
                        <p id={`generator-feedback`} className={`generator-feedback`} role={`status`}>
                            {tool.error || (tool.logoFailed ? `Image unavailable. Try another URL or logo.` : `QR ink is deepened for better contrast.`)}
                        </p>
                    )}
                </div>
            </div>
            <div id={`generator-bottom-strip`} className={`generator-bottom-strip`}>
                <span id={`generator-no-signup`} className={`generator-bottom-feature`}>
                    <Icon name={`check`} size={12} id={`generator-no-signup-icon`} />
                    {`No sign-up to create`}
                </span>
                <span id={`generator-no-expiry`} className={`generator-bottom-feature`}>
                    <Icon name={`check`} size={12} id={`generator-no-expiry-icon`} />
                    {`No code expiration`}
                </span>
                <span id={`generator-no-watermark`} className={`generator-bottom-feature`}>
                    <Icon name={`check`} size={12} id={`generator-no-watermark-icon`} />
                    {`No watermark`}
                </span>
            </div>
        </section>
    );
}

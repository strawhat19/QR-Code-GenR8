import { Icon } from '../Icon/Icon.web';
import { useAccountDialog } from './AccountDialog.logic';
import './AccountDialog.scss';

interface AccountDialogProps {
    onClose: () => void;
}

export function AccountDialog({ onClose }: AccountDialogProps) {
    const account = useAccountDialog(onClose);

    return (
        <dialog
            ref={account.dialogRef}
            id={`account-dialog`}
            className={`account-dialog`}
            aria-labelledby={`account-dialog-title`}
            aria-describedby={`account-dialog-description`}
            onClick={account.handleBackdrop}
            onCancel={(event) => { event.preventDefault(); onClose(); }}
        >
            <button
                type={`button`}
                id={`account-dialog-close`}
                className={`account-dialog__close button button--ghost`}
                aria-label={`Close sign in`}
                onClick={onClose}
            >
                <Icon name={`x`} id={`account-dialog-close-icon`} className={`account-dialog__close-icon`} size={20} />
            </button>
            <div id={`account-dialog-symbol`} className={`account-dialog__symbol`}>
                <Icon name={`folder`} id={`account-dialog-folder-icon`} className={`account-dialog__folder-icon`} size={27} />
            </div>
            <p id={`account-dialog-eyebrow`} className={`account-dialog__eyebrow eyebrow`}>
                {`YOUR LITTLE COLLECTION`}
            </p>
            <h2 id={`account-dialog-title`} className={`account-dialog__title`}>
                {`Good links deserve a home.`}
            </h2>
            <p id={`account-dialog-description`} className={`account-dialog__description`}>
                {`Create a local demo profile to keep your QR codes together in this browser.`}
            </p>
            <form id={`account-dialog-form`} className={`account-dialog__form`} onSubmit={account.handleSubmit}>
                <div id={`account-dialog-name-field`} className={`account-dialog__field`}>
                    <label id={`account-dialog-name-label`} className={`account-dialog__label field-label`} htmlFor={`account-dialog-name`}>
                        {`Display name`}
                    </label>
                    <div id={`account-dialog-name-input-wrap`} className={`account-dialog__input-wrap`}>
                        <Icon name={`user`} id={`account-dialog-name-icon`} className={`account-dialog__input-icon`} size={18} />
                        <input
                            required
                            type={`text`}
                            maxLength={60}
                            name={`name`}
                            autoComplete={`name`}
                            ref={account.nameRef}
                            value={account.name}
                            id={`account-dialog-name`}
                            placeholder={`What should we call you?`}
                            className={`account-dialog__input text-input`}
                            onChange={(event) => account.setName(event.target.value)}
                        />
                    </div>
                </div>
                <div id={`account-dialog-email-field`} className={`account-dialog__field`}>
                    <label id={`account-dialog-email-label`} className={`account-dialog__label field-label`} htmlFor={`account-dialog-email`}>
                        {`Email`}
                    </label>
                    <div id={`account-dialog-email-input-wrap`} className={`account-dialog__input-wrap`}>
                        <Icon name={`mail`} id={`account-dialog-email-icon`} className={`account-dialog__input-icon`} size={18} />
                        <input
                            required
                            type={`email`}
                            maxLength={254}
                            name={`email`}
                            autoComplete={`email`}
                            value={account.email}
                            id={`account-dialog-email`}
                            placeholder={`you@example.com`}
                            className={`account-dialog__input text-input`}
                            onChange={(event) => account.setEmail(event.target.value)}
                        />
                    </div>
                </div>
                <button type={`submit`} id={`account-dialog-submit`} className={`account-dialog__submit button button--primary`}>
                    <span id={`account-dialog-submit-text`} className={`account-dialog__submit-text`}>
                        {`Continue locally`}
                    </span>
                    <Icon name={`arrow-right`} id={`account-dialog-submit-icon`} className={`account-dialog__submit-icon`} size={18} />
                </button>
            </form>
            <div id={`account-dialog-privacy-note`} className={`account-dialog__privacy-note`}>
                <Icon name={`shield`} id={`account-dialog-privacy-icon`} className={`account-dialog__privacy-icon`} size={16} />
                <p id={`account-dialog-privacy-text`} className={`account-dialog__privacy-text`}>
                    {`No password. No server. This is a browser-only demo, not secure account authentication. Profiles and QR codes stay on this device and do not sync.`}
                </p>
            </div>
        </dialog>
    );
}

import { Icon } from '../Icon/Icon.web';
import { resolveLogo } from '../../shared/qr';
import type { QRRecord } from '../../shared/types';
import { QRPreview } from '../QRPreview/QRPreview.web';
import { formatSavedDate, useLibrary } from './Library.logic';
import './Library.scss';

interface LibraryProps {
    onCreate: () => void;
    onSignIn: () => void;
    onEdit: (record: QRRecord) => void;
}

export function Library({ onCreate, onEdit, onSignIn }: LibraryProps) {
    const library = useLibrary();

    return (
        <main id={`qr-library`} className={`qr-library`}>
            <div id={`qr-library-heading`} className={`qr-library__heading`}>
                <div id={`qr-library-heading-copy`} className={`qr-library__heading-copy`}>
                    <p id={`qr-library-eyebrow`} className={`qr-library__eyebrow eyebrow`}>
                        {`A HOME FOR YOUR GOOD IDEAS`}
                    </p>
                    <h1 id={`qr-library-title`} className={`qr-library__title`}>
                        {`Your collection.`}
                    </h1>
                    <p id={`qr-library-description`} className={`qr-library__description`}>
                        {library.user
                            ? `Hey ${library.user.name.split(` `)[0]}, all your saved codes live right here. On this browser, just for you.`
                            : `Keep your favorite links, little notes, and next big ideas together.`}
                    </p>
                </div>
                <button type={`button`} id={`qr-library-create`} className={`qr-library__create button button--primary`} onClick={onCreate}>
                    <Icon name={`plus`} id={`qr-library-create-icon`} className={`qr-library__create-icon`} size={18} />
                    <span id={`qr-library-create-text`} className={`qr-library__create-text`}>
                        {`Create a QR code`}
                    </span>
                </button>
            </div>

            {!library.ready ? (
                <div id={`qr-library-loading`} className={`qr-library__empty`} role={`status`}>
                    <p id={`qr-library-loading-text`} className={`qr-library__empty-description`}>
                        {`Opening your collection…`}
                    </p>
                </div>
            ) : !library.user ? (
                <div id={`qr-library-sign-in-empty`} className={`qr-library__empty`}>
                    <div id={`qr-library-sign-in-symbol`} className={`qr-library__empty-symbol`}>
                        <Icon name={`folder`} id={`qr-library-sign-in-icon`} className={`qr-library__empty-icon`} size={32} />
                    </div>
                    <h2 id={`qr-library-sign-in-title`} className={`qr-library__empty-title`}>
                        {`Make a little space for your links.`}
                    </h2>
                    <p id={`qr-library-sign-in-description`} className={`qr-library__empty-description`}>
                        {`Sign in with a local demo profile to save and revisit your QR codes. Everything stays in this browser.`}
                    </p>
                    <button type={`button`} id={`qr-library-sign-in-button`} className={`qr-library__empty-action button button--primary`} onClick={onSignIn}>
                        <Icon name={`user`} id={`qr-library-sign-in-button-icon`} className={`qr-library__empty-action-icon`} size={18} />
                        <span id={`qr-library-sign-in-button-text`} className={`qr-library__empty-action-text`}>
                            {`Sign in locally`}
                        </span>
                    </button>
                </div>
            ) : (
                <>
                    <div id={`qr-library-toolbar`} className={`qr-library__toolbar`}>
                        <p id={`qr-library-count`} className={`qr-library__count`}>
                            <span id={`qr-library-count-number`} className={`qr-library__count-number`}>
                                {library.records.length}
                            </span>
                            {library.records.length === 1 ? ` saved code` : ` saved codes`}
                        </p>
                        <div id={`qr-library-search-wrap`} className={`qr-library__search-wrap`}>
                            <Icon name={`search`} id={`qr-library-search-icon`} className={`qr-library__search-icon`} size={18} />
                            <input
                                type={`search`}
                                value={library.search}
                                id={`qr-library-search`}
                                placeholder={`Find a code…`}
                                aria-label={`Search saved QR codes`}
                                className={`qr-library__search text-input`}
                                onChange={(event) => library.changeSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    {library.visibleRecords.length ? (
                        <div id={`qr-library-grid`} className={`qr-library__grid`}>
                            {library.visibleRecords.map((record) => (
                                <article key={record.id} id={`qr-library-card-${record.id}`} className={`qr-library__card`}>
                                    <div id={`qr-library-preview-wrap-${record.id}`} className={`qr-library__preview-wrap`}>
                                        <span id={`qr-library-type-${record.id}`} className={`qr-library__type`}>
                                            {record.contentType === `wifi` ? `WI-FI` : record.contentType.toUpperCase()}
                                        </span>
                                        <QRPreview
                                            size={172}
                                            color={record.color}
                                            payload={record.payload}
                                            id={`qr-library-preview-${record.id}`}
                                            className={`qr-library__preview`}
                                            logoUrl={resolveLogo(record, record.payload)}
                                        />
                                    </div>
                                    <div id={`qr-library-card-body-${record.id}`} className={`qr-library__card-body`}>
                                        <h2 id={`qr-library-card-title-${record.id}`} className={`qr-library__card-title`} title={record.title}>
                                            {record.title || `Untitled QR code`}
                                        </h2>
                                        <p id={`qr-library-card-payload-${record.id}`} className={`qr-library__card-payload`} title={record.payload}>
                                            {record.payload}
                                        </p>
                                        <p id={`qr-library-card-date-${record.id}`} className={`qr-library__card-date`}>
                                            {formatSavedDate(record.createdAt)}
                                        </p>
                                        <div id={`qr-library-downloads-${record.id}`} className={`qr-library__downloads`}>
                                            <button
                                                type={`button`}
                                                disabled={Boolean(library.downloading)}
                                                id={`qr-library-download-svg-${record.id}`}
                                                className={`qr-library__download button button--primary`}
                                                aria-label={`Download ${record.title || `QR code`} as SVG`}
                                                onClick={() => void library.download(record, `svg`)}
                                            >
                                                <Icon name={`download`} id={`qr-library-download-svg-icon-${record.id}`} className={`qr-library__download-icon`} size={15} />
                                                <span id={`qr-library-download-svg-text-${record.id}`} className={`qr-library__download-text`}>
                                                    {library.downloading === `${record.id}-svg` ? `Saving…` : `SVG`}
                                                </span>
                                            </button>
                                            <button
                                                type={`button`}
                                                disabled={Boolean(library.downloading)}
                                                id={`qr-library-download-png-${record.id}`}
                                                className={`qr-library__download button button--ghost`}
                                                aria-label={`Download ${record.title || `QR code`} as PNG`}
                                                onClick={() => void library.download(record, `png`)}
                                            >
                                                <Icon name={`download`} id={`qr-library-download-png-icon-${record.id}`} className={`qr-library__download-icon`} size={15} />
                                                <span id={`qr-library-download-png-text-${record.id}`} className={`qr-library__download-text`}>
                                                    {library.downloading === `${record.id}-png` ? `Saving…` : `PNG`}
                                                </span>
                                            </button>
                                        </div>
                                        <div id={`qr-library-card-actions-${record.id}`} className={`qr-library__card-actions`}>
                                            <button type={`button`} id={`qr-library-edit-${record.id}`} className={`qr-library__edit button button--ghost`} onClick={() => onEdit(record)}>
                                                <Icon name={`grid`} id={`qr-library-edit-icon-${record.id}`} className={`qr-library__action-icon`} size={14} />
                                                <span id={`qr-library-edit-text-${record.id}`} className={`qr-library__edit-text`}>
                                                    {`Edit code`}
                                                </span>
                                            </button>
                                            <div id={`qr-library-secondary-actions-${record.id}`} className={`qr-library__secondary-actions`}>
                                                <button
                                                    type={`button`}
                                                    title={`Copy QR content`}
                                                    id={`qr-library-copy-${record.id}`}
                                                    className={`qr-library__icon-action button button--ghost`}
                                                    aria-label={`Copy content of ${record.title || `QR code`}`}
                                                    onClick={() => void library.copy(record)}
                                                >
                                                    <Icon name={`copy`} id={`qr-library-copy-icon-${record.id}`} className={`qr-library__action-icon`} size={15} />
                                                </button>
                                                <button
                                                    type={`button`}
                                                    title={`Delete saved code`}
                                                    id={`qr-library-delete-${record.id}`}
                                                    className={`qr-library__icon-action qr-library__delete button button--ghost`}
                                                    aria-label={`Delete ${record.title || `QR code`}`}
                                                    onClick={() => library.remove(record)}
                                                >
                                                    <Icon name={`trash`} id={`qr-library-delete-icon-${record.id}`} className={`qr-library__action-icon`} size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div id={`qr-library-no-results`} className={`qr-library__empty`}>
                            <div id={`qr-library-no-results-symbol`} className={`qr-library__empty-symbol`}>
                                <Icon name={library.search ? `search` : `grid`} id={`qr-library-no-results-icon`} className={`qr-library__empty-icon`} size={32} />
                            </div>
                            <h2 id={`qr-library-no-results-title`} className={`qr-library__empty-title`}>
                                {library.search ? `No codes by that name.` : `A fresh page. A new possibility.`}
                            </h2>
                            <p id={`qr-library-no-results-description`} className={`qr-library__empty-description`}>
                                {library.search ? `Try a different name or search for the code’s content.` : `Your first saved QR code is only a few clicks away.`}
                            </p>
                            <button
                                type={`button`}
                                id={`qr-library-no-results-action`}
                                className={`qr-library__empty-action button button--primary`}
                                onClick={() => library.search ? library.changeSearch(``) : onCreate()}
                            >
                                <Icon name={library.search ? `x` : `plus`} id={`qr-library-no-results-action-icon`} className={`qr-library__empty-action-icon`} size={18} />
                                <span id={`qr-library-no-results-action-text`} className={`qr-library__empty-action-text`}>
                                    {library.search ? `Clear search` : `Create a QR code`}
                                </span>
                            </button>
                        </div>
                    )}

                    {library.pageCount > 1 && (
                        <nav id={`qr-library-pagination`} className={`qr-library__pagination`} aria-label={`Collection pages`}>
                            <button
                                type={`button`}
                                id={`qr-library-page-previous`}
                                disabled={library.currentPage === 0}
                                className={`qr-library__page-button button button--ghost`}
                                onClick={() => library.setPage(library.currentPage - 1)}
                            >
                                <Icon name={`arrow-left`} id={`qr-library-page-previous-icon`} className={`qr-library__page-icon`} size={16} />
                                <span id={`qr-library-page-previous-text`} className={`qr-library__page-text`}>
                                    {`Previous`}
                                </span>
                            </button>
                            <span id={`qr-library-page-status`} className={`qr-library__page-status`} aria-live={`polite`}>
                                {`${library.currentPage + 1} / ${library.pageCount}`}
                            </span>
                            <button
                                type={`button`}
                                id={`qr-library-page-next`}
                                className={`qr-library__page-button button button--ghost`}
                                disabled={library.currentPage + 1 === library.pageCount}
                                onClick={() => library.setPage(library.currentPage + 1)}
                            >
                                <span id={`qr-library-page-next-text`} className={`qr-library__page-text`}>
                                    {`Next`}
                                </span>
                                <Icon name={`arrow-right`} id={`qr-library-page-next-icon`} className={`qr-library__page-icon`} size={16} />
                            </button>
                        </nav>
                    )}

                    <p id={`qr-library-local-note`} className={`qr-library__local-note`}>
                        <Icon name={`shield`} id={`qr-library-local-note-icon`} className={`qr-library__local-note-icon`} size={14} />
                        <span id={`qr-library-local-note-text`} className={`qr-library__local-note-text`}>
                            {`Saved on this browser. Export your favorites before clearing browser data.`}
                        </span>
                    </p>
                </>
            )}
        </main>
    );
}

import { Icon } from '../Icon/Icon.web';
import { getInfoPage, type InfoPageKey } from './InfoPage.logic';
import './InfoPage.scss';

interface InfoPageProps {
    page: InfoPageKey;
    onBack: () => void;
}

export function InfoPage({ page, onBack }: InfoPageProps) {
    const content = getInfoPage(page);
    const policyPage = page === `terms` || page === `privacy`;

    return (
        <main id={`info-page-${page}`} className={`info-page info-page--${page}`}>
            <button type={`button`} id={`info-page-back-${page}`} className={`info-page__back button button--ghost`} onClick={onBack}>
                <Icon name={`arrow-left`} id={`info-page-back-icon-${page}`} className={`info-page__back-icon`} size={15} />
                <span id={`info-page-back-text-${page}`} className={`info-page__back-text`}>
                    {`Back to the generator`}
                </span>
            </button>
            <header id={`info-page-header-${page}`} className={`info-page__header`}>
                <div id={`info-page-symbol-${page}`} className={`info-page__symbol`}>
                    <Icon name={content.icon} id={`info-page-symbol-icon-${page}`} className={`info-page__symbol-icon`} size={28} />
                </div>
                <p id={`info-page-eyebrow-${page}`} className={`info-page__eyebrow eyebrow`}>
                    {content.eyebrow}
                </p>
                <h1 id={`info-page-title-${page}`} className={`info-page__title`}>
                    {content.title}
                </h1>
                <p id={`info-page-intro-${page}`} className={`info-page__intro`}>
                    {content.intro}
                </p>
                {policyPage && (
                    <p id={`info-page-updated-${page}`} className={`info-page__updated`}>
                        {`Last updated September 30, 2026`}
                    </p>
                )}
                {page === `contact` && (
                    <a
                        target={`_blank`}
                        rel={`noopener noreferrer`}
                        href={`https://piratechs.com/`}
                        id={`info-page-contact-link`}
                        className={`info-page__contact-link button button--primary`}
                    >
                        <span id={`info-page-contact-link-text`} className={`info-page__contact-link-text`}>
                            {`Visit Piratechs`}
                        </span>
                        <Icon name={`arrow-right`} id={`info-page-contact-link-icon`} className={`info-page__contact-link-icon`} size={17} />
                    </a>
                )}
            </header>
            <div id={`info-page-sections-${page}`} className={`info-page__sections`}>
                {content.sections.map((section, index) => (
                    <section key={section.title} id={`info-page-section-${page}-${index}`} className={`info-page__section`}>
                        <span id={`info-page-section-number-${page}-${index}`} className={`info-page__section-number`} aria-hidden={`true`}>
                            {`${index + 1}`.padStart(2, `0`)}
                        </span>
                        <div id={`info-page-section-copy-${page}-${index}`} className={`info-page__section-copy`}>
                            <h2 id={`info-page-section-title-${page}-${index}`} className={`info-page__section-title`}>
                                {section.title}
                            </h2>
                            {section.paragraphs.map((paragraph, paragraphIndex) => (
                                <p key={paragraphIndex} id={`info-page-paragraph-${page}-${index}-${paragraphIndex}`} className={`info-page__paragraph`}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <div id={`info-page-closing-${page}`} className={`info-page__closing`}>
                <p id={`info-page-closing-copy-${page}`} className={`info-page__closing-copy`}>
                    {`Something worth sharing starts with one small square.`}
                </p>
                <button type={`button`} id={`info-page-closing-button-${page}`} className={`info-page__closing-button button button--ghost`} onClick={onBack}>
                    <Icon name={`plus`} id={`info-page-closing-icon-${page}`} className={`info-page__closing-icon`} size={17} />
                    <span id={`info-page-closing-text-${page}`} className={`info-page__closing-text`}>
                        {`Make a QR code`}
                    </span>
                </button>
            </div>
        </main>
    );
}

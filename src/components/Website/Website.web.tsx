import './Website.scss';
import type { CSSProperties, MouseEvent } from 'react';
import { lazy, Suspense } from 'react';
import { Icon } from '../Icon/Icon.web';
import { Brand } from '../Brand/Brand.web';
import { useWebsite } from './useWebsite';
import type { Page } from '../../shared/routes.web';
import { Generator } from '../Generator/Generator.web';

const Library = lazy(() => import('../Library/Library.web').then((module) => ({ default: module.Library })));
const InfoPage = lazy(() => import('../InfoPage/InfoPage.web').then((module) => ({ default: module.InfoPage })));
const AccountDialog = lazy(() => import('../AccountDialog/AccountDialog.web').then((module) => ({ default: module.AccountDialog })));

const benefits = [
    { icon: `palette`, title: `A code with character.`, description: `Your color. Your logo. Your little corner of the internet. Make every scan feel like you.`, number: `01` },
    { icon: `link`, title: `Straight to the good stuff.`, description: `No middleman or expiring redirects. Your destination is written right into your QR code.`, number: `02` },
    { icon: `shield`, title: `Yours, from the first pixel.`, description: `Created on your device. Saved on your device. Download it, print it, take it anywhere.`, number: `03` },
];

export function Website() {
    const site = useWebsite();

    function linkClick(event: MouseEvent<HTMLAnchorElement>, page: Page) {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (page === `home`) site.createNew();
        else site.navigate(page);
    }

    return (
        <div
            id={`qr-website`}
            data-theme={site.theme}
            className={`qr-website`}
            style={site.tokens as CSSProperties}
        >
            <header id={`site-header`} className={`site-header`}>
                <div id={`site-header-inner`} className={`site-header-inner`}>
                    <a
                        href={site.pageHref(`home`)}
                        id={`site-home-link`}
                        className={`site-home-link`}
                        aria-label={`QR Code GenR8 home`}
                        onClick={(event) => linkClick(event, `home`)}
                    >
                        <Brand id={`header-brand`} />
                    </a>
                    <nav id={`site-navigation`} className={`site-navigation`} aria-label={`Main navigation`}>
                        <a
                            href={site.pageHref(`home`)}
                            id={`nav-create-link`}
                            className={`nav-link ${site.page === `home` ? `is-current` : ``}`}
                            aria-current={site.page === `home` ? `page` : undefined}
                            onClick={(event) => linkClick(event, `home`)}
                        >
                            <Icon name={`plus`} size={13} id={`nav-create-icon`} />
                            {`Create a code`}
                        </a>
                        <a
                            href={site.pageHref(`library`)}
                            id={`nav-library-link`}
                            className={`nav-link ${site.page === `library` ? `is-current` : ``}`}
                            aria-current={site.page === `library` ? `page` : undefined}
                            onClick={(event) => linkClick(event, `library`)}
                        >
                            <Icon name={`grid`} size={13} id={`nav-library-icon`} />
                            {`My codes`}
                        </a>
                        <a
                            href={site.pageHref(`about`)}
                            id={`nav-about-link`}
                            className={`nav-link`}
                            onClick={(event) => linkClick(event, `about`)}
                        >
                            {`About`}
                        </a>
                    </nav>
                    <div id={`site-header-actions`} className={`site-header-actions`}>
                        <button
                            type={`button`}
                            id={`theme-toggle`}
                            className={`theme-toggle`}
                            aria-label={`Switch to ${site.theme === `dark` ? `light` : `dark`} mode`}
                            title={`Switch to ${site.theme === `dark` ? `light` : `dark`} mode`}
                            onClick={site.toggleTheme}
                        >
                            <Icon name={site.theme === `dark` ? `sun` : `moon`} size={17} id={`theme-toggle-icon`} />
                        </button>
                        <button
                            type={`button`}
                            id={`header-account-button`}
                            className={`button button--ghost header-account-button`}
                            onClick={() => site.user ? site.navigate(`library`) : site.setAccountOpen(true)}
                        >
                            <Icon name={`user`} size={15} id={`header-account-icon`} />
                            <span id={`header-account-label`} className={`header-account-label`}>
                                {site.user ? site.user.name.split(` `)[0] : `Sign in`}
                            </span>
                        </button>
                        {site.user && (
                            <button
                                type={`button`}
                                id={`header-signout-button`}
                                className={`theme-toggle header-signout-button`}
                                aria-label={`Sign out of local profile`}
                                title={`Sign out`}
                                onClick={site.logout}
                            >
                                <Icon name={`logout`} size={15} id={`header-signout-icon`} />
                            </button>
                        )}
                        <button
                            type={`button`}
                            id={`mobile-menu-toggle`}
                            className={`mobile-menu-toggle theme-toggle`}
                            aria-label={`Toggle navigation`}
                            aria-expanded={site.menuOpen}
                            aria-controls={`mobile-navigation`}
                            onClick={() => site.setMenuOpen(!site.menuOpen)}
                        >
                            <Icon name={site.menuOpen ? `x` : `grid`} size={17} id={`mobile-menu-icon`} />
                        </button>
                    </div>
                </div>
                {site.menuOpen && (
                    <nav id={`mobile-navigation`} className={`mobile-navigation`} aria-label={`Mobile navigation`}>
                        {([`home`, `library`, `about`] as Page[]).map((page, index) => (
                            <a
                                key={page}
                                href={site.pageHref(page)}
                                id={`mobile-nav-${page}`}
                                className={`mobile-nav-link`}
                                onClick={(event) => linkClick(event, page)}
                            >
                                <Icon name={[`plus`, `grid`, `info`][index]} size={14} id={`mobile-nav-icon-${page}`} />
                                {page === `home` ? `Create a code` : page === `library` ? `My codes` : `About`}
                            </a>
                        ))}
                    </nav>
                )}
            </header>
            {site.storageError && (
                <p id={`storage-error-banner`} className={`storage-error-banner`} role={`status`}>
                    <Icon name={`info`} size={14} id={`storage-error-icon`} />
                    {site.storageError}
                </p>
            )}
            <main id={`site-main`} className={`site-main`}>
                {site.page === `home` ? (
                    <>
                        <section id={`landing-hero`} className={`landing-hero`} aria-labelledby={`hero-title`}>
                            <div id={`hero-story`} className={`hero-story`}>
                                <p id={`hero-eyebrow`} className={`hero-eyebrow eyebrow`}>
                                    <span id={`hero-eyebrow-dot`} className={`hero-eyebrow-dot`} />
                                    {`YOUR LINKS. YOUR LOOK.`}
                                </p>
                                <h1 id={`hero-title`} className={`hero-title`}>
                                    <span id={`hero-title-line-one`} className={`hero-title-line hero-title-line--one`}>
                                        {`A little code.`}
                                    </span>
                                    <span id={`hero-title-line-two`} className={`hero-title-line hero-title-line--two`}>
                                        {`A whole lot of`}
                                    </span>
                                    <span id={`hero-title-line-three`} className={`hero-title-line hero-title-line--accent`}>
                                        {`possibility.`}
                                        <svg
                                            width={258}
                                            height={17}
                                            fill={`none`}
                                            viewBox={`0 0 258 17`}
                                            aria-hidden={true}
                                            id={`hero-title-underline`}
                                            className={`hero-title-underline`}
                                        >
                                            <path id={`hero-title-underline-stroke`} className={`hero-title-underline-stroke`} d={`M3 11C73 1 163 1 255 7M42 15c75-9 131-8 188-5`} stroke={`currentColor`} strokeWidth={3} strokeLinecap={`round`} />
                                        </svg>
                                    </span>
                                </h1>
                                <p id={`hero-description`} className={`hero-description`}>
                                    {`Turn a link into a connection. Create a QR code that feels like you — in your color, with your logo, ready for wherever life takes it.`}
                                </p>
                                <div id={`hero-promises`} className={`hero-promises`}>
                                    <span id={`hero-promise-free`} className={`hero-promise`}>
                                        <Icon name={`check`} size={13} id={`hero-promise-free-icon`} />
                                        {`Free to create`}
                                    </span>
                                    <span id={`hero-promise-private`} className={`hero-promise`}>
                                        <Icon name={`check`} size={13} id={`hero-promise-private-icon`} />
                                        {`No sign-up needed`}
                                    </span>
                                </div>
                                <div id={`hero-mini-note`} className={`hero-mini-note`}>
                                    <div id={`hero-note-symbol`} className={`hero-note-symbol`}>
                                        <Icon name={`sparkles`} size={19} id={`hero-note-sparkle-icon`} />
                                    </div>
                                    <div id={`hero-note-copy`} className={`hero-note-copy`}>
                                        <span id={`hero-note-title`} className={`hero-note-title`}>
                                            {`Less friction. More connection.`}
                                        </span>
                                        <span id={`hero-note-subtitle`} className={`hero-note-subtitle`}>
                                            {`From big ideas to everyday little things.`}
                                        </span>
                                    </div>
                                    <Icon name={`arrow-right`} size={15} id={`hero-note-arrow-icon`} />
                                </div>
                            </div>
                            <div id={`hero-tool`} className={`hero-tool`}>
                                <Generator record={site.editing} key={site.editing?.id || `new-code`} />
                            </div>
                        </section>
                        <section id={`landing-use-cases`} className={`landing-use-cases`} aria-label={`What can a QR code do?`}>
                            <span id={`use-cases-intro`} className={`use-cases-intro`}>
                                {`A SMALL SQUARE FOR YOUR`}
                            </span>
                            {[
                                { icon: `globe`, text: `next big idea` },
                                { icon: `mail`, text: `business card` },
                                { icon: `link`, text: `favorite link` },
                                { icon: `wifi`, text: `guest Wi-Fi` },
                            ].map(({ icon, text }, index) => (
                                <span key={text} id={`use-case-${index}`} className={`use-case`}>
                                    <Icon name={icon} size={16} id={`use-case-icon-${index}`} />
                                    <span id={`use-case-label-${index}`} className={`use-case-label`}>
                                        {text}
                                    </span>
                                </span>
                            ))}
                        </section>
                        <section id={`landing-benefits`} className={`landing-benefits`} aria-labelledby={`benefits-title`}>
                            <div id={`benefits-heading`} className={`benefits-heading`}>
                                <div id={`benefits-title-group`} className={`benefits-title-group`}>
                                    <p id={`benefits-eyebrow`} className={`eyebrow benefits-eyebrow`}>
                                        {`THOUGHTFULLY SIMPLE`}
                                    </p>
                                    <h2 id={`benefits-title`} className={`benefits-title`}>
                                        {`Everything you need. A little more you.`}
                                    </h2>
                                </div>
                                <p id={`benefits-description`} className={`benefits-description`}>
                                    {`Good tools get out of the way. This one just adds a little personality.`}
                                </p>
                            </div>
                            <div id={`benefits-grid`} className={`benefits-grid`}>
                                {benefits.map(({ icon, title, description, number }, index) => (
                                    <article key={number} id={`benefit-card-${index}`} className={`benefit-card`}>
                                        <div id={`benefit-card-heading-${index}`} className={`benefit-card-heading`}>
                                            <span id={`benefit-icon-tile-${index}`} className={`benefit-icon-tile`}>
                                                <Icon name={icon} size={21} id={`benefit-icon-${index}`} />
                                            </span>
                                            <span id={`benefit-number-${index}`} className={`benefit-number`}>
                                                {number}
                                            </span>
                                        </div>
                                        <h3 id={`benefit-title-${index}`} className={`benefit-title`}>
                                            {title}
                                        </h3>
                                        <p id={`benefit-description-${index}`} className={`benefit-description`}>
                                            {description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    <Suspense fallback={<PageLoading />}>
                        {site.page === `library` ? (
                            <Library
                                onEdit={site.editRecord}
                                onCreate={site.createNew}
                                onSignIn={() => site.setAccountOpen(true)}
                            />
                        ) : (
                            <InfoPage page={site.page} onBack={() => site.navigate(`home`)} />
                        )}
                    </Suspense>
                )}
            </main>
            <footer id={`site-footer`} className={`site-footer`}>
                <div id={`site-footer-top`} className={`site-footer-top`}>
                    <div id={`footer-brand-group`} className={`footer-brand-group`}>
                        <Brand id={`footer-brand`} compact />
                        <span id={`footer-tagline`} className={`footer-tagline`}>
                            {`Made for the moments that connect us.`}
                        </span>
                    </div>
                    <nav id={`footer-navigation`} className={`footer-navigation`} aria-label={`Information pages`}>
                        {([`about`, `terms`, `privacy`, `contact`] as Page[]).map((page) => (
                            <a
                                key={page}
                                href={site.pageHref(page)}
                                id={`footer-link-${page}`}
                                className={`footer-link`}
                                onClick={(event) => linkClick(event, page)}
                            >
                                {page === `privacy` ? `Privacy Policy` : `${page[0].toUpperCase()}${page.slice(1)}`}
                            </a>
                        ))}
                    </nav>
                </div>
                <div id={`site-footer-bottom`} className={`site-footer-bottom`}>
                    <p id={`footer-copyright`} className={`footer-copyright`}>
                        {`© ${new Date().getFullYear()} `}
                        <a id={`footer-piratechs-link`} className={`footer-piratechs-link`} href={`https://piratechs.com/`} target={`_blank`} rel={`noopener noreferrer`}>
                            {`Piratechs`}
                            <Icon name={`external-link`} size={10} id={`footer-piratechs-icon`} />
                        </a>
                        {`. All rights reserved.`}
                    </p>
                    <span id={`footer-made-with`} className={`footer-made-with`}>
                        {`A little code. A lot of `}
                        <Icon name={`heart`} size={11} id={`footer-heart-icon`} />
                    </span>
                </div>
            </footer>
            {site.notice && (
                <div id={`site-notice`} className={`site-notice`} role={`status`} aria-live={`polite`}>
                    <Icon name={`info`} size={17} id={`site-notice-icon`} />
                    <span id={`site-notice-message`} className={`site-notice-message`}>
                        {site.notice}
                    </span>
                </div>
            )}
            {site.accountOpen && (
                <Suspense fallback={<PageLoading />}>
                    <AccountDialog onClose={() => site.setAccountOpen(false)} />
                </Suspense>
            )}
        </div>
    );
}

function PageLoading() {
    return (
        <div id={`page-loading`} className={`page-loading`} role={`status`}>
            <Icon name={`scan`} size={22} id={`page-loading-icon`} />
            <span id={`page-loading-text`} className={`page-loading-text`}>
                {`Opening your workspace…`}
            </span>
        </div>
    );
}

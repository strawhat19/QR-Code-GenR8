import { useEffect, useState } from 'react';

export type Page = `home` | `library` | `about` | `terms` | `privacy` | `contact`;
const aliases: Record<string, Page> = {
    about: `about`,
    terms: `terms`,
    privacy: `privacy`,
    contact: `contact`,
    library: `library`,
    'about-us': `about`,
    'contact-us': `contact`,
    'my-codes': `library`,
    'privacy-policy': `privacy`,
    'terms-of-service': `terms`,
};

const initialPath = window.location.pathname.replace(/\/index\.html$/, `/`);
const parts = initialPath.split(`/`).filter(Boolean);
const tail = parts[parts.length - 1] || ``;
export const basePath = aliases[tail]
    ? `/${parts.slice(0, -1).join(`/`)}/`.replace(/\/+/g, `/`)
    : `${initialPath.replace(/\/$/, ``)}/`.replace(/\/+/g, `/`);

export const pageHref = (page: Page) => page === `home` ? basePath : `${basePath}${page}`;
export const appUrl = () => `${window.location.origin}${basePath}`;

function readPage(): Page {
    const segment = window.location.pathname.split(`/`).filter(Boolean).pop() || ``;
    return aliases[segment] || `home`;
}

export function useRoute() {
    const [page, setPage] = useState<Page>(readPage);

    useEffect(() => {
        const onPopState = () => setPage(readPage());
        window.addEventListener(`popstate`, onPopState);
        if (window.location.pathname !== pageHref(readPage())) {
            window.history.replaceState({}, ``, pageHref(readPage()));
        }
        return () => window.removeEventListener(`popstate`, onPopState);
    }, []);

    function navigate(next: Page) {
        window.history.pushState({}, ``, pageHref(next));
        setPage(next);
        window.scrollTo({ top: 0, behavior: `smooth` });
    }

    return { page, navigate };
}

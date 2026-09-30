import { useId } from 'react';

const paths: Record<string, string> = {
    x: `M6 6l12 12M18 6 6 18`,
    plus: `M12 5v14M5 12h14`,
    check: `m5 12 4 4L19 6`,
    copy: `M9 9h11v11H9zM15 9V4H4v11h5`,
    link: `M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2`,
    text: `M4 5h16M12 5v14M8 19h8`,
    mail: `M3 5h18v14H3zM3 5l9 7 9-7`,
    wifi: `M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0M12 20h.01`,
    user: `M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0`,
    image: `M3 3h18v18H3zM3 17l6-6 4 4 4-5 4 7M8 7h.01`,
    palette: `M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4 2 2 0 0 1 1-4h3a3 3 0 0 0 3-3 9 9 0 0 0-9-7ZM7 10h.01M9 6h.01M15 6h.01M17 9h.01`,
    download: `M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5`,
    trash: `M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7`,
    grid: `M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z`,
    folder: `M3 6h6l2 3h10v12H3zM3 6V3h6l2 3h10v3`,
    globe: `M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18`,
    shield: `m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-5`,
    lock: `M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3M12 14v3`,
    zap: `m13 2-9 12h7l-1 8 10-12h-7l1-8Z`,
    moon: `M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z`,
    sun: `M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1`,
    search: `M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm6 14 5 5`,
    logout: `M9 3H3v18h6M9 12h12m-5-5 5 5-5 5`,
    heart: `M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-6 6 8 16 8 16S26 11 20 5Z`,
    info: `M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 11v6M12 7h.01`,
    sparkles: `m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM21 2v4M19 4h4`,
    'arrow-right': `M4 12h16m-6-6 6 6-6 6`,
    'arrow-left': `M20 12H4m6-6-6 6 6 6`,
    'chevron-down': `m6 9 6 6 6-6`,
    'external-link': `M14 3h7v7m0-7L10 14M11 3H3v18h18v-8`,
    scan: `M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M7 12h10`,
};

type IconProps = {
    id?: string;
    name: string;
    size?: number;
    className?: string;
};

export function Icon({ name, size = 20, id, className = `` }: IconProps) {
    const generatedId = useId();
    const iconId = id || `icon-${name}-${generatedId}`;

    return (
        <svg
            id={iconId}
            fill={`none`}
            width={size}
            height={size}
            aria-hidden={true}
            viewBox={`0 0 24 24`}
            stroke={`currentColor`}
            strokeWidth={1.7}
            strokeLinecap={`round`}
            strokeLinejoin={`round`}
            className={`icon icon--${name} ${className}`}
        >
            <path
                d={paths[name] || paths[`sparkles`]}
                id={`${iconId}-path`}
                className={`icon-path icon-path--${name}`}
            />
        </svg>
    );
}

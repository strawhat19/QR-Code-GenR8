import { useMemo, useState } from 'react';
import type { QRRecord } from '../../shared/types';
import { useApp } from '../../shared/AppContext';
import { downloadQr } from '../../shared/download.web';

const pageSize = 12;
const dateFormat = new Intl.DateTimeFormat(`en-US`, { month: `short`, day: `numeric`, year: `numeric` });

export function formatSavedDate(createdAt: QRRecord[`createdAt`]) {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? `Saved locally` : dateFormat.format(date);
}

export function useLibrary() {
    const { user, records, deleteQR, notify, ready } = useApp();
    const [search, setSearch] = useState(``);
    const [page, setPage] = useState(0);
    const [downloading, setDownloading] = useState<string | null>(null);

    const matches = useMemo(() => {
        const query = search.trim().toLowerCase();
        return records
            .filter((record) => !query || `${record.title} ${record.payload}`.toLowerCase().includes(query))
            .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
    }, [records, search]);

    const pageCount = Math.ceil(matches.length / pageSize);
    const currentPage = Math.min(page, Math.max(0, pageCount - 1));
    const visibleRecords = useMemo(() => matches.slice(currentPage * pageSize, (currentPage + 1) * pageSize), [matches, currentPage]);

    function changeSearch(value: string) {
        setSearch(value);
        setPage(0);
    }

    async function download(record: QRRecord, format: `svg` | `png`) {
        setDownloading(`${record.id}-${format}`);
        try {
            await downloadQr(record, record.payload, format);
            notify(`${format.toUpperCase()} downloaded.`);
        } catch {
            notify(`Could not download this QR code. Try SVG or a different logo image.`);
        } finally {
            setDownloading(null);
        }
    }

    async function copy(record: QRRecord) {
        try {
            await navigator.clipboard.writeText(record.payload);
            notify(`QR content copied.`);
        } catch {
            notify(`Clipboard is unavailable here. Open Edit to select and copy your content.`);
        }
    }

    function remove(record: QRRecord) {
        deleteQR(record.id);
        notify(`QR code removed from this browser.`);
    }

    return { user, ready, records, search, currentPage, pageCount, visibleRecords, downloading, matches, setPage, changeSearch, download, copy, remove };
}

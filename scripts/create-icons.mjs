import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL(`../assets/concepts/logos/v7/02-qr-link-matrix-icon.svg`, import.meta.url), `utf8`);
const padded = source.replace(`viewBox="0 0 180 180"`, `viewBox="-15 -15 210 210"`);

for (const [path, width, artwork] of [
    [`../public/icon-192.png`, 192, source],
    [`../public/icon-512.png`, 512, source],
    [`../public/icon-maskable.png`, 512, padded],
    [`../assets/app-icon.png`, 1024, padded],
]) {
    const icon = new Resvg(artwork, {
        background: `#170F29`,
        fitTo: { mode: `width`, value: width },
    });
    await writeFile(new URL(path, import.meta.url), icon.render().asPng());
}
await writeFile(new URL(`../public/favicon.svg`, import.meta.url), source);

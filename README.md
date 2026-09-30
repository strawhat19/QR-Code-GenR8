# QR Code GenR8

A frontend-only QR studio built with Expo, React Native, TypeScript, and SCSS. Web and native screens share QR generation, theme settings, and local profile storage.

## Start

Dependencies are installed. Open the web app with:

```sh
npm run web
```

For the native app, run `npm start` and open it in a compatible Expo Go client, or use `npm run ios` / `npm run android` with a simulator.

## Included

- Responsive landing page with immediately available link, text, email, and Wi-Fi generation.
- The original v7 logo, with its purple border, connector, center, and modules recolored together.
- Dark mode by default, optional light mode, and a keyboard/touch/pointer color field and hue dragger.
- A real QR of the current app URL as the starting preview. Native defaults to the configured public app URL.
- Optional GenR8, destination favicon, or custom public image URL at the center of the code.
- Web SVG and 2048 px PNG downloads; native SVG sharing.
- Local demo sign-in, saved codes, editing, deletion, searching, and paginated web / virtualized native collections.
- About, Terms, Privacy Policy, and Contact pages, plus common aliases such as `/about-us`, `/contact-us`, and `/privacy-policy`.
- Supplied SVG favicon, raster app icons, manifest, and a production-only service worker for an installable web app.

## Local state

The master switch is `useLocalStorage` in `src/shared/config.ts`, enabled by default. The web uses browser localStorage; native uses AsyncStorage. Setting the switch to `false` uses session memory. No backend or real authentication is connected. Local profiles are a demo convenience: they do not secure data or sync between devices.

Guest saves attach to the next local profile that signs in. Reusing that profile's email opens its device-local collection. QR content, including Wi-Fi passwords when saved, is kept as plain local data. Theme preferences and saved records remain local. Deleting browser/app data removes them.

## Performance

The first screen uses system fonts, small inline icons, and a single SVG path per QR. QR matrices are cached by content, so dragging the theme color does not recompute the symbol. Input previews defer QR rendering, storage writes are debounced, and secondary pages load only when opened. There are no analytics, remote fonts, server requests, or animation loops in the default experience. Custom/site logos make image requests only when selected; export embeds their image data.

## Images and exports

External image hosts must permit CORS for downloadable logos. The app reports blocked image exports and offers the GenR8 logo or logo-free codes as alternatives. SVG and PNG exports contain the logo rather than depending on the remote URL later.

QR codes use high error correction, four-module quiet zones, square modules, and a small center logo. Very light selected colors produce deeper QR ink for contrast. Scan the finished code on the devices you intend to support before publishing or printing.

## Publish when ready

After reviewing and verifying the source, create the static web files with:

```sh
npm run export:web
```

Publish the contents of `dist/` on your domain. Serve clean routes with an SPA fallback to `index.html`; `public/.htaccess` supplies the Apache/XAMPP rewrite rule. Expo's public assets and bundle paths should be configured for the intended deployment base if publishing inside a subdirectory. The default QR destination follows the actual browser origin and app base path.

PWA installation needs HTTPS or localhost. The service worker registers only in production, uses network-first navigation, and caches same-origin shell assets. Change its cache version when changing unversioned public assets.

To regenerate the native/PWA icons from the exact supplied vector:

```sh
node scripts/create-icons.mjs
```

Native signing, store submission, and actual authentication can be added when ready. No build, tests, or application verification were run during implementation, as instructed in `AGENTS.md`.

export type InfoPageKey = `about` | `terms` | `privacy` | `contact`;

interface InfoSection {
    title: string;
    paragraphs: string[];
}

interface InfoPageContent {
    title: string;
    eyebrow: string;
    intro: string;
    icon: `link` | `shield` | `globe` | `mail`;
    sections: InfoSection[];
}

const infoPages: Record<InfoPageKey, InfoPageContent> = {
    about: {
        icon: `link`,
        eyebrow: `SMALL TOOL. BIG POSSIBILITIES.`,
        title: `A little link. A big connection.`,
        intro: `QR-Code-GenR8 turns the things you want to share into something anyone can scan. Make it useful. Make it yours.`,
        sections: [
            {
                title: `From idea to QR in a moment`,
                paragraphs: [
                    `Create a QR code for a website, a piece of text, an email, or a Wi-Fi network. The generator is open to everyone, with no sign-in needed to create or download a code.`,
                    `Pick a color, add a center logo, and export a crisp SVG or PNG for a card, screen, or print. Your QR contains the content you enter directly. There is no hosted redirect service in between.`,
                ],
            },
            {
                title: `Your color, all the way through`,
                paragraphs: [
                    `A single accent color ties the interface, app mark, and new QR code together. Choose the brand mark, a website icon, or a public image URL for the center logo, or switch the logo off entirely.`,
                    `Keep enough contrast between your QR color and its white background, leave the margin around it clear, and scan the exported code before sharing it.`,
                ],
            },
            {
                title: `A collection on your device`,
                paragraphs: [
                    `The optional sign-in creates a local demo profile. Saved codes and preferences live in your browser storage, so you can revisit, edit, or delete them here. No backend is connected and there is no account sync.`,
                    `Local profiles are for organizing a collection; they are not secure authentication. Export anything you want to keep before clearing your browser data.`,
                ],
            },
        ],
    },
    terms: {
        icon: `globe`,
        eyebrow: `THE GROUND RULES`,
        title: `Keep it useful. Keep it kind.`,
        intro: `These terms describe how this frontend demo works and the responsibilities that come with creating and sharing QR codes.`,
        sections: [
            {
                title: `Use and ownership`,
                paragraphs: [
                    `Use the tool for content you are allowed to share. You are responsible for the links, text, Wi-Fi details, and images you provide, including having permission to use a logo or other image. Do not use the tool to facilitate deception, abuse, or unlawful activity.`,
                    `The app does not claim ownership of your input or generated QR codes. Downloading a QR code does not grant rights to third-party images or content it contains.`,
                ],
            },
            {
                title: `Check what you share`,
                paragraphs: [
                    `Generated QR codes encode your input directly. Anyone who has the code can read its content, including any Wi-Fi password or other sensitive information you enter. A center logo, low color contrast, or small print size can affect scan reliability.`,
                    `Check the destination and scan the final exported image on your intended devices before distributing it. The app cannot guarantee that a third-party website, image URL, or email service will remain available.`,
                ],
            },
            {
                title: `A local demo, provided as available`,
                paragraphs: [
                    `This version has no backend. Local sign-in does not verify identity, protect data from other people using the device, or synchronize data between browsers. Browser storage may be unavailable, cleared, or removed by your browser. Keep downloaded copies of anything important.`,
                    `The tool is provided as available, without a guarantee of uninterrupted availability, data retention, or suitability for a particular use. Your generated codes remain your responsibility.`,
                ],
            },
        ],
    },
    privacy: {
        icon: `shield`,
        eyebrow: `CLEAR BY DESIGN`,
        title: `Your codes stay close to home.`,
        intro: `This version processes QR content in your browser. Here is what is stored locally and when a request can leave your device.`,
        sections: [
            {
                title: `What this browser remembers`,
                paragraphs: [
                    `Browser storage keeps your color and theme preferences, local demo profile details such as name and email, and saved QR codes with their content and design settings. The email field identifies a local profile; this demo does not send an email or verify the address.`,
                    `This information is not sent to an account backend. It remains accessible to this app in the same browser, and to people with access to your browser or device. Do not treat local demo profiles as private or secure accounts.`,
                ],
            },
            {
                title: `Images and external websites`,
                paragraphs: [
                    `Choosing a website icon or a custom public image URL can make your browser request that image from its provider. That provider may receive ordinary request information, including your IP address and browser details. Image requests are subject to the provider’s own privacy practices.`,
                    `A public URL does not guarantee permission to use an image or that it can be exported. Some providers block cross-origin image access. You can choose the built-in brand mark or turn the logo off to avoid loading an external logo image.`,
                ],
            },
            {
                title: `Scanning and sharing`,
                paragraphs: [
                    `The app generates direct QR codes with no app-hosted redirect or scan tracking. A QR code can reveal everything it encodes to anyone who scans it. A destination website can apply its own tracking and privacy practices when visited.`,
                    `The site host may process ordinary web requests to serve this app. Opening the Piratechs contact link takes you to an external website with its own policies.`,
                ],
            },
            {
                title: `Your choices`,
                paragraphs: [
                    `Delete a saved code from your collection whenever you like. To remove all locally stored information, use your browser’s site-data controls for this app. Clearing site data also removes saved profiles and preferences, and signing out alone does not erase saved codes.`,
                    `Saved information does not sync to another device, and this demo has no server backup. Download any codes you want to keep before clearing your browser data.`,
                ],
            },
        ],
    },
    contact: {
        icon: `mail`,
        eyebrow: `LET’S MAKE SOMETHING BETTER`,
        title: `A question? A good idea?`,
        intro: `For feedback, questions, or a project you have in mind, visit Piratechs and use the contact options available there.`,
        sections: [
            {
                title: `Tell us what you are making`,
                paragraphs: [
                    `If you are reporting a problem, include the browser and device you use, what you expected to happen, and what happened instead. A screenshot can help explain a layout or color issue.`,
                    `Avoid sharing private QR content, Wi-Fi passwords, or sensitive personal details. There is no support form or messaging backend connected to this demo.`,
                ],
            },
            {
                title: `Before you reach out`,
                paragraphs: [
                    `If a logo is missing from an export, its host may block cross-origin access. Try the built-in mark or a different publicly accessible image. If a QR does not scan reliably, use a darker color, turn off the center logo, and keep the white margin visible.`,
                    `Collections are stored on the browser where you created them. Signing in on another device will not bring those codes over; export the codes from the original browser.`,
                ],
            },
        ],
    },
};

export function getInfoPage(page: InfoPageKey) {
    return infoPages[page];
}

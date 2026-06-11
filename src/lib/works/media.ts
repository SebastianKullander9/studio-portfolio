import asciiData from "$lib/data/ascii.json";

const images = import.meta.glob<string>(
    "$lib/assets/works/**/*.{avif,webp,jpg,png}",
    { eager: true, query: "?url", import: "default" },
);

const videos = import.meta.glob<string>(
    "$lib/assets/works/**/*.{webm,mp4}",
    { eager: true, query: "?url", import: "default" },
);

function asciiKey(modulePath: string): string {
    const after = modulePath.split("/works/")[1] ?? "";
    return after.replace(/\.[^.]+$/, "");
}

function stripExt(p: string): string {
    return p.replace(/\.[^.]+$/, "");
}

export type MediaItem =
    | { type: "image"; src: string; ascii: string }
    | { type: "video"; src: string; ascii: string; pngSrc: string };

export function mediaFor(
    slug: string,
    format: "desktop" | "mobile",
): MediaItem[] {
    const inScope = (path: string) =>
        path.includes(`/works/${slug}/${format}/`);

    const scopedImgs = Object.entries(images).filter(
        ([p]) => inScope(p) && !p.includes(".poster."),
    );
    const scopedVids = Object.entries(videos).filter(([p]) => inScope(p));

    const claimedByVideo = new Set<string>();

    const vidItems = scopedVids.map(([vp, vsrc]) => {
        const base = stripExt(vp);
        const pngEntry = scopedImgs.find(([ip]) => stripExt(ip) === base);
        if (pngEntry) claimedByVideo.add(pngEntry[0]);
        const ascii = pngEntry
            ? ((asciiData as Record<string, string>)[asciiKey(pngEntry[0])] ?? "")
            : "";
        return {
            path: vp,
            item: {
                type: "video",
                src: vsrc,
                ascii,
                pngSrc: pngEntry?.[1] ?? "",
            } as MediaItem,
        };
    });

    const imgItems = scopedImgs
        .filter(([p]) => !claimedByVideo.has(p))
        .map(([p, src]) => ({
            path: p,
            item: {
                type: "image",
                src,
                ascii:
                    (asciiData as Record<string, string>)[asciiKey(p)] ?? "",
            } as MediaItem,
        }));

    const all = [...vidItems, ...imgItems]
        .sort((a, b) => a.path.localeCompare(b.path))
        .map(({ item }) => item);

    if (all.length === 0) {
        console.warn(`[works] no ${format} media found for "${slug}"`);
    }
    return all;
}

import { mediaFor } from "$lib/works/media";

type Kind = "Client" | "Personal" | "Concept";

interface RawWork {
    slug: string; // must match folder name exactly
    title: string;
    kind: Kind;
    year: number;
}

const rawWorks: RawWork[] = [
    {
        slug: "lewa",
        title: "Lewa Bostad",
        kind: "Client",
        year: 2026,
    },
    {
        slug: "overengineered",
        title: "Overengineered",
        kind: "Personal",
        year: 2025,
    },
    {
        slug: "reliwe",
        title: "Reliwe",
        kind: "Client",
        year: 2025,
    },
];

export const works = rawWorks.map((w) => ({
    ...w,
    desktop: mediaFor(w.slug, "desktop"),
    mobile: mediaFor(w.slug, "mobile"),
}));

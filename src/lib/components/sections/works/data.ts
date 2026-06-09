import asciiMap from "$lib/data/ascii.json";

const img = (path: string) => ({
    src: `/works/${path}.png`,
    ascii: asciiMap[path],
});

export const works = [
    {
        title: "Lewa Bostad",
        kind: "Client",
        images: [img("lewa/img1"), img("lewa/img2")],
        year: 2026,
    },
    {
        title: "Overengineered",
        kind: "Personal",
        images: [img("overengineered/img1"), img("overengineered/img2")],
        year: 2025,
    },
    {
        title: "StashBox",
        kind: "Personal",
        images: [img("stashbox/img1"), img("stashbox/img2")],
        year: 2026,
    },
    {
        title: "Concept1",
        kind: "Concept",
        images: [img("concept1/img1"), img("concept1/img2")],
        year: 2026,
    },
    {
        title: "Concept2",
        kind: "Concept",
        images: [img("concept2/img1"), img("concept2/img2")],
        year: 2026,
    },
    {
        title: "Concept3",
        kind: "Concept",
        images: [img("concept3/img1"), img("concept3/img2")],
        year: 2026,
    },
    {
        title: "3D fun",
        kind: "Personal",
        images: [img("fun/img1"), img("fun/img2")],
        year: 2025,
    },
];

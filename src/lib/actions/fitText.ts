import { typographyConfig as cfg } from "$lib/config/typography";

export function fitText(
    node: HTMLElement,
    { axis = "x" }: { axis?: "x" | "y" } = {},
) {
    const parent = node.parentElement!;
    const prop = axis === "x" ? "width" : "height";

    const fit = () => {
        const available =
            axis === "x" ? parent.offsetWidth : parent.offsetHeight;
        node.style.fontSize = `${cfg.marquee.baseFontSize}px`;
        node.style[prop] = "fit-content";
        const size =
            (axis === "x" ? node.scrollWidth : node.scrollHeight) *
            cfg.marquee.scrollWidthCorrection;
        node.style[prop] = "";
        if (!available || !size) return;
        node.style.fontSize = `${(cfg.marquee.baseFontSize * available) / size}px`;
    };

    const observer = new ResizeObserver(fit);
    document.fonts.ready.then(() => {
        fit();
        observer.observe(parent);
    });

    return {
        destroy() {
            observer.disconnect();
        },
    };
}

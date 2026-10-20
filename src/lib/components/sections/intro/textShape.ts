import type { TextShape } from "./types";

export type GridGeometry = {
    left: number;
    top: number;
    cellW: number;
    cellH: number;
    cols: number;
    rows: number;
};

const MIN_COVERAGE = 0.35;

export function textShape(el: Element, g: GridGeometry): TextShape {
    const box = el.getBoundingClientRect();
    const shape: TextShape = {
        cells: [],
        left: (box.left - g.left) / g.cellW,
        right: (box.right - g.left) / g.cellW,
    };

    const c0 = Math.max(0, Math.floor(shape.left));
    const c1 = Math.min(g.cols, Math.ceil(shape.right));
    const r0 = Math.max(0, Math.floor((box.top - g.top) / g.cellH));
    const r1 = Math.min(g.rows, Math.ceil((box.bottom - g.top) / g.cellH));
    if (c1 <= c0 || r1 <= r0) return shape;

    const originX = g.left + c0 * g.cellW;
    const originY = g.top + r0 * g.cellH;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil((c1 - c0) * g.cellW);
    canvas.height = Math.ceil((r1 - r0) * g.cellH);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.fillStyle = "#fff";

    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        let text = node.textContent?.trim();
        if (!text) continue;
        const cs = getComputedStyle(node.parentElement!);
        if (cs.textTransform === "uppercase") text = text.toUpperCase();
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.letterSpacing =
            cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        range.selectNodeContents(node);
        const r = range.getBoundingClientRect();
        const ascent = ctx.measureText(text).fontBoundingBoxAscent;
        ctx.fillText(text, r.left - originX, r.top - originY + ascent);
    }

    const { data, width } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
    );
    for (let row = r0; row < r1; row++) {
        const y0 = Math.round((row - r0) * g.cellH);
        const y1 = Math.min(
            canvas.height,
            Math.round((row - r0 + 1) * g.cellH),
        );
        for (let col = c0; col < c1; col++) {
            const x0 = Math.round((col - c0) * g.cellW);
            const x1 = Math.min(
                width,
                Math.round((col - c0 + 1) * g.cellW),
            );
            let ink = 0;
            for (let y = y0; y < y1; y++)
                for (let x = x0; x < x1; x++)
                    if (data[(y * width + x) * 4 + 3] > 127) ink++;
            if (ink >= MIN_COVERAGE * (x1 - x0) * (y1 - y0))
                shape.cells.push(row * g.cols + col);
        }
    }
    return shape;
}

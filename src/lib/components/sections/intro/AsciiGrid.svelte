<script lang="ts">
    import { onMount } from "svelte";
    import Styles from "./AsciiGrid.module.css";
    import { textShape } from "./textShape";
    import type { Frame, Layer } from "./types";

    let {
        layers,
        maskSelector = "header",
        pointerIgnoreSelector = "a, button",
    }: {
        layers: Layer[];
        maskSelector?: string;
        pointerIgnoreSelector?: string;
    } = $props();

    let grid = $state("");
    let canvasEl: HTMLPreElement;

    const FONT = "'Geist Mono', monospace";
    const INK_SAMPLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const MASK_MIN_OVERLAP = 0.3;

    let cols = 0;
    let rows = 0;
    let charAspect = 2;
    let cellW = 0;
    let cellH = 0;
    let cells: string[] = [];
    let styles: string[] = [];
    let mask = new Uint8Array(0);
    let rowInkTop = 0;
    let rowInkBottom = 0;
    let pointer: { x: number; y: number } | null = null;

    function measure() {
        const probe = document.createElement("span");
        probe.style.fontFamily = FONT;
        probe.style.fontSize = getComputedStyle(canvasEl).fontSize;
        probe.style.fontWeight = getComputedStyle(canvasEl).fontWeight;
        probe.style.lineHeight = "1";
        probe.style.visibility = "hidden";
        probe.style.position = "absolute";
        probe.textContent = "0";
        document.body.appendChild(probe);
        const { width, height } = probe.getBoundingClientRect();
        probe.remove();
        cols = Math.floor(canvasEl.clientWidth / width);
        rows = Math.floor(canvasEl.clientHeight / height);
        charAspect = height / width;
        cellW = width;
        cellH = height;

        const cs = getComputedStyle(canvasEl);
        const m = inkMetrics(
            `${cs.fontWeight} ${cs.fontSize} ${FONT}`,
            INK_SAMPLE,
        );
        const baseline = (cellH - (m.ascent + m.descent)) / 2 + m.ascent;
        rowInkTop = baseline - m.inkAscent;
        rowInkBottom = baseline + m.inkDescent;
    }

    let measureCtx: CanvasRenderingContext2D | null = null;
    function inkMetrics(font: string, text: string) {
        measureCtx ??= document.createElement("canvas").getContext("2d")!;
        measureCtx.font = font;
        const m = measureCtx.measureText(text);
        return {
            ascent: m.fontBoundingBoxAscent,
            descent: m.fontBoundingBoxDescent,
            inkAscent: m.actualBoundingBoxAscent,
            inkDescent: m.actualBoundingBoxDescent,
        };
    }

    function buildMask(origin: DOMRect) {
        const range = document.createRange();
        if (mask.length !== cols * rows)
            mask = new Uint8Array(cols * rows);
        else mask.fill(0);
        for (const root of document.querySelectorAll(maskSelector)) {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
            );
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (!node.textContent?.trim()) continue;
                range.selectNodeContents(node);
                const cs = getComputedStyle(node.parentElement!);
                let text = node.textContent.trim();
                if (cs.textTransform === "uppercase")
                    text = text.toUpperCase();
                const m = inkMetrics(
                    `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
                    text,
                );
                for (const r of range.getClientRects()) {
                    const c0 = Math.max(
                        0,
                        Math.floor((r.left - origin.left) / cellW),
                    );
                    const c1 = Math.min(
                        cols,
                        Math.ceil((r.right - origin.left) / cellW),
                    );
                    const top =
                        r.top - origin.top + m.ascent - m.inkAscent;
                    const bottom =
                        r.top - origin.top + m.ascent + m.inkDescent;
                    const minOverlap =
                        MASK_MIN_OVERLAP * (rowInkBottom - rowInkTop);
                    const r0 = Math.max(
                        0,
                        Math.floor((top - rowInkBottom) / cellH),
                    );
                    const r1 = Math.min(
                        rows,
                        Math.ceil((bottom - rowInkTop) / cellH),
                    );
                    for (let y = r0; y < r1; y++) {
                        const overlap =
                            Math.min(bottom, y * cellH + rowInkBottom) -
                            Math.max(top, y * cellH + rowInkTop);
                        if (overlap > minOverlap)
                            mask.fill(1, y * cols + c0, y * cols + c1);
                    }
                }
            }
        }
    }

    function mouseCell(origin: DOMRect): Frame["mouse"] {
        if (!pointer) return null;
        const col = Math.floor((pointer.x - origin.left) / cellW);
        const row = Math.floor((pointer.y - origin.top) / cellH);
        if (col < 0 || col >= cols || row < 0 || row >= rows) return null;
        return { col, row };
    }

    function handlePointerMove(e: PointerEvent) {
        const ignored = (e.target as Element | null)?.closest?.(
            pointerIgnoreSelector,
        );
        pointer =
            e.pointerType === "mouse" && !ignored
                ? { x: e.clientX, y: e.clientY }
                : null;
    }

    function handlePointerOut(e: PointerEvent) {
        if (!e.relatedTarget) pointer = null;
    }

    function handleClick(e: MouseEvent) {
        if ((e.target as Element | null)?.closest?.(pointerIgnoreSelector))
            return;
        const origin = canvasEl.getBoundingClientRect();
        const col = (e.clientX - origin.left) / cellW;
        const row = (e.clientY - origin.top) / cellH;
        const t = performance.now() * 0.001;
        const snapshot = cells.map((ch, i) => (mask[i] ? " " : ch));
        const geometry = {
            left: origin.left,
            top: origin.top,
            cellW,
            cellH,
            cols,
            rows,
        };
        const ctx = {
            cols,
            rows,
            snapshot,
            textShape: (el: Element) => textShape(el, geometry),
        };
        for (const layer of layers) layer.click?.(col, row, t, ctx);
    }

    function render(t: number) {
        const origin = canvasEl.getBoundingClientRect();
        buildMask(origin);

        const n = cols * rows;
        if (cells.length !== n) {
            cells = new Array(n);
            styles = new Array(n);
        }
        cells.fill(" ");
        styles.fill("");

        const frame: Frame = {
            cols,
            rows,
            t,
            charAspect,
            mouse: mouseCell(origin),
            mask,
        };
        for (const layer of layers) layer.render(frame, cells, styles);

        let out = "";
        for (let row = 0; row < rows; row++) {
            let open = "";
            for (let col = 0; col < cols; col++) {
                const i = row * cols + col;
                const style = mask[i] ? "" : styles[i];
                if (style !== open) {
                    if (open) out += "</span>";
                    if (style)
                        out += `<span class="${Styles[style] ?? style}">`;
                    open = style;
                }
                out += mask[i] ? " " : escape(cells[i]);
            }
            if (open) out += "</span>";
            out += "\n";
        }
        return out;
    }

    const ENTITIES: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
    };
    function escape(char: string) {
        return ENTITIES[char] ?? char;
    }

    let rafId: number;
    function tick(now: number) {
        if (cols > 0 && rows > 0) grid = render(now * 0.001);
        rafId = requestAnimationFrame(tick);
    }

    onMount(() => {
        let cancelled = false;
        const observer = new ResizeObserver(() => measure());
        document.fonts.load(`500 16px 'Geist Mono'`).finally(() => {
            if (cancelled) return;
            observer.observe(canvasEl);
            rafId = requestAnimationFrame(tick);
        });
        return () => {
            cancelled = true;
            observer.disconnect();
            cancelAnimationFrame(rafId);
        };
    });
</script>

<svelte:window
    onclick={handleClick}
    onpointermove={handlePointerMove}
    onpointerout={handlePointerOut}
/>

<pre bind:this={canvasEl} class={Styles.canvas}>{@html grid}</pre>

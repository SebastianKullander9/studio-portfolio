// $lib/actions/loadImageScramble.ts
import type { Action } from "svelte/action";

/* ================================================================
   CONFIG — all tuning knobs, with what they actually do
   ================================================================ */

/** Brightness ramp, darkest → densest. Must match scripts/ascii.js. */
const CHARS = " .:-=+*#%@";

/** Index of the resting character — the floor cells settle at and
 *  that light cells never leave. */
const DOT = CHARS.indexOf(".");

const DEFAULTS = {
    /** Grid resolution. MUST match COLS/ROWS in scripts/ascii.js;
     *  cols:rows (×charRatio) should match the image aspect. */
    cols: 80,
    rows: 22,

    /** How often (ms) blinking/growing cells re-roll their shimmer. */
    flickerMs: 30,

    /** Minimum silent wait (ms) before this card's journey starts,
     *  even if the image is already downloaded. The card stays
     *  completely blank during it. */
    delayMs: 250,

    /** Random extra silent wait per card, 0–jitterMs, so cards on
     *  fast or cached loads don't start in sync. */
    jitterMs: 500,

    /** PHASE 1 — population. Each cell appears (as a dot) at a random
     *  point in [0, populate] of the journey. Bigger = the dot field
     *  fills in over a longer stretch of the load. */
    populate: 0.3,

    /** How long (progress units) a newly appearing cell flickers
     *  between blank and dot before holding steady. The "jitter" of
     *  the population. 0 = dots pop in cleanly. */
    blink: 0.1,

    /** PHASE 2 — growth (dense cells only). After appearing, a cell
     *  waits a further random 0–spread before starting to climb the
     *  char ramp. Bigger = more staggered, organic development. */
    spread: 0.3,

    /** Shimmer depth while growing: a cell flickers between its
     *  current density level and up to this many levels below it.
     *  0 = clean monotonic growth, 2 = lively boil, 4+ = noisy. */
    shimmer: 2,

    /** Chase speed: each frame, displayed progress closes this
     *  fraction of the gap to real progress. Overall tempo lives
     *  here — raise it to make every card load in faster. */
    easing: 0.04,

    /** Per-card variation applied to easing. 0 = uniform. */
    easingSpread: 0.4,

    /** Crossfade duration (ms), ASCII out / image in. */
    fadeMs: 400,

    /** Glyph width ÷ font-size for the mono font. */
    charRatio: 0.6,

    /** How close (progress units) displayed must get to the end
     *  before revealing — exponential easing never quite arrives. */
    finishEpsilon: 0.005,

    /** Start fetching this far from the viewport. */
    prefetchMargin: "300px",
};

/* ================================================================ */

interface AsciiLoadParams extends Partial<typeof DEFAULTS> {
    ascii: string;
    src: string;
    eager?: boolean; // true = fetch immediately, skip viewport waiting
}

async function fetchWithProgress(
    src: string,
    onProgress: (p: number) => void,
): Promise<string> {
    const res = await fetch(src);
    if (!res.ok || !res.body) throw new Error(`Failed to fetch ${src}`);

    const total = Number(res.headers.get("Content-Length")) || 0;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) onProgress(received / total);
    }

    return URL.createObjectURL(new Blob(chunks));
}

export const asciiLoad: Action<HTMLImageElement, AsciiLoadParams> = (
    img,
    params,
) => {
    const cfg = { ...DEFAULTS, ...params };
    const { ascii, src, eager = false } = params;

    if (!ascii || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        img.src = src;
        return {};
    }

    /* Per-cell timeline:
       0 ......... appearAt[i] ... +blink ........ growAt[i] ....... +1
       blank      blink in        solid dot      climbing ramp   image char
       (light cells stop at "solid dot" forever)
       Full journey: 0 .. FINAL. Download drives 0..1; completion
       extends target to FINAL so late cells finish their growth. */
    const FINAL = cfg.populate + cfg.blink + cfg.spread + 1;

    const beat = cfg.delayMs + Math.random() * cfg.jitterMs;
    const ease =
        cfg.easing *
        (1 - cfg.easingSpread + Math.random() * cfg.easingSpread * 2);

    const totalCells = cfg.cols * cfg.rows;

    const asciiIdx = Uint8Array.from(ascii, (ch) =>
        Math.max(0, CHARS.indexOf(ch)),
    );

    /** When each cell blinks into existence. */
    const appearAt = Float32Array.from(
        { length: totalCells },
        () => Math.random() * cfg.populate,
    );

    /** When each dense cell starts climbing (always after its blink). */
    const growAt = Float32Array.from(
        { length: totalCells },
        (_, i) => appearAt[i] + cfg.blink + Math.random() * cfg.spread,
    );

    /** Random bytes per cell, re-rolled every flickerMs — drive both
     *  the blink-in flicker and the growth shimmer. */
    const randomCells = new Uint8Array(totalCells);
    function reshuffle() {
        for (let i = 0; i < totalCells; i++) {
            randomCells[i] = (Math.random() * 256) | 0;
        }
    }
    reshuffle();

    // --- overlay ---------------------------------------------------
    const pre = document.createElement("pre");
    pre.setAttribute("aria-hidden", "true");
    Object.assign(pre.style, {
        position: "absolute",
        inset: "0",
        margin: "0",
        overflow: "hidden",
        pointerEvents: "none",
        fontFamily: "var(--font-mono)",
    });
    img.style.opacity = "0";
    img.parentElement?.appendChild(pre); // parent must be position: relative

    function fit() {
        const { width, height } = img.getBoundingClientRect();
        pre.style.fontSize = `${width / (cfg.cols * cfg.charRatio)}px`;
        pre.style.lineHeight = `${height / cfg.rows}px`;
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(img);

    // --- rendering -------------------------------------------------
    function render(progress: number) {
        let out = "";
        for (let i = 0; i < totalCells; i++) {
            const appear = appearAt[i];

            if (progress < appear) {
                // Not yet born.
                out += " ";
            } else if (progress < appear + cfg.blink) {
                // Blinking into existence.
                out += randomCells[i] & 1 ? CHARS[DOT] : " ";
            } else {
                const tgt = asciiIdx[i];
                if (tgt <= DOT) {
                    // Light cells: a dot, forever.
                    out += CHARS[DOT];
                } else {
                    const g = Math.min(
                        Math.max(progress - growAt[i], 0),
                        1,
                    );
                    if (g >= 1) {
                        out += CHARS[tgt];
                    } else {
                        const ceil = DOT + Math.round(g * (tgt - DOT));
                        const low = Math.max(DOT, ceil - cfg.shimmer);
                        out +=
                            CHARS[
                                low + (randomCells[i] % (ceil - low + 1))
                            ];
                    }
                }
            }

            if ((i + 1) % cfg.cols === 0) out += "\n";
        }
        pre.textContent = out;
    }

    render(0); // blank frame for offscreen/lazy cards

    // --- state -----------------------------------------------------
    let frame = 0;
    let start: number | null = null;
    let lastShuffle = 0;
    let target = 0;
    let displayed = 0;
    let objectUrl: string | null = null;
    let failed = false;
    let done = false;
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined;

    function loop(t: number) {
        if (done) return;
        if (start === null) start = t;

        if (t - start < beat) {
            // Silent: stay completely blank until this card's start.
        } else {
            if (t - lastShuffle >= cfg.flickerMs) {
                reshuffle();
                lastShuffle = t;
            }

            displayed += (target - displayed) * ease;
            render(displayed);

            if (
                displayed > FINAL - cfg.finishEpsilon &&
                (objectUrl || failed)
            ) {
                render(FINAL);
                reveal();
                return;
            }
        }
        frame = requestAnimationFrame(loop);
    }

    function reveal() {
        if (done) return;
        done = true;
        if (objectUrl) img.src = objectUrl;

        const show = () => {
            pre.style.transition = `opacity ${cfg.fadeMs}ms ease`;
            img.style.transition = `opacity ${cfg.fadeMs}ms ease`;
            pre.style.opacity = "0";
            img.style.opacity = "1";
            cleanupTimer = setTimeout(() => {
                ro.disconnect();
                pre.remove();
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            }, cfg.fadeMs);
        };
        img.decode().then(show, show);
    }

    function startLoading() {
        frame = requestAnimationFrame(loop);
        fetchWithProgress(src, (p) => {
            target = Math.max(target, p); // download drives 0..1
        })
            .then((url) => {
                objectUrl = url;
                target = FINAL;
            })
            .catch(() => {
                // Progress streaming failed — let the browser load it.
                failed = true;
                img.src = src;
                target = FINAL;
            });
    }

    let io: IntersectionObserver | null = null;
    if (eager) {
        startLoading();
    } else {
        io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    io?.disconnect();
                    io = null;
                    startLoading();
                }
            },
            { rootMargin: cfg.prefetchMargin },
        );
        io.observe(img);
    }

    return {
        destroy() {
            done = true;
            cancelAnimationFrame(frame);
            clearTimeout(cleanupTimer);
            io?.disconnect();
            ro.disconnect();
            pre.remove();
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        },
    };
};

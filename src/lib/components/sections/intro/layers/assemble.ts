import type { Layer, TextShape } from "../types";

type Options = {
    target: () => Element | null;
    chars?: string;
    onstart?: () => void;
    onreveal?: (p: number) => void;
    ondone?: () => void;
};

type Particle = {
    ch: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    launch: number;
    target: number;
    gatherAt: number;
    gx: number;
    gy: number;
    px: number;
    py: number;
};

const EXPLODE = 0.7;
const GATHER = 1.1;
const GATHER_STAGGER = 0.35;
const SETTLE = 0.5;
const REVEAL = 0.6;

const BLAST = 40;
const BLAST_FALLOFF = 12;
const LIFT = 18;
const GRAVITY = 70;
const SHOCK_SPEED = 150;
const SCRAMBLE_RATE = 20;
const SETTLED_RATE = 3;
const TRAIL = 0.04;
const SORT_JITTER = 6;

const easeInOutCubic = (k: number) =>
    k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
const easeOutCubic = (k: number) => 1 - (1 - k) ** 3;
const clamp01 = (k: number) => Math.min(1, Math.max(0, k));

export function assemble({
    target,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ",
    onstart,
    onreveal,
    ondone,
}: Options): Layer {
    const randomChar = () =>
        chars[Math.floor(Math.random() * chars.length)];

    let start = -1;
    let particles: Particle[] = [];
    let shape: TextShape = { cells: [], left: 0, right: 0 };
    let assigned = false;
    let finished = false;
    let aspect = 2;
    let cols = 0;
    let lastT = 0;

    function spawn(ch: string, x: number, y: number): Particle {
        return {
            ch,
            x,
            y,
            vx: 0,
            vy: 0,
            launch: 0,
            target: -1,
            gatherAt: 0,
            gx: NaN,
            gy: NaN,
            px: x,
            py: y,
        };
    }

    function kick(p: Particle, cx: number, cy: number) {
        let dx = p.x - cx;
        let dy = p.y - cy;
        const d = Math.hypot(dx, dy);
        let speed = BLAST / (1 + d / BLAST_FALLOFF);
        if (d < 0.5) {
            const a = Math.random() * Math.PI * 2;
            dx = Math.cos(a);
            dy = Math.sin(a);
            speed = BLAST * (0.3 + Math.random() * 0.9);
        } else {
            const a = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
            dx = Math.cos(a);
            dy = Math.sin(a);
            speed *= 0.6 + Math.random() * 0.8;
        }
        p.vx = dx * speed;
        p.vy = dy * speed - LIFT * (0.5 + Math.random());
        p.launch = d / SHOCK_SPEED;
    }

    function assign() {
        const pool = [...particles].sort(() => Math.random() - 0.5);
        const gatherers = pool.slice(0, shape.cells.length);
        const jitter = () => (Math.random() - 0.5) * SORT_JITTER;
        const byX = gatherers
            .map((p) => ({ p, k: p.x * aspect + jitter() }))
            .sort((a, b) => a.k - b.k);
        const targets = shape.cells
            .map((i) => ({ i, k: (i % cols) + jitter() }))
            .sort((a, b) => a.k - b.k);
        byX.forEach(({ p }, n) => {
            p.target = targets[n].i;
            p.gatherAt = EXPLODE + Math.random() * GATHER_STAGGER;
        });
    }

    return {
        click(col, row, t, ctx) {
            if (start >= 0) return;
            start = t;
            onstart?.();
            cols = ctx.cols;
            const el = target();
            if (el) shape = ctx.textShape(el);

            particles = [];
            ctx.snapshot.forEach((ch, i) => {
                if (ch !== " ")
                    particles.push(
                        spawn(
                            ch,
                            (i % cols) / aspect,
                            Math.floor(i / cols),
                        ),
                    );
            });
            const cx = (col - 0.5) / aspect;
            const cy = row - 0.5;
            for (let n = particles.length; n < shape.cells.length; n++)
                particles.push(spawn(randomChar(), cx, cy));
            for (const p of particles) kick(p, cx, cy);
        },

        render({ cols: gridCols, rows, t, charAspect }, cells, styles) {
            const dt = Math.min(0.05, t - lastT);
            lastT = t;
            aspect = charAspect;
            if (start < 0) return;

            cells.fill(" ");
            styles.fill("");
            if (finished) return;

            const age = t - start;
            if (!assigned && age >= EXPLODE) {
                assign();
                assigned = true;
            }

            const revealStart = EXPLODE + GATHER_STAGGER + GATHER + SETTLE;
            const reveal = easeOutCubic(
                clamp01((age - revealStart) / REVEAL),
            );
            const wipeCol =
                shape.left + reveal * (shape.right - shape.left);
            if (age >= revealStart) onreveal?.(reveal);

            const put = (
                x: number,
                y: number,
                ch: string,
                style: string,
                over: boolean,
            ) => {
                const col = Math.round(x * aspect);
                const row = Math.round(y);
                if (col < 0 || col >= gridCols || row < 0 || row >= rows)
                    return;
                if (reveal > 0 && col < wipeCol) return;
                const i = row * gridCols + col;
                if (!over && cells[i] !== " ") return;
                cells[i] = ch;
                styles[i] = style;
            };

            for (const p of particles) {
                let moving = age >= p.launch;
                if (moving && (p.target < 0 || age < p.gatherAt)) {
                    p.vy += GRAVITY * dt;
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                } else if (moving) {
                    if (Number.isNaN(p.gx)) {
                        p.gx = p.x;
                        p.gy = p.y;
                    }
                    const k = clamp01((age - p.gatherAt) / GATHER);
                    const e = easeInOutCubic(k);
                    p.x = p.gx + ((p.target % cols) / aspect - p.gx) * e;
                    p.y = p.gy + (Math.floor(p.target / cols) - p.gy) * e;
                    moving = k < 1;
                }

                const rate = moving
                    ? SCRAMBLE_RATE
                    : age >= p.launch
                      ? SETTLED_RATE
                      : 0;
                if (Math.random() < rate * dt) p.ch = randomChar();

                if (moving && dt > 0) {
                    const tx = p.x - ((p.x - p.px) / dt) * TRAIL;
                    const ty = p.y - ((p.y - p.py) / dt) * TRAIL;
                    const steps = Math.round(
                        Math.max(
                            Math.abs((p.x - tx) * aspect),
                            Math.abs(p.y - ty),
                        ),
                    );
                    for (let s = 1; s <= steps; s++) {
                        const f = s / (steps + 1);
                        put(
                            tx + (p.x - tx) * f,
                            ty + (p.y - ty) * f,
                            ".",
                            "dim",
                            false,
                        );
                    }
                }
                p.px = p.x;
                p.py = p.y;

                put(p.x, p.y, p.ch, "", true);
            }

            if (age >= revealStart + REVEAL) {
                finished = true;
                particles = [];
                ondone?.();
            }
        },
    };
}

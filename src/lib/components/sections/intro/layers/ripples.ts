import type { Layer } from "../types";

type Options = {
    ramp?: string;
    speed?: number;
    thickness?: number;
    lifetime?: number;
    rain?: number;
};

type Drop = { x: number; y: number; t: number };

export function ripples({
    ramp = " .:!#SEBATIN",
    speed = 4,
    thickness = 1,
    lifetime = 3,
    rain = 0.65,
}: Options = {}): Layer {
    let drops: Drop[] = [];
    let lastT = 0;
    const last = ramp.length - 1;

    return {
        click(col, row, t) {
            drops.push({ x: col, y: row, t });
        },

        render({ cols, rows, t, charAspect, mask }, cells) {
            const dt = Math.min(0.05, t - lastT);
            lastT = t;
            if (Math.random() < (rain * cols * rows * dt) / 1000)
                drops.push({
                    x: Math.random() * cols,
                    y: Math.random() * rows,
                    t,
                });
            drops = drops.filter((d) => t - d.t < lifetime);
            if (drops.length === 0) return;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const i = row * cols + col;
                    if (mask[i]) continue;
                    let v = 0;
                    for (const d of drops) {
                        const age = t - d.t;
                        const dist = Math.hypot(
                            (col - d.x) / charAspect,
                            row - d.y,
                        );
                        const ring = age * speed;
                        v +=
                            Math.exp(-((dist - ring) ** 2) / thickness) *
                            (1 - age / lifetime);
                    }
                    cells[i] = ramp[Math.floor(Math.min(1, v) * last)];
                }
            }
        },
    };
}

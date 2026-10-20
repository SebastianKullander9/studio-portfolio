import type { Layer } from "../types";

type Options = {
    pad?: number;
    lag?: number;
};

export function cursorLabel(
    text = "CLICK",
    { pad = 0, lag = 12 }: Options = {},
): Layer {
    let pos: { col: number; row: number } | null = null;
    let lastT = 0;

    return {
        render({ cols, rows, t, mouse }, cells, styles) {
            const dt = t - lastT;
            lastT = t;
            if (!mouse) {
                pos = null;
                return;
            }

            const targetRow = mouse.row > 0 ? mouse.row - 1 : mouse.row + 1;
            const centred = mouse.col - Math.floor(text.length / 2);
            const targetCol = Math.max(0, Math.min(cols - text.length, centred));

            if (!pos) {
                pos = { col: targetCol, row: targetRow };
            } else {
                const k = 1 - Math.exp(-lag * dt);
                pos.col += (targetCol - pos.col) * k;
                pos.row += (targetRow - pos.row) * k;
            }

            const labelRow = Math.round(pos.row);
            const start = Math.round(pos.col);
            for (let row = labelRow - pad; row <= labelRow + pad; row++) {
                if (row < 0 || row >= rows) continue;
                for (let col = start - pad; col < start + text.length + pad; col++) {
                    if (col < 0 || col >= cols) continue;
                    const j = col - start;
                    const inWord = row === labelRow && j >= 0 && j < text.length;
                    cells[row * cols + col] = inWord ? text[j] : " ";
                    styles[row * cols + col] = inWord ? "label" : "";
                }
            }
        },
    };
}

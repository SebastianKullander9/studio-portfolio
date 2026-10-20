export type Frame = {
    cols: number;
    rows: number;
    t: number;
    charAspect: number;
    mouse: { col: number; row: number } | null;
    mask: Uint8Array;
};

export type TextShape = {
    cells: number[];
    left: number;
    right: number;
};

export type ClickContext = {
    cols: number;
    rows: number;
    snapshot: readonly string[];
    textShape(el: Element): TextShape;
};

export type Layer = {
    render(frame: Frame, cells: string[], styles: string[]): void;
    click?(col: number, row: number, t: number, ctx: ClickContext): void;
};

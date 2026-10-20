type Params = {
    delay?: number;
    ramp?: number;
    ready?: boolean;
};

export function rollIn(node: HTMLElement, params: Params = {}) {
    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let started = false;

    const begin = ({ delay = 1000, ramp = 1200, ready = true }: Params) => {
        if (!ready || started) return;
        started = true;

        const animations = node.getAnimations({ subtree: true });
        for (const a of animations) a.playbackRate = 0;

        let start = 0;
        const step = (now: number) => {
            start ||= now;
            const k = Math.min(1, (now - start) / ramp);
            for (const a of animations) a.playbackRate = k * k;
            if (k < 1) rafId = requestAnimationFrame(step);
        };
        timeoutId = setTimeout(
            () => (rafId = requestAnimationFrame(step)),
            delay,
        );
    };
    begin(params);

    return {
        update: begin,
        destroy() {
            clearTimeout(timeoutId);
            cancelAnimationFrame(rafId);
        },
    };
}

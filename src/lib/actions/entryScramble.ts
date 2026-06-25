import { scrambleConfig as cfg } from "$lib/config/hoverScramble";

const CHARS = cfg.chars;

export function entryScramble(
    element: HTMLElement,
    params?: {
        scrambleDuration?: number;
        scrambleInterval?: number;
        resolveFrames?: number;
        resolveInterval?: number;
    },
) {
    const config = { ...cfg, ...params };
    const original = element.textContent ?? "";
    const allIndices = original
        .split("")
        .map((_, i) => i)
        .filter((i) => original[i] !== " ");

    let rafId: ReturnType<typeof setTimeout>;
    let timeoutId: ReturnType<typeof setTimeout>;
    let lockedChars: boolean[] = Array(original.length).fill(false);
    let isResolving = false;

    const render = () => {
        element.textContent = original
            .split("")
            .map((char, i) => {
                if (char === " ") return char;
                if (lockedChars[i]) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");
    };

    const stop = () => {
        clearTimeout(timeoutId);
        clearTimeout(rafId);
        element.textContent = original;
    };

    const resolve = () => {
        isResolving = true;
        let frame = 0;
        const shuffled = [...allIndices].sort(() => Math.random() - 0.5);

        const step = () => {
            const eased = 1 - Math.pow(1 - frame / config.resolveFrames, 3);
            const numLocked = Math.floor(eased * shuffled.length);
            shuffled.slice(0, numLocked).forEach((i) => {
                lockedChars[i] = true;
            });
            render();
            if (frame < config.resolveFrames) {
                frame++;
                rafId = setTimeout(
                    () => requestAnimationFrame(step),
                    config.resolveInterval,
                );
            } else {
                stop();
            }
        };

        step();
    };

    const animate = () => {
        if (isResolving) return;
        render();
        rafId = setTimeout(
            () => requestAnimationFrame(animate),
            config.scrambleInterval,
        );
    };

    animate();
    timeoutId = setTimeout(() => {
        clearTimeout(rafId);
        resolve();
    }, config.scrambleDuration);

    return {
        destroy() {
            stop();
        },
    };
}

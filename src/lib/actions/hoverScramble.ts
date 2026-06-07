import { scrambleConfig as cfg } from "$lib/config/hoverScramble";
const CHARS = cfg.chars;

export function hoverScramble(element: HTMLElement) {
    const original = element.textContent ?? "";
    let rafId: ReturnType<typeof setTimeout>;
    let timeoutId: ReturnType<typeof setTimeout>;
    let activeIndices: number[] = [];
    let lockedChars: boolean[] = Array(original.length).fill(false);
    let isResolving = false;

    const getCharIndex = (mouseX: number): number => {
        const rect = element.getBoundingClientRect();
        const charWidth = rect.width / original.length;
        return Math.floor((mouseX - rect.left) / charWidth);
    };

    const getAffectedIndices = (center: number): number[] => {
        const indices = [];
        for (let i = center - cfg.neighbourRadius; i <= center + cfg.neighbourRadius; i++) {
            if (i >= 0 && i < original.length && original[i] !== " ") {
                indices.push(i);
            }
        }
        return indices;
    };

    const render = (scrambledIndices: number[]) => {
        element.textContent = original
            .split("")
            .map((char, i) => {
                if (char === " ") return char;
                if (scrambledIndices.includes(i) && !lockedChars[i]) {
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }
                return original[i];
            })
            .join("");
    };

    const stopScramble = () => {
        clearTimeout(timeoutId);
        clearTimeout(rafId);
        isResolving = false;
        lockedChars = Array(original.length).fill(false);
        activeIndices = [];
        element.textContent = original;
    };

    const resolve = (affected: number[], speed: number = cfg.resolveInterval) => {
        isResolving = true;
        const totalFrames = cfg.resolveFrames;
        let frame = 0;
        const shuffled = [...affected].sort(() => Math.random() - 0.5);

        const step = () => {
            const progress = frame / totalFrames;
            const eased = 1 - Math.pow(1 - progress, 3);
            const numLocked = Math.floor(eased * shuffled.length);

            shuffled.slice(0, numLocked).forEach((i) => {
                lockedChars[i] = true;
            });

            render(affected);

            if (frame < totalFrames) {
                frame++;
                rafId = setTimeout(() => requestAnimationFrame(step), speed);
            } else {
                stopScramble();
            }
        };

        step();
    };

    const animate = (affected: number[]) => {
        if (isResolving) return;
        render(affected);
        rafId = setTimeout(
            () => requestAnimationFrame(() => animate(affected)),
            cfg.scrambleInterval,
        );
    };

    const onMouseMove = (e: MouseEvent) => {
        if (isResolving) return;

        const index = getCharIndex(e.clientX);
        const newAffected = getAffectedIndices(index);

        if (JSON.stringify(newAffected) === JSON.stringify(activeIndices)) return;

        clearTimeout(timeoutId);
        clearTimeout(rafId);
        activeIndices = newAffected;

        animate(newAffected);

        timeoutId = setTimeout(() => {
            clearTimeout(rafId);
            resolve(newAffected, cfg.resolveInterval);
        }, cfg.scrambleDuration);
    };

    const onLeave = () => {
        clearTimeout(timeoutId);
        clearTimeout(rafId);
        if (activeIndices.length > 0) {
            resolve(activeIndices, cfg.resolveLeaveInterval);
        } else {
            stopScramble();
        }
    };

    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseleave", onLeave);

    return {
        destroy() {
            element.removeEventListener("mousemove", onMouseMove);
            element.removeEventListener("mouseleave", onLeave);
        },
    };
}

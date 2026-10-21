const FULLY_VISIBLE = 0.95;

const nodes = new Set<HTMLElement>();
let active: HTMLElement[] = [];
let rafId = 0;
let query: MediaQueryList | null = null;

const setActive = (next: HTMLElement[]) => {
    if (next.length === active.length && next.every((el, i) => el === active[i])) return;
    for (const el of active) el.removeAttribute("data-focused");
    for (const el of next) el.setAttribute("data-focused", "");
    active = next;
};

const measure = () => {
    rafId = 0;
    if (!query?.matches) return setActive([]);

    const half = window.innerHeight / 2;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const fromTop = window.scrollY;
    const fromBottom = maxScroll - window.scrollY;

    let focusY = half;
    if (fromTop < half) focusY = Math.max(0, fromTop);
    else if (fromBottom < half) focusY = window.innerHeight - Math.max(0, fromBottom);

    const rows = new Map<number, { els: HTMLElement[]; center: number; visible: number }>();
    for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const key = Math.round(rect.top);
        const row = rows.get(key);
        if (row) row.els.push(el);
        else {
            const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            rows.set(key, {
                els: [el],
                center: rect.top + rect.height / 2,
                visible: Math.max(0, shown) / rect.height,
            });
        }
    }

    let next: HTMLElement[] = [];
    let best = half;
    let mostVisible = 0;
    let fallback: HTMLElement[] = [];
    for (const { els, center, visible } of rows.values()) {
        if (visible > mostVisible) {
            mostVisible = visible;
            fallback = els;
        }
        if (visible < FULLY_VISIBLE) continue;
        const dist = Math.abs(center - focusY);
        if (dist < best) {
            best = dist;
            next = els;
        }
    }
    setActive(next.length ? next : fallback);
};

const schedule = () => {
    rafId ||= requestAnimationFrame(measure);
};

export function scrollFocus(node: HTMLElement) {
    if (nodes.size === 0) {
        query = window.matchMedia("(hover: none)");
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        query.addEventListener("change", schedule);
    }
    nodes.add(node);
    schedule();

    return {
        destroy() {
            nodes.delete(node);
            if (active.includes(node)) setActive(active.filter((el) => el !== node));
            if (nodes.size === 0) {
                window.removeEventListener("scroll", schedule);
                window.removeEventListener("resize", schedule);
                query?.removeEventListener("change", schedule);
                cancelAnimationFrame(rafId);
                rafId = 0;
            } else {
                schedule();
            }
        },
    };
}

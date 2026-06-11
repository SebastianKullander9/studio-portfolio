<script lang="ts">
    import styles from "./ProjectCard.module.css";
    import clsx from "clsx";
    import { asciiLoad } from "$lib/actions/loadImageScramble";
    import type { MediaItem } from "$lib/works/media";

    let {
        title,
        kind,
        media,
        index,
        format,
    }: {
        title: string;
        kind: string;
        media: MediaItem[];
        index: number;
        format: "desktop" | "mobile";
    } = $props();

    let videoEls = $state<(HTMLVideoElement | null)[]>([]);
    let imgEls = $state<(HTMLImageElement | null)[]>([]);

    function onVideoReveal(i: number) {
        const vid = videoEls[i];
        const img = imgEls[i];
        vid?.play();
        if (vid) {
            vid.style.transition = `opacity 400ms ease`;
            vid.style.opacity = "1";
        }
        if (img) {
            img.style.transition = `opacity 400ms ease`;
            img.style.opacity = "0";
        }
    }
</script>

<div
    class={clsx(styles.grid, {
        "grid-inherit-square": format === "mobile",
        "grid-inherit-half": format === "desktop",
    })}
>
    {#each media as item, i}
        <div class={styles.work}>
            <div
                class={format === "desktop"
                    ? styles.frameDesktop
                    : styles.frameMobile}
            >
                {#if item.type === "video"}
                    <video
                        bind:this={videoEls[i]}
                        class={styles.image}
                        src={item.src}
                        muted
                        loop
                        playsinline
                        style="opacity: 0"
                    ></video>
                    <img
                        bind:this={imgEls[i]}
                        class={styles.image}
                        style="position: absolute; inset: 0; z-index: 1"
                        alt="{title} — view {i + 1}"
                        use:asciiLoad={{
                            ascii: item.ascii,
                            src: item.pngSrc,
                            delayMs: 150 + (index * 2 + i) * 90,
                            jitterMs: 120,
                            onReveal: () => onVideoReveal(i),
                        }}
                    />
                {:else}
                    <img
                        class={styles.image}
                        alt="{title} — view {i + 1}"
                        use:asciiLoad={{
                            ascii: item.ascii,
                            src: item.src,
                            delayMs: 150 + (index * 2 + i) * 90,
                            jitterMs: 120,
                        }}
                    />
                {/if}
            </div>
            <div class={styles.info}>
                <h3>{title}</h3>
                <p>WRK{index + 1} - {kind}</p>
            </div>
        </div>
    {/each}
</div>

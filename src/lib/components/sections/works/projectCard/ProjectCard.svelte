<script>
    import styles from "./ProjectCard.module.css";
    import clsx from "clsx";
    import { asciiLoad } from "$lib/actions/loadImageScramble";

    let { title, kind, images, index } = $props();
</script>

<div class={clsx("grid-inherit-half", styles.grid)}>
    {#each images as image, i}
        <div class={styles.work}>
            <div class={styles.frame}>
                <img
                    class={styles.image}
                    alt="{title} — view {i + 1}"
                    use:asciiLoad={{
                        ascii: image.ascii,
                        src: image.src,
                        delayMs: 150 + (index * 2 + i) * 90,
                        jitterMs: 120,
                    }}
                />
            </div>
            <div class={styles.info}>
                <h3>{title}</h3>
                <p>WRK{index + 1} - {kind}</p>
            </div>
        </div>
    {/each}
</div>

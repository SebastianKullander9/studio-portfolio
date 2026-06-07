<script lang="ts">
    import { onMount } from "svelte";
    import styles from "./Page.module.css";
    import { typographyConfig as cfg } from "$lib/config/typography";

    let marqueeEl: HTMLHeadingElement;

    onMount(() => {
        const fitText = () => {
            marqueeEl.style.fontSize = `${cfg.marquee.baseFontSize}px`;
            marqueeEl.style.width = "fit-content";
            const containerWidth = marqueeEl.parentElement!.offsetWidth;
            const textWidth = marqueeEl.scrollWidth * cfg.marquee.scrollWidthCorrection;
            const ratio = containerWidth / textWidth;
            marqueeEl.style.fontSize = `${cfg.marquee.baseFontSize * ratio}px`;
            marqueeEl.style.width = "100%";
        };

        document.fonts.ready.then(() => {
            fitText();
        });

        window.addEventListener("resize", fitText);
        return () => window.removeEventListener("resize", fitText);
    });
</script>

<div class={styles.container}>
    <div>
        <div class={styles.textWrapper}>
            <div class={styles.eyebrow}>
                <p>Independent developer building precise digital experiences.</p>
                <p>Based in Stockholm, Sweden.</p>
            </div>
            <h1 class={styles.marquee} bind:this={marqueeEl}>SEBASTIAN.STUDIO</h1>
        </div>
    </div>
</div>

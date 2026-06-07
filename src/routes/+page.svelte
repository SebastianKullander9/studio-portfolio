<script lang="ts">
    import { onMount } from "svelte";
    import styles from "./Page.module.css";

    let marqueeEl: HTMLHeadingElement;

    onMount(() => {
        const fitText = () => {
            marqueeEl.style.fontSize = "100px";
            marqueeEl.style.width = "fit-content";
            const containerWidth = marqueeEl.parentElement!.offsetWidth;
            const textWidth = marqueeEl.scrollWidth * 0.992;
            const ratio = containerWidth / textWidth;
            marqueeEl.style.fontSize = `${100 * ratio}px`;
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

<script lang="ts">
    import clsx from "clsx";
    import styles from "./List.module.css";
    import { hoverScramble } from "$lib/actions/hoverScramble";

    let { works } = $props();
</script>

<div class={clsx("grid-inherit", styles.resetGap)}>
    {#each works as work, i}
        <div class={styles.row}>
            <p use:hoverScramble>00{i + 1}</p>
            <p use:hoverScramble>{work.title}</p>
            <p use:hoverScramble>{work.year}</p>
        </div>
    {/each}
</div>

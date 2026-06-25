<script lang="ts">
    import clsx from "clsx";
    import styles from "./DitherOverlay.module.css";
    import { contactMenu } from "$lib/state/contact.svelte";

    let { active = false }: { active?: boolean } = $props();
</script>

<div
    class={clsx(styles.dither, active && styles.isActive)}
    aria-hidden="true"
    onclick={() => contactMenu.close()}
></div>

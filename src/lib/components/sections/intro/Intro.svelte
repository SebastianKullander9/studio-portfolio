<script lang="ts">
    import AsciiGrid from "./AsciiGrid.svelte";
    import Styles from "./Intro.module.css";
    import { ripples } from "./layers/ripples";
    import { cursorLabel } from "./layers/cursor";
    import { assemble } from "./layers/assemble";
    import { scrambleConfig } from "$lib/config/hoverScramble";

    let {
        target,
        onstart,
        onreveal,
        ondone,
    }: {
        target: () => Element | null;
        onstart?: () => void;
        onreveal?: (p: number) => void;
        ondone?: () => void;
    } = $props();

    let started = $state(false);

    const layers = [
        ripples(),
        cursorLabel("CLICK"),
        assemble({
            target: () => target(),
            chars: scrambleConfig.chars,
            onstart: () => {
                started = true;
                onstart?.();
            },
            onreveal: (p) => onreveal?.(p),
            ondone: () => ondone?.(),
        }),
    ];
</script>

<AsciiGrid {layers} maskSelector="header, .{Styles.caption}" />

{#if !started}
    <p class={Styles.caption}>
        <span class={Styles.touch}>Tap</span><span class={Styles.mouse}
            >Click</span
        > to proceed
    </p>
{/if}

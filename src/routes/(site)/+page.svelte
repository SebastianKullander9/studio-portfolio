<script lang="ts">
    import styles from "./Page.module.css";
    import Intro from "$lib/components/sections/intro/Intro.svelte";
    import { fitText } from "$lib/actions/fitText";
    import { rollIn } from "$lib/actions/rollIn";
    import { entryScramble } from "$lib/actions/entryScramble";
    import { homeIntro } from "$lib/state/intro.svelte";

    const play = !homeIntro.seen;

    let marqueeEl: HTMLHeadingElement;
    let tickerEl: HTMLHeadingElement;
    let reveal = $state(0);
    let done = $state(!play);

    const clip = $derived(
        done ? null : `inset(-20% ${(1 - reveal) * 100}% -20% 0)`,
    );
</script>

{#snippet intro()}
    {#if done}
        <p use:entryScramble>Independent developer building precise digital experiences.</p>
        <p use:entryScramble>Based in Stockholm, Sweden.</p>
    {/if}
{/snippet}

{#if !done}
    <Intro
        target={() =>
            marqueeEl.getClientRects().length ? marqueeEl : tickerEl}
        onstart={() => (homeIntro.seen = true)}
        onreveal={(p) => (reveal = p)}
        ondone={() => (done = true)}
    />
{/if}

<div class={styles.page}>
    <div class={[styles.mobile, styles.textWrapperMobile]}>
        {@render intro()}
    </div>
    <div class={styles.textWrapperDesktop}>
        <div class={[styles.eyebrow, styles.desktop]}>
            {@render intro()}
        </div>

        <h1
            class="{styles.marquee} {styles.desktop}"
            bind:this={marqueeEl}
            style:clip-path={clip}
            use:fitText
        >
            SEBASTIAN.STUDIO
        </h1>
        <h1
            class="{styles.mobile} {styles.name}"
            aria-label="SEBASTIAN.STUDIO"
            bind:this={tickerEl}
            style:clip-path={clip}
            use:rollIn={{ ready: done }}
        >
            <span class={styles.ticker} aria-hidden="true">
                <span class={[styles.track, done && styles.leftward]}>
                    <span>SEBASTIAN</span>
                    <span>SEBASTIAN</span>
                    <span>SEBASTIAN</span>
                    <span>SEBASTIAN</span>
                </span>
            </span>
            <span class={styles.ticker} aria-hidden="true">
                <span class={[styles.track, done && styles.rightward]}>
                    <span>STUDIO</span>
                    <span>STUDIO</span>
                    <span>STUDIO</span>
                    <span>STUDIO</span>
                </span>
            </span>
        </h1>
    </div>
</div>

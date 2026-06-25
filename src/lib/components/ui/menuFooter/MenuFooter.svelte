<script lang="ts">
    import styles from "./MenuFooter.module.css";
    import { hoverScramble } from "$lib/actions/hoverScramble";
    import { entryScramble } from "$lib/actions/entryScramble";
    import { socials } from "./socials";
    import Clock from "../clock/Clock.svelte";

    const scramble = { scrambleDuration: 100, resolveFrames: 15 };
</script>

<div class={styles.footer}>
    <div class="stack">
        <h2 use:entryScramble={scramble}>SOCIALS</h2>
        <div class={styles.socialItems}>
            {#each socials as social}
                <a
                    class="text"
                    href={social.href}
                    use:hoverScramble
                    use:entryScramble={scramble}
                >
                    {social.label}
                </a>
            {/each}
        </div>
    </div>
    <div class={styles.time}>
        <Clock />
        <h2 use:entryScramble={scramble}>STOCKHOLM, SWEDEN</h2>
    </div>
</div>

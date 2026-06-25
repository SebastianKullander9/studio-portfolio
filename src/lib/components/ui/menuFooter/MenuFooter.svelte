<script lang="ts">
    import styles from "./MenuFooter.module.css";
    import { hoverScramble } from "$lib/actions/hoverScramble";
    import { socials } from "./socials";
    import Clock from "../clock/Clock.svelte";
</script>

<div class={styles.footer}>
    <div class="stack">
        <h2>SOCIALS</h2>
        <div class={styles.socialItems}>
            {#each socials as social}
                <a class="text" href={social.href} use:hoverScramble>
                    {social.label}
                </a>
            {/each}
        </div>
    </div>
    <div class={styles.time}>
        <Clock />
        <h2>STOCKHOLM, SWEDEN</h2>
    </div>
</div>

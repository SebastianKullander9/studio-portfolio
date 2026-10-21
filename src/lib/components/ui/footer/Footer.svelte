<script lang="ts">
    import styles from "./Footer.module.css";
    import { fitText } from "$lib/actions/fitText";
</script>

<footer class={styles.footer} aria-label="SEBASTIAN.STUDIO">
    <div class={styles.desktop}>
        <p class={styles.marquee} aria-hidden="true" use:fitText>
            SEBASTIAN<span class="inactive">.STUDIO</span>
        </p>
    </div>
    <div class={[styles.mobile, styles.name]} aria-hidden="true">
        <span class={styles.ticker}>
            <span class={[styles.track, styles.leftward]}>
                <span>SEBASTIAN</span>
                <span>SEBASTIAN</span>
                <span>SEBASTIAN</span>
                <span>SEBASTIAN</span>
            </span>
        </span>
        <span class={styles.ticker}>
            <span class={[styles.track, styles.rightward]}>
                <span>STUDIO</span>
                <span>STUDIO</span>
                <span>STUDIO</span>
                <span>STUDIO</span>
            </span>
        </span>
    </div>
</footer>

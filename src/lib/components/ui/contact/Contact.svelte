<script lang="ts">
    import styles from "./Contact.module.css";
    import clsx from "clsx";
    import { hoverScramble } from "$lib/actions/hoverScramble";
    import { contactMenu } from "$lib/state/contact.svelte";
    import PrimaryButton from "../buttons/primaryButton/PrimaryButton.svelte";
    import DitherOverlay from "../ditherOverlay/DitherOverlay.svelte";
    import MenuFooter from "../menuFooter/MenuFooter.svelte";
</script>

{#if contactMenu.open}
    <div class={styles.wrapper}>
        <div class={styles.navigation}>
            <h2>Contact</h2>
            <button onclick={() => contactMenu.close()}>
                <span class="heading" use:hoverScramble>Close</span>
            </button>
        </div>
        <div class={styles.content}>
            <div>
                <p class={clsx("display", styles.display)}>
                    Let's create something together
                </p>
                <div class="stack">
                    <div class={styles.contact}>
                        <p>contact@sebastians.studio</p>
                        <p>+46761340076</p>
                    </div>
                    <div>
                        <PrimaryButton
                            label="Copy Email"
                            copiedLabel="Copied Email!"
                            type="button"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    "contact@sebastians.studio",
                                )}
                        />
                        <PrimaryButton
                            label="Copy Phone"
                            copiedLabel="Copied Phone!"
                            type="button"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    "+46761340076",
                                )}
                        />
                    </div>
                </div>
            </div>
            <MenuFooter />
        </div>
    </div>

    <DitherOverlay active={contactMenu.open} />
{/if}

<script lang="ts">
    import styles from "./PrimaryButton.module.css";
    import clsx from "clsx";
    import { hoverScramble } from "$lib/actions/hoverScramble";

    interface Props {
        label: string;
        copiedLabel?: string;
        type?: "button" | "submit" | "reset";
        onClick?: () => void;
    }

    let { label, copiedLabel, type = "button", onClick }: Props = $props();

    let copied = $state(false);

    async function handleClick() {
        if (!onClick) return;
        try {
            await onClick();
            if (copiedLabel) {
                copied = true;
                setTimeout(() => (copied = false), 3000);
            }
        } catch (e) {
            console.error("action failed", e);
        }
    }
</script>

<button
    {type}
    class={clsx(styles.button, "text-base", copied && styles.isCopied)}
    onclick={handleClick}
>
    {#if copied}
        <span>{copiedLabel}</span>
    {:else}
        <span use:hoverScramble>{label}</span>
    {/if}
</button>

<script lang="ts">
    import styles from "./SecondaryButton.module.css";
    import clsx from "clsx";
    import { hoverScramble } from "$lib/actions/hoverScramble";

    interface Props {
        label: string;
        type?: "button" | "submit" | "reset";
    }

    let { label, type }: Props = $props();
</script>

<button {type} class={[styles.button]}>
    <p class="heading" use:hoverScramble>{label}</p>
</button>

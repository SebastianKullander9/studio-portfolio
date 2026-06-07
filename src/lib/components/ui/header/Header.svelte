<script>
    import styles from "./Header.module.css";
    import { menuItems } from "./menuItems";
    import { hoverScramble } from "$lib/actions/hoverScramble";
</script>

<header>
    <nav class={styles.header}>
        {#each menuItems as item}
            <a href={item.href} use:hoverScramble>{item.label}</a>
        {/each}
    </nav>
</header>

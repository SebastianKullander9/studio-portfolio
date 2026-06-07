<script>
    import styles from "./Header.module.css";
    import { menuItems } from "./menuItems";
</script>

<header>
    <nav class={styles.header}>
        {#each menuItems as item}
            <a href={item.href}>{item.label}</a>
        {/each}
    </nav>
</header>

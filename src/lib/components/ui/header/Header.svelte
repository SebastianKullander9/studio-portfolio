<script>
    import styles from "./Header.module.css";
    import { menuItems } from "./menuItems";
    import { hoverScramble } from "$lib/actions/hoverScramble";
    import clsx from "clsx";
</script>

<header class={clsx("grid-inherit", styles.header)}>
    <nav class="grid-inherit">
        {#each menuItems.slice(0, 3) as item}
            <span>
                <a href={item.href} use:hoverScramble>{item.label}</a>
            </span>
        {/each}
        <div class={styles.group}>
            {#each menuItems.slice(3) as item}
                <span>
                    <a href={item.href} use:hoverScramble>{item.label}</a>
                </span>
            {/each}
        </div>
    </nav>
</header>

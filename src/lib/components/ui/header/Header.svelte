<script>
    import styles from "./Header.module.css";
    import { menuItems } from "./menuItems";
    import { hoverScramble } from "$lib/actions/hoverScramble";
    import clsx from "clsx";
    import { contactMenu } from "$lib/state/contact.svelte";
    import { mobileMenu } from "$lib/state/menu.svelte";

    import { MOBILE_HEADER_INDEXES } from "./menuItems";
</script>

<header class={clsx("grid-inherit", styles.header)}>
    <nav class={clsx("grid-inherit", styles.hideMobile)}>
        {#each menuItems.slice(0, menuItems.length - 2) as item}
            {#if item.type === "link"}
                <a href={item.href} use:hoverScramble>{item.label}</a>
            {:else}
                <button
                    onclick={() => contactMenu.toggle()}
                    use:hoverScramble
                >
                    <span class="heading">
                        {item.label}
                    </span>
                </button>
            {/if}
        {/each}
        <div class={styles.group}>
            {#each menuItems.slice(menuItems.length - 2) as item}
                {#if item.type === "link"}
                    <a href={item.href} use:hoverScramble>{item.label}</a>
                {:else}
                    <button onclick={() => contactMenu.toggle()}>
                        <span class="heading" use:hoverScramble>
                            {item.label}
                        </span>
                    </button>
                {/if}
            {/each}
        </div>
    </nav>
    <nav class={clsx(styles.hideDesktop)}>
        <div class={styles.mobileGroup}>
            {#each MOBILE_HEADER_INDEXES as index}
                {#if menuItems[index].type === "link"}
                    <a href={menuItems[index].href}>
                        {menuItems[index].label}
                    </a>
                {:else}
                    <div class={styles.mobileRightGroup}>
                        <button onclick={() => contactMenu.toggle()}>
                            <span class="heading" use:hoverScramble>
                                {menuItems[index].label}
                            </span>
                        </button>
                        <button
                            type="button"
                            onclick={() => mobileMenu.toggle()}
                        >
                            <span class="heading" use:hoverScramble
                                >Menu</span
                            >
                        </button>
                    </div>
                {/if}
            {/each}
        </div>
    </nav>
</header>

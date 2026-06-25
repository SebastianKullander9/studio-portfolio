<script lang="ts">
    import styles from "./MobileMenu.module.css";
    import clsx from "clsx";
    import { hoverScramble } from "$lib/actions/hoverScramble";
    import { mobileMenu } from "$lib/state/menu.svelte";
    import MenuFooter from "../menuFooter/MenuFooter.svelte";
    import { page } from "$app/state";

    import { MOBILE_MENU_INDEXES } from "../header/menuItems";
    import { menuItems } from "../header/menuItems";

    import { contactMenu } from "$lib/state/contact.svelte";
</script>

{#if mobileMenu.open}
    <div class={styles.wrapper}>
        <div class={styles.navigation}>
            <h2>Menu</h2>
            <button onclick={() => mobileMenu.close()}>
                <span class="heading" use:hoverScramble>Close</span>
            </button>
        </div>
        <div class={styles.content}>
            <div class={styles.menu}>
                {#each MOBILE_MENU_INDEXES as index, i}
                    {@const { type, label, href } = menuItems[index]}
                    {@const isActive = page.url.pathname === href}

                    {#if type === "link"}
                        <a
                            style="--i: {i}"
                            aria-current={isActive ? "page" : undefined}
                            class={clsx(styles.menuItem, "display")}
                            href={isActive ? undefined : href}
                            ><span>{label}</span></a
                        >
                    {:else}
                        <button
                            style="--i: {i}"
                            onclick={() => contactMenu.openMenu()}
                            class={clsx(styles.menuItem, "display")}
                            >{label}</button
                        >
                    {/if}
                {/each}
            </div>
            <MenuFooter />
        </div>
    </div>
{/if}

<script lang="ts">
    import "@fontsource/geist-mono/300.css";
    import "@fontsource/geist-mono/400.css";
    import "@fontsource/geist-mono/500.css";
    import "../styles/app.css";
    import styles from "./Layout.module.css";
    import Header from "$lib/components/ui/header/Header.svelte";
    import Contact from "$lib/components/ui/contact/Contact.svelte";
    import MobileMenu from "$lib/components/ui/mobileMenu/MobileMenu.svelte";
    import { afterNavigate } from "$app/navigation";
    import { mobileMenu } from "$lib/state/menu.svelte";
    import { contactMenu } from "$lib/state/contact.svelte";

    afterNavigate(({ from, to }) => {
        if (from?.url.pathname !== to?.url.pathname) {
            mobileMenu.close();
            contactMenu.close();
        }
    });

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" />
</svelte:head>

<div class={styles.layout}>
    <Header />
    <Contact />
    <MobileMenu />
    {@render children()}
</div>

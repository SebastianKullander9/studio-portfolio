<script lang="ts">
    import "@fontsource/geist-mono/300.css";
    import "@fontsource/geist-mono/400.css";
    import "@fontsource/geist-mono/500.css";
    import "../styles/app.css";
    import styles from "./Layout.module.css";
    import Header from "$lib/components/ui/header/Header.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" />
</svelte:head>

<div class={styles.layout}>
    <Header />
    {@render children()}
</div>

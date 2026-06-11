<script lang="ts">
    import styles from "./Works.module.css";
    import ProjectCard from "./projectCard/ProjectCard.svelte";
    import { works } from "./data";
    import clsx from "clsx";
    import List from "./view/list/List.svelte";
    import { hoverScramble } from "$lib/actions/hoverScramble";

    let view = $state("grid");
    let format = $state<"desktop" | "mobile">("desktop");
</script>

<section class="grid-inherit">
    <div class={clsx("grid-inherit", styles.header)}>
        <h2>Projects</h2>

        <div class={styles.toggle}>
            <button
                class="heading"
                class:inactive={view === "list"}
                use:hoverScramble
                onclick={() => (view = "grid")}>Grid</button
            >
            <button
                class="heading"
                class:inactive={view === "grid"}
                use:hoverScramble
                onclick={() => (view = "list")}>List</button
            >
        </div>
        <div class={styles.toggle} class:hidden={view === "list"}>
            <button
                class="heading"
                class:inactive={format === "mobile"}
                onclick={() => (format = "desktop")}>Desktop</button
            >
            <button
                class="heading"
                class:inactive={format === "desktop"}
                onclick={() => (format = "mobile")}>Mobile</button
            >
        </div>
    </div>

    <div class={clsx("grid-inherit", view === "grid" && styles.grid)}>
        {#if view === "grid"}
            {#each works as work, index}
                <div class={styles.column}>
                    {#key format}
                        <ProjectCard
                            title={work.title}
                            kind={work.kind}
                            {format}
                            media={format === "desktop"
                                ? work.desktop
                                : work.mobile}
                            {index}
                        />
                    {/key}
                </div>
            {/each}
        {:else}
            <List {works} />
        {/if}
    </div>
</section>

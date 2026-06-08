<script>
    import styles from "./Works.module.css";
    import ProjectCard from "./projectCard/ProjectCard.svelte";
    import { works } from "./data";
    import clsx from "clsx";
</script>

<section class="grid-inherit">
    <div class={clsx("grid-inherit", styles.header)}>
        <h2>Projects</h2>

        <div class={styles.toggle}>
            <button class={`heading`}>Grid</button>
            <button class={`heading`}>List</button>
        </div>
        <div class={styles.toggle}>
            <button class={`heading`}>Desktop</button>
            <button class={`heading`}>Mobile</button>
        </div>
    </div>

    <div class={clsx("grid-inherit", styles.grid)}>
        {#each works as work, index}
            <div class={styles.column}>
                <ProjectCard
                    title={work.title}
                    kind={work.kind}
                    images={work.images}
                    {index}
                />
            </div>
        {/each}
    </div>
</section>

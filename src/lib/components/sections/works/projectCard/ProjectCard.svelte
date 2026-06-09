<script>
    import styles from "./ProjectCard.module.css";
    import clsx from "clsx";

    let { title, kind, images, index } = $props();
</script>

<div class={clsx("grid-inherit-half", styles.grid)}>
    {#each images as image}
        <div class={styles.work}>
            <img class={styles.image} src={image} alt="title" />
            <div class={styles.info}>
                <h3>{title}</h3>
                <p>WRK{index + 1} - {kind}</p>
            </div>
        </div>
    {/each}
</div>

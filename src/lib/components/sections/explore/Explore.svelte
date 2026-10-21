<script>
    import styles from "./Explore.module.css";
    import { works } from "$lib/components/sections/works/data";
    import lewa from "$lib/assets/works/lewa/mobile/04.png?enhanced";
    import overengineered from "$lib/assets/works/overengineered/mobile/01.png?enhanced";
    import reliwe from "$lib/assets/works/reliwe/mobile/04.png?enhanced";
    import lewaAlt from "$lib/assets/works/lewa/mobile/03.png?enhanced";

    const items = [
        { src: lewa, slug: "lewa" },
        { src: overengineered, slug: "overengineered" },
        { src: reliwe, slug: "reliwe" },
        { src: lewaAlt, slug: "lewa" },
    ].map((item) => {
        const index = works.findIndex((w) => w.slug === item.slug);
        return { ...item, index, work: works[index] };
    });
</script>

<section class="grid-inherit section-text-padding section-text-stack">
    <h2 class={styles.title}>EXPLORE MY WORK</h2>
    {#each items as item}
        <div class={styles.item}>
            <div class={styles.frame}>
                <enhanced:img
                    class={styles.image}
                    src={item.src}
                    alt={item.work.title}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                />
            </div>
            <h3>{item.work.title}</h3>
            <p>WRK{item.index + 1} - {item.work.kind}</p>
        </div>
    {/each}
</section>

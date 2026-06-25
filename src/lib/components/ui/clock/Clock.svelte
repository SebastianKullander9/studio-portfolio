<script lang="ts">
    import styles from "./Clock.module.css";

    const fmt = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    let time = $state(fmt.format(new Date()));

    $effect(() => {
        const id = setInterval(
            () => (time = fmt.format(new Date())),
            1000,
        );
        return () => clearInterval(id);
    });
</script>

<time class={styles.root}>
    {time}
</time>

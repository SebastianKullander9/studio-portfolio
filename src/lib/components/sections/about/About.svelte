<script>
    import styles from "./About.module.css";
    import clsx from "clsx";
</script>

<section
    class={clsx("grid-inherit section-text-padding section-text-stack")}
>
    <p class={clsx("display", styles.intro)}>
        Design and engineering, from one person. I build websites end to
        end, interface to infrastructure. For people who care how things
        are made.
    </p>
    <div class={clsx("grid-inherit section-block", styles.about)}>
        <div>
            <h2>The differentiator</h2>
            <p>
                Most projects pass through two pairs of hands: a designer
                who draws it, a developer who builds it, and something lost
                in the gap between. I do both. The interface you approve is
                the interface I write — no handoff, no translation, none of
                the detail that quietly dies in a spec.
            </p>
        </div>
        <div>
            <h2>How I work</h2>
            <p>
                I take on one project at a time. The code is clean,
                documented, and built to outlast its launch, so the site
                you pay for doesn't decay six months later. I care about
                the parts no one's meant to notice — spacing, type, how
                fast a page paints, the shape of a commit history.
            </p>
        </div>
    </div>
    <div class="grid-inherit section-text-padding"></div>
</section>

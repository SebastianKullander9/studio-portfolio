<script>
    import clsx from "clsx";
    import styles from "./Services.module.css";
</script>

<section class="grid-inherit">
    <p class={clsx("display", styles.intro)}>
        I design and build websites for companies that care about the
        details. Every project starts from your brand and your goals. no
        templates, no shortcuts. The result is a site that's fast,
        considered, and built to last.
    </p>
    <div class={clsx("grid-inherit", styles.services)}>
        <div>
            <h2>Design & development</h2>
            <p>
                End-to-end, from idea to launch. I design and build custom
                websites with a focus on brand, clarity, and performance.
                Modern tooling, no off-the-shelf templates.
            </p>
        </div>
        <div>
            <h2>Performance optimization</h2>
            <p>
                Slow sites lose visitors. I audit and optimize existing
                websites — image handling, load times, rendering, Core Web
                Vitals — so your site feels instant on any device.
            </p>
        </div>
        <div>
            <h2>Care & maintenance</h2>
            <p>
                A website isn't finished at launch. I offer ongoing
                maintenance and iteration — updates, fixes, small
                improvements — so your site stays fast, secure, and
                current.
            </p>
        </div>
    </div>
    <div class="grid-inherit">
        <div><h2>Capabilities</h2></div>
        <div>
            <p>Creative Direction</p>
            <p>UI+UX Design</p>
            <p>Design systems</p>
            <p>Interaction Design</p>
            <p>Typography</p>
        </div>
        <div>
            <p>Frontend Development</p>
            <p>Backend Development</p>
            <p>Agentic Engineering</p>
            <p>Custom Integrations</p>
            <p>CMS Development</p>
        </div>
        <div>
            <p>Techincal SEO</p>
            <p>Performance Optimization</p>
            <p>Core Web Vitals</p>
            <p>Analytics & Tracking</p>
            <p>Hosting & Deployment</p>
            <p>Maintenance & Support</p>
        </div>
    </div>
</section>

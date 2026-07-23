(() => {
    "use strict";

    const footer = document.querySelector(".wedding-footer");

    if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    let hasPlayed = false;

    function createLaurelSplash() {
        if (hasPlayed) return;
        hasPlayed = true;

        const splash = document.createElement("div");
        splash.className = "laurel-splash";
        splash.setAttribute("aria-hidden", "true");

        const totalLeaves = window.innerWidth < 700 ? 28 : 44;
        const colors = ["", "is-gold", "is-light"];

        for (let i = 0; i < totalLeaves; i += 1) {
            const leaf = document.createElement("span");
            leaf.className = `laurel-leaf ${colors[Math.floor(Math.random() * colors.length)]}`;

            const startFromLeft = Math.random() > 0.5;
            const x = startFromLeft
                ? 8 + Math.random() * 30
                : 62 + Math.random() * 30;

            const y = 58 + Math.random() * 34;
            const driftDirection = startFromLeft ? 1 : -1;

            leaf.style.setProperty("--leaf-x", `${x}vw`);
            leaf.style.setProperty("--leaf-y", `${y}vh`);
            leaf.style.setProperty("--leaf-size", `${8 + Math.random() * 8}px`);
            leaf.style.setProperty("--leaf-rotate", `${Math.random() * 360}deg`);
            leaf.style.setProperty(
                "--leaf-drift",
                `${driftDirection * (40 + Math.random() * 230)}px`
            );
            leaf.style.setProperty("--leaf-fall", `${35 + Math.random() * 52}vh`);
            leaf.style.setProperty("--leaf-duration", `${2.35 + Math.random() * 1.35}s`);
            leaf.style.setProperty("--leaf-delay", `${Math.random() * 0.42}s`);

            splash.appendChild(leaf);
        }

        document.body.appendChild(splash);

        window.setTimeout(() => {
            splash.remove();
        }, 4600);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                createLaurelSplash();
                observer.disconnect();
            }
        },
        {
            threshold: 0.42
        }
    );

    observer.observe(footer);
})();
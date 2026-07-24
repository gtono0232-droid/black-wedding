(() => {
    "use strict";

    const footer = document.querySelector(".wedding-footer");
    const music = document.getElementById("music");

    if (!footer) return;

    let scheduled = false;

    function buildFinale() {
        const overlay = document.createElement("div");
        overlay.className = "final-medallion-overlay";
        overlay.setAttribute("aria-hidden", "true");

        const stage = document.createElement("div");
        stage.className = "final-medallion-stage";

        const glow = document.createElement("div");
        glow.className = "final-forging-glow";
        stage.appendChild(glow);

        const leafCount = window.innerWidth < 650 ? 30 : 46;

        for (let i = 0; i < leafCount; i += 1) {
            const leaf = document.createElement("span");
            leaf.className = "final-forging-leaf";

            const angle = (Math.PI * 2 * i) / leafCount + Math.random() * .22;
            const radius = Math.min(window.innerWidth, window.innerHeight) * (.42 + Math.random() * .18);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            leaf.style.setProperty("--x", `${x}px`);
            leaf.style.setProperty("--y", `${y}px`);
            leaf.style.setProperty("--r", `${(angle * 180 / Math.PI) + 90}deg`);
            leaf.style.setProperty("--delay", `${Math.random() * .6}s`);
            stage.appendChild(leaf);
        }

        const medallion = document.createElement("div");
        medallion.className = "final-medallion";
        medallion.innerHTML = `
            <img src="assets/icons/final-medallion.svg"
                 alt="Medallón dorado de César y Vianey, 2026">
        `;

        const signature = document.createElement("div");
        signature.className = "final-medallion-signature";
        signature.textContent = "César C.G. 2026™";

        stage.appendChild(medallion);
        stage.appendChild(signature);
        overlay.appendChild(stage);
        document.body.appendChild(overlay);

        return overlay;
    }

    function fadeMusic(duration = 8000) {
        if (!music || music.paused) return;

        const initialVolume = Math.max(music.volume, .01);
        const startedAt = performance.now();

        function step(now) {
            const progress = Math.min((now - startedAt) / duration, 1);
            music.volume = initialVolume * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                music.pause();
                music.volume = initialVolume;
            }
        }

        requestAnimationFrame(step);
    }

    function scheduleFinale() {
        if (scheduled) return;
        scheduled = true;

        /*
         * El splash original comienza al entrar al footer.
         * Veinte segundos después inicia el gran final.
         */
        window.setTimeout(() => {
            const overlay = buildFinale();

            document.body.classList.add("final-medallion-fade");
            fadeMusic(8000);

            window.setTimeout(() => {
                overlay.classList.add("is-visible");
            }, 300);
        }, 10000);
    }

    const observer = new IntersectionObserver(
        entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                scheduleFinale();
                observer.disconnect();
            }
        },
        { threshold: .55 }
    );

    observer.observe(footer);
})();
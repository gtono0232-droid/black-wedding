(() => {
    "use strict";

    const footer = document.querySelector(".wedding-footer");

    if (!footer) return;

    let scheduled = false;

    function createFinalSeal() {
        const overlay = document.createElement("div");
        overlay.className = "final-seal-overlay";
        overlay.setAttribute("aria-hidden", "true");

        overlay.innerHTML = `
            <div class="final-wax-seal">
                <img src="assets/icons/monogram.svg" alt="">
            </div>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    function scheduleFinale() {
        if (scheduled) return;
        scheduled = true;

        /*
         * El splash comienza al entrar al cierre.
         * Esperamos 20 segundos antes de desvanecer la invitación.
         */
        window.setTimeout(() => {
            const overlay = createFinalSeal();

            document.body.classList.add("final-fade");

            window.setTimeout(() => {
                overlay.classList.add("is-visible");
            }, 350);
        }, 20000);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                scheduleFinale();
                observer.disconnect();
            }
        },
        { threshold: 0.55 }
    );

    observer.observe(footer);
})();
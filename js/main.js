const button = document.getElementById("openInvitation");
const envelope = document.getElementById("envelope");
const welcome = document.getElementById("welcome");
const content = document.getElementById("content");
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");

let playing = true;

button.addEventListener("click", () => {
    envelope.classList.add("open");

    setTimeout(() => {
        music.play().catch(() => console.log("Audio bloqueado"));
    }, 900);

    setTimeout(() => {
        welcome.classList.add("hide");
    }, 2600);

    setTimeout(() => {
        welcome.style.display = "none";
        musicButton.style.display = "block";
        content.classList.remove("hidden");
        content.classList.add("show-content");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 3900);
});

musicButton.addEventListener("click", () => {
    if (playing) {
        music.pause();
        musicButton.textContent = "🔇";
        playing = false;
    } else {
        music.play().catch(() => {});
        musicButton.textContent = "♫";
        playing = true;
    }
});

const params = new URLSearchParams(window.location.search);
const guestID = params.get("id");

const guestName = document.getElementById("guestName");
const guestPasses = document.getElementById("guestPasses");
const guestTable = document.getElementById("guestTable");
const yesButton = document.getElementById("yesRSVP");
const noButton = document.getElementById("noRSVP");
const rsvpMessage = document.getElementById("rsvpMessage");

const scriptURL = "https://script.google.com/macros/s/AKfycbx-6gNJVZ0UOsjjNJFBp7SaUSSHVyOUYmFpgm0oy0xuAscFPY0ekrleZ3sYOBI-LQg/exec";

const invitadoValido =
    typeof invitados !== "undefined" &&
    guestID &&
    invitados[guestID];

if (invitadoValido) {
    const invitado = invitados[guestID];

    guestName.textContent = invitado.nombre;
    guestPasses.textContent =
        `Tenemos reservados ${invitado.pases} lugares para ustedes.`;
    guestTable.textContent = `Mesa asignada: ${invitado.mesa}`;
} else {
    guestName.textContent = "Invitado especial";
    guestPasses.textContent =
        "Abre la invitación desde tu enlace personalizado para confirmar.";
    yesButton.disabled = true;
    noButton.disabled = true;
}

async function sendRSVP(respuesta) {
    if (!invitadoValido) return;

    const invitado = invitados[guestID];

    yesButton.disabled = true;
    noButton.disabled = true;
    rsvpMessage.textContent = "Registrando respuesta...";

    try {
        await fetch(scriptURL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                codigo: guestID,
                nombre: invitado.nombre,
                pases: invitado.pases,
                mesa: invitado.mesa,
                respuesta
            })
        });

        if (respuesta === "Confirmado") {
            rsvpMessage.textContent =
                `Gracias ${invitado.nombre}, hemos recibido su confirmación.`;
            guestTable.style.display = "block";
        } else {
            rsvpMessage.textContent =
                `Gracias ${invitado.nombre}. Lamentamos no contar con su presencia.`;
            guestTable.style.display = "none";
        }
    } catch (error) {
        console.error(error);
        rsvpMessage.textContent =
            "No pudimos registrar la respuesta. Inténtalo nuevamente.";
        yesButton.disabled = false;
        noButton.disabled = false;
    }
}

yesButton.addEventListener("click", () => sendRSVP("Confirmado"));
noButton.addEventListener("click", () => sendRSVP("No asiste"));

const weddingDate = new Date("2026-09-26T19:00:00-07:00").getTime();

function updateCountdown() {
    const distance = weddingDate - Date.now();
    const container = document.querySelector(".countdown-container");

    if (!container) return;

    if (distance <= 0) {
        container.innerHTML = "<h3>¡Hoy es el gran día!</h3>";
        return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ===========================
   ANIMACIONES AL HACER SCROLL
=========================== */

const revealElements = document.querySelectorAll(
    ".section-inner, .time-box, .photo, .event-item, .important-card, .rsvp-box, .wedding-footer .section-inner"
);

revealElements.forEach((element, index) => {
    element.classList.add("reveal-item");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
});

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold:0.14,
            rootMargin:"0px 0px -45px 0px"
        }
    );

    revealElements.forEach(element => revealObserver.observe(element));
}

/* ===========================
   GALERÍA EDITORIAL AMPLIABLE
=========================== */

const galleryPhotos = Array.from(document.querySelectorAll(".editorial-gallery .photo"));

if (galleryPhotos.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Álbum de fotografías");

    const largePhoto = document.createElement("img");
    largePhoto.alt = "";

    const closeButton = document.createElement("button");
    closeButton.className = "lightbox-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Cerrar fotografía");
    closeButton.textContent = "×";

    const previousButton = document.createElement("button");
    previousButton.className = "lightbox-nav lightbox-prev";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Fotografía anterior");
    previousButton.textContent = "‹";

    const nextButton = document.createElement("button");
    nextButton.className = "lightbox-nav lightbox-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Fotografía siguiente");
    nextButton.textContent = "›";

    const counter = document.createElement("div");
    counter.className = "lightbox-counter";

    lightbox.append(
        largePhoto,
        closeButton,
        previousButton,
        nextButton,
        counter
    );

    document.body.appendChild(lightbox);

    let currentIndex = 0;
    let lastFocusedPhoto = null;
    let touchStartX = 0;

    const showPhoto = index => {
        currentIndex = (index + galleryPhotos.length) % galleryPhotos.length;
        const photo = galleryPhotos[currentIndex];

        largePhoto.src = photo.currentSrc || photo.src;
        largePhoto.alt = photo.alt || "Fotografía de César y Vianey";
        counter.textContent = `${currentIndex + 1} / ${galleryPhotos.length}`;
    };

    const openLightbox = (photo, index) => {
        lastFocusedPhoto = photo;
        showPhoto(index);
        lightbox.classList.add("open");
        document.body.classList.add("lightbox-open");
        closeButton.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("open");
        document.body.classList.remove("lightbox-open");

        setTimeout(() => {
            largePhoto.removeAttribute("src");
        }, 320);

        if (lastFocusedPhoto) {
            lastFocusedPhoto.focus();
        }
    };

    galleryPhotos.forEach((photo, index) => {
        photo.tabIndex = 0;
        photo.setAttribute("role", "button");
        photo.setAttribute(
            "aria-label",
            `Ampliar fotografía ${index + 1} de ${galleryPhotos.length}`
        );

        photo.addEventListener("click", () => openLightbox(photo, index));

        photo.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(photo, index);
            }
        });
    });

    previousButton.addEventListener("click", () => showPhoto(currentIndex - 1));
    nextButton.addEventListener("click", () => showPhoto(currentIndex + 1));
    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive:true });

    lightbox.addEventListener("touchend", event => {
        const distance = event.changedTouches[0].screenX - touchStartX;

        if (Math.abs(distance) < 50) return;

        if (distance < 0) {
            showPhoto(currentIndex + 1);
        } else {
            showPhoto(currentIndex - 1);
        }
    }, { passive:true });

    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("open")) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
        if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
    });
}

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
const ceremonySection = document.getElementById("ceremonyStep");
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
    const acceso = (invitado.acceso || "").trim().toLowerCase();

    guestName.textContent = invitado.nombre;
    guestPasses.textContent =
        `Tenemos reservados ${invitado.pases} lugares para ustedes.`;

    if (ceremonySection && acceso === "recepción") {
        ceremonySection.style.display = "none";
    }

    guestTable.textContent =
        "Consulta tu mesa al llegar a la recepción.";
}
 else {
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
                mesa: "",
                respuesta
            })
        });

        if (respuesta === "Confirmado") {
            rsvpMessage.textContent =
                `Gracias ${invitado.nombre}, hemos recibido su confirmación.`;
            guestTable.textContent =
    "Consulta tu mesa el día de la recepción.";

guestTable.style.display = "block";
guestTable.classList.remove("hidden-table");
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
    ".section-inner, .time-box, .photo, .event-item, .important-card, .party-group, .hashtag-card, .rsvp-box, .wedding-footer .section-inner"
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

const galleryPhotos = Array.from(document.querySelectorAll(".editorial-gallery .photo, .wedding-carousel .carousel-slide img"));

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


/* ===========================
   HASHTAG Y SERVICIO DE FOTOS
=========================== */
const PHOTO_UPLOAD_URL = "https://www.dropbox.com/request/rqq43mxjyzpseo2dskch";
const uploadPhotosButton = document.getElementById("uploadPhotosButton");

if (uploadPhotosButton && PHOTO_UPLOAD_URL) {
    uploadPhotosButton.href = PHOTO_UPLOAD_URL;
    uploadPhotosButton.target = "_blank";
    uploadPhotosButton.rel = "noopener";
    uploadPhotosButton.classList.remove("upload-disabled");
    uploadPhotosButton.removeAttribute("aria-disabled");
    uploadPhotosButton.textContent = "Subir fotos";
}

const copyHashtagButton = document.getElementById("copyHashtag");
const weddingHashtag = document.getElementById("weddingHashtag");
const copyHashtagMessage = document.getElementById("copyHashtagMessage");

if (copyHashtagButton && weddingHashtag) {
    copyHashtagButton.addEventListener("click", async () => {
        const text = weddingHashtag.textContent.trim();

        try {
            await navigator.clipboard.writeText(text);
            copyHashtagMessage.textContent = "Hashtag copiado";
        } catch (error) {
            const input = document.createElement("textarea");
            input.value = text;
            input.style.position = "fixed";
            input.style.opacity = "0";
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
            copyHashtagMessage.textContent = "Hashtag copiado";
        }

        setTimeout(() => {
            copyHashtagMessage.textContent = "";
        }, 2400);
    });
}


/* ===========================
   CARRUSEL DE FOTOGRAFÍAS
=========================== */
(() => {
    const carousel = document.getElementById("weddingCarousel");
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prev = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    let index = 0;
    let timer;
    let startX = 0;

    const dots = slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ver fotografía ${i + 1}`);
        dot.addEventListener("click", () => goTo(i, true));
        dotsContainer.appendChild(dot);
        return dot;
    });

    function goTo(newIndex, restart = false) {
        index = (newIndex + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
        if (restart) startAutoplay();
    }

    function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(() => goTo(index + 1), 6000);
    }

    prev?.addEventListener("click", () => goTo(index - 1, true));
    next?.addEventListener("click", () => goTo(index + 1, true));
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("touchstart", event => { startX = event.touches[0].clientX; clearInterval(timer); }, {passive:true});
    carousel.addEventListener("touchend", event => {
        const delta = event.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 45) goTo(index + (delta < 0 ? 1 : -1));
        startAutoplay();
    }, {passive:true});

    goTo(0);
    startAutoplay();
})();

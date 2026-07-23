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

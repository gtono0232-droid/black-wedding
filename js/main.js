const button = document.getElementById("openInvitation");

const welcome = document.getElementById("welcome");

const content = document.getElementById("content");

const music = document.getElementById("music");

const musicButton = document.getElementById("musicButton");

let playing = true;

button.addEventListener("click", () => {


    // Animación de salida de portada

    welcome.classList.add("hide");



    setTimeout(() => {


        // Ocultar portada

        welcome.style.display = "none";



        // Reproducir música

        music.play().catch(() => {

            console.log("El navegador bloqueó la reproducción automática");

        });
musicButton.style.display = "block";




        // Mostrar contenido

        content.classList.remove("hidden");



        // Animación de entrada

        content.classList.add("show-content");



        // Ir al inicio de la invitación

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });



    },1500);



});
musicButton.addEventListener("click", () => {


    if (playing) {


        music.pause();

        musicButton.innerHTML = "🔇";

        playing = false;


    } else {


        music.play();

        musicButton.innerHTML = "♫";

        playing = true;


    }


});

const guestName = document.getElementById("guestName");

const guestPasses = document.getElementById("guestPasses");


const params = new URLSearchParams(window.location.search);

const guestID = params.get("id");


if (guestID && invitados[guestID]) {


    guestName.innerHTML = invitados[guestID].nombre;


    guestPasses.innerHTML =
    "Tenemos reservados " +
    invitados[guestID].pases +
    " lugares para ustedes.";


}
const button = document.getElementById("openInvitation");

const welcome = document.getElementById("welcome");

const content = document.getElementById("content");

const music = document.getElementById("music");

const musicButton = document.getElementById("musicButton");

let playing = true;



button.addEventListener("click", () => {


    welcome.classList.add("hide");


    setTimeout(() => {


        welcome.style.display = "none";


        music.play().catch(() => {

            console.log("Audio bloqueado");

        });


        musicButton.style.display = "block";


        content.classList.remove("hidden");

        content.classList.add("show-content");


        window.scrollTo({

            top:0,

            behavior:"smooth"

        });


    },1500);


});





musicButton.addEventListener("click", () => {


    if(playing){


        music.pause();

        musicButton.innerHTML="🔇";

        playing=false;


    }else{


        music.play();

        musicButton.innerHTML="♫";

        playing=true;


    }


});





const params = new URLSearchParams(window.location.search);

const guestID = params.get("id");



const guestName = document.getElementById("guestName");

const guestPasses = document.getElementById("guestPasses");

const guestTable = document.getElementById("guestTable");

if(guestID && invitados[guestID]){


    guestName.innerHTML = invitados[guestID].nombre;


    guestPasses.innerHTML =
    "Tenemos reservados " +
    invitados[guestID].pases +
    " lugares para ustedes.";

guestTable.innerHTML =
"Mesa asignada : " +
invitados[guestID].mesa;


}




const yesButton = document.getElementById("yesRSVP");

const noButton = document.getElementById("noRSVP");

const rsvpMessage = document.getElementById("rsvpMessage");

const scriptURL = "https://script.google.com/macros/s/AKfycbx-6gNJVZ0UOsjjNJFBp7SaUSSHVyOUYmFpgm0oy0xuAscFPY0ekrleZ3sYOBI-LQg/exec";

yesButton.addEventListener("click", () => {


    let invitado = invitados[guestID];


    rsvpMessage.innerHTML =
    "Gracias " + invitado.nombre + ", hemos recibido su confirmación.";


    fetch(scriptURL, {

        method: "POST",

        body: JSON.stringify({

            codigo: guestID,

            nombre: invitado.nombre,

            pases: invitado.pases,

            mesa: invitado.mesa,

            respuesta: "Confirmado"

        })

    });


    guestTable.style.display = "block";


});

noButton.addEventListener("click", () => {


    let invitado = invitados[guestID];


    rsvpMessage.innerHTML =
    "Gracias " + invitado.nombre + ". Lamentamos no contar con su presencia.";


    fetch(scriptURL, {

        method: "POST",

        body: JSON.stringify({

            codigo: guestID,

            nombre: invitado.nombre,

            pases: invitado.pases,

            mesa: invitado.mesa,

            respuesta: "No asiste"

        })

    });


});
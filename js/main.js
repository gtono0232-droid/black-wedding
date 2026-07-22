const button = document.getElementById("openInvitation");

const welcome = document.getElementById("welcome");

const content = document.getElementById("content");



button.addEventListener("click", () => {


    // Animación de salida de portada

    welcome.classList.add("hide");



    setTimeout(() => {


        // Ocultar portada

        welcome.style.display = "none";



        // Mostrar contenido

        content.classList.remove("hidden");



        // Ir al inicio del contenido

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });



    },1500);



});
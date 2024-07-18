// Todo lo referente a la accesibilidad
document.querySelector("#aumentar").addEventListener("click", () => {
    ajustarFuente(1);
})

document.querySelector("#reducir").addEventListener("click", () => {
    ajustarFuente(-1);
})

document.querySelector("#escalaGris").addEventListener("click", escalaGrises);

document.querySelector("#altoContras").addEventListener("click", altoContraste);

document.querySelector("#reset").addEventListener("click", resetTodo);



// Botón de Aumentar y Disminuir Fuente
function ajustarFuente(cambio) {
    let elementos = document.querySelectorAll("body *:not(.accesibilidad, .accesibilidad *)"); //Selecciona todos los elementos excepto accesibilidad.
    elementos.forEach(function (elem) {
        let estilo = window.getComputedStyle(elem); //Toma el estilo de cada elemento.
        let fontSize = parseFloat(estilo.fontSize); //Toma el estilo de cada elemento.
        console.log(fontSize);
        elem.style.fontSize = fontSize + cambio + "px";
    })
}


//  Botón de Escala de grises.
function escalaGrises() {
    // 222222
    document.body.style.filter = "grayscale(100%)";
}


//  Botón de Alto Contraste.
function altoContraste() {
    document.body.style.backgroundColor = "#1c1d22";
    let elementos = document.querySelectorAll("body *");
    let img = document.querySelectorAll("img");  //Imagenes
    elementos.forEach(function (elem) {
        let estilo = window.getComputedStyle(elem);
        elem.style.color = "#ffd700";
    })
    img.forEach(function (elem) { //Invertimos el color de las img
        let estilo = window.getComputedStyle(elem);
        elem.style.filter = "brightness(0) invert(1)"; //Invierte el color de las imagenes

    })
}


// Botón de Reset.
function resetTodo() {
    let elementos = document.querySelectorAll("body *");
    elementos.forEach(function (elem) {
        elem.style.fontSize = "";
        elem.style.color = "";
    })
    let img = document.querySelectorAll("img");
    img.forEach(function (elem) {
        elem.style.filter = "";
    })
    document.body.style.backgroundColor = "";
    document.body.style.filter = "";
}


// Botón de Mostrar y Ocultar.
function mostrarOcultar() {
    let barra = document.querySelector(".accesibilidad");
    let boton = document.querySelector(".icon-accesibilidad");
    barra.classList.toggle("mostrar"); //Intercambia las clases, si la tieen, la quita, sino la coloca.
    boton.classList.toggle("mostrar");
}




// Declaramos las variables (Video, Galeria y 2 botones (tomar y borrar))
let videoElement = document.querySelector("#camara");
let galeriaFoto = document.querySelector("#galeria");
let tomarElement = document.querySelector("#tomar-foto");
let borrarTodo = document.querySelector("#borrar-todo");


// Solicitar acceso a la cámara.
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => { videoElement.srcObject = stream }).catch(error => {
    alert("Error al mostrar la cámara");
})
// UserMedia se utiliza para solicitar o comprobar permisos de un medio (camara,microfono,etc)


// Declaración del contador de fotos para generar la id y poder borrar 
let contadorIdfotos = getNextPhoto();


// Cuando se haga click en el boton "tomar foto", se genera un canva de tipo 2d, con las coordenadas x,y de la imagen que se está transmitiendo de la cámara.
tomarElement.addEventListener("click", () => {
    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const contex = canvas.getContext("2d");
    // Se captura con todos estos datos.
    contex.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // galeriaFoto.appendChild(canvas); -> SOLO DE PRUEBA

    // Convertir Canva a Base64
    let dataUrl = canvas.toDataURL("image/jpeg", 0.9); //Le indicamos que convierta el canvas a una imagen con la ruta que vamos a establecer con el id.
    let photoID = contadorIdfotos++;
    guardarFoto({ id: photoID, dataUrl }); //Clave : Valor -> Mapa con el Id de la ruta, para guardarlo luego en el LocalStorage del navegador.
    setNextPhoto(contadorIdfotos); //Se pasa el valor del contador de foto a una funcion que prepara para la próxima foto del contador.
});


function guardarFoto(photo, isPhotoLoad = false) {
    //Crear contenedor para la foto.
    let photoContainer = document.createElement("div");
    photoContainer.className = "photo-container";
    photoContainer.dataset.id = photo.id; // O tambien -> photoContainer.setAttribute("id",photoID).

    //Crear la imágen.
    let img = new Image();
    img.src = photo.dataUrl;
    img.className = "photo";


    //Crear Contenedor para los Botones.
    let contenedorBoton = document.createElement("div");
    contenedorBoton.className = "boton-foto";


    //Crear Boton Eliminar.
    let eliminarPhoto = document.createElement("button");
    eliminarPhoto.className = "boton-eliminar";
    eliminarPhoto.textContent = "Eliminar";
    // Crear el evento -> Cuando hagan click sobre el botón.
    eliminarPhoto.addEventListener("click", () => {
        eliminar(photo.id);
    })


    // Crear Boton Descargar.
    let descargarPhoto = document.createElement("button");
    descargarPhoto.className = "boton-descargar";
    descargarPhoto.textContent = "Descargar";
    descargarPhoto.addEventListener("click", () => {
        descargar(photo.dataUrl,`photo-${photo.id+1}.jpg`);
    })

    galeriaFoto.appendChild(photoContainer);
    photoContainer.appendChild(img);
    photoContainer.appendChild(contenedorBoton);
    contenedorBoton.appendChild(eliminarPhoto);
    contenedorBoton.appendChild(descargarPhoto);


    // Guardar la Imagen en el Almacenamiento Local. Solo si no está cargado desde localStorage.
    if (!isPhotoLoad) {
        let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
        fotos.push(photo);
        localStorage.setItem("fotos", JSON.stringify(fotos));
    }
}



// Boton de Eliminar
function eliminar(id) {
    // Primero lo elimina de la vista.
    let divEliminar = document.querySelector(`.photo-container[data-id="${id}"]`);
    if (divEliminar) {
        galeriaFoto.removeChild(divEliminar);
    }

    // Eliminar del localStorage. Se leen todas las fotos que están guardadas y se filtra (filter) el que sea igual al id que se busca. Posteriormente se elimina
    let fotos = JSON.parse(localStorage.getItem("fotos")) || [];  // -> || [] si en fotos no existe nada o en null, devuelve array vacío.
    fotos = fotos.filter(photo => photo.id != id);
    localStorage.setItem("fotos", JSON.stringify(fotos));
}




function descargar(dataUrl,filename) {
    let elemento=document.createElement("a"); //Enlace tipo -> File
    elemento.href=dataUrl;
    elemento.download=filename;
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
}



function getNextPhoto() {
    return parseInt(localStorage.getItem("contadorIdfotos")) || 0;
}



function setNextPhoto(id) {
    localStorage.setItem("contadorIdfotos", id.toString());
}

borrarTodo.addEventListener("click", ()=>{
    localStorage.removeItem("fotos"); //eliminamos todo el localStorage
    while (galeriaFoto.firstChild) {
        galeriaFoto.removeChild(galeriaFoto.firstChild);
    }

    // Iniciañizamos el contador
    contadorIdfotos=0;
    // Inicializamos el localStorage
    setNextPhoto(contadorIdfotos);
});


// Cuando cargue la página debe recuperar todas las fotos....
// Lee el localStorage y muestra las fotos que estén almacenadas.
let fotoGuardadas = JSON.parse(localStorage.getItem("fotos")) || [];
fotoGuardadas.forEach(element => {
    guardarFoto(element, true); // true -> Hace referencia a que si es leido, o tiene contenido.    
});

// Declaramos las variables (Video, Galeria y 2 botones (tomar y borrar))
let videoElement=document.querySelector("#camara");
let galeriaFoto=document.querySelector("#galeria");
let tomarElement=document.querySelector("#tomar-foto");
let borrarElement=document.querySelector("#borrar-todo");


// Solicitar acceso a la cámara.
navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{videoElement.srcObject=stream}).catch(error=>{
    alert("Error al mostrar la cámara"+error);
})
// UserMedia se utiliza para solicitar o comprobar permisos de un medio (camara,microfono,etc)


// Declaración del contador de fotos para generar la id y poder borrar 
let contadorIDFotos=tomarIDProximaFoto();


// Cuando se haga click en el boton "tomar foto", se genera un canva de tipo 2d, con las coordenadas x,y de la imagen que se está transmitiendo de la cámara.
tomarElement.addEventListener("click",()=>{
    let canvas=document.createElement("canvas");
    canvas.width=videoElement.videoWidth;
    canvas.height=videoElement.videoHeight;
    const contex=canvas.getContext("2d");
    // Se captura con todos estos datos.
    contex.drawImage(videoElement,0,0,canvas.width,canvas.height);
    
    galeriaFoto.appendChild(canvas);

    // Convertir Canva a Base64

})






function tomarIDProximaFoto() {
    
}
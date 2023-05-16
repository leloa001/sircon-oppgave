const socket = io('ws://localhost:8080');

// Henter canvas elementet fra HTML documentet og lagrer det i en variabel
const canvas = document.querySelector('#myCanvas');
// canvas rendering context = 2d
var ctx = canvas.getContext("2d");

// variabel som lagrer vilken farge klienten ønsker å bruke når h*n fargelegger
let color = document.querySelector('#colorpicker');

// variabel som lagrer canvas sitt utsende
let imgData;

// funksjon som kjører hver gang klienten oppdaterer fargen på websiden
// den valgte fargen blir lagret i "color" variabelen
function changeColor() {
    color = document.querySelector('#colorpicker');
}

// Objekt som lagrer positionen til musepeker
// *oppdateres kun når musepekeren er over canvas elementet
let mousePos = { x: undefined, y: undefined };

// Variabel for å lagre om venstreklikk er aktiv eller ikke
let leftMouseClicked = false;

// sjekker om venstereklikk er aktiv og setter variabelen "leftMouseClicked" til TRUE om det stemmer
document.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // 0 is the code for the left mouse button
        leftMouseClicked = true;
    };
});

// // sjekker om venstereklikk er sluppet/ikke lenger aktiv og setter variabelen "leftMouseClicked" til FALSE om det stemmer
document.addEventListener("mouseup", function (event) {
    if (event.button === 0) { // 0 is the code for the left mouse button
        leftMouseClicked = false;
    };
});

// Funksjonen blir kjører hver gang musepekeren beveger seg over/på canvas elementet
canvas.addEventListener('mousemove', (event) => {

    // oppdaterer objektet som lagrer musepeker possition
    mousePos = { x: event.clientX, y: event.clientY };

    // objekt som lagrer hvor vi vil fargelegge og hvilken farge
    const draw = { fillColor: color.value, possition: mousePos, size: 5 };

    ctx.fillStyle = draw.fillColor;

    if (leftMouseClicked) { // Farger bare rutene når venstereklikk er aktiv inn
        socket.emit('draw', draw);
        imgData = canvas.toDataURL()
        socket.emit('newCanvasData', imgData)
    };

});

// funksjon som fjærner alt vi har tegnet
function clearCanvas() {
    const draw = { fillColor: '#ffffff', possition: { x: 0, y: 0 }, size: 800 };
    socket.emit('draw', draw);
};


// socket funksjon som kjører når en ny klient kobler seg til siden
// funksjonen gjør at canvaset er oppdatert når brukeren kobler seg til
socket.on('loadCanvas', canvasData => {
    if (canvasData !== null) {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
        img.src = canvasData;
    };
});

// socket funksjon som kjører når en klient tegner på siden
// denne funksjonen gjør at alle klientene ser oppdateringene til canvaset live
socket.on('draw', draw => {
    ctx.fillStyle = draw.fillColor;
    ctx.fillRect(draw.possition.x, draw.possition.y, draw.size, draw.size);
});

socket.on('active-users', (activeUsers) => {
    document.querySelector('#aktiveBrukere').innerHTML = activeUsers.length;
});
const http = require('http').createServer();

// setter io variabelen til å bruke socket.io biblioteket
const io = require('socket.io')(http, {
    cors: { origin: "*" },
});

// arrat med aktive brukere og deres bruker id
let activeUsers = [];
// variabel som lagrer utsendet til canvaset som en URL
let canvasData = null;

// funksjon som kjører når en ny bruker kobler seg på WebSocket serveren
io.on('connection', (socket) => {

    // connection id til bruker blir lagt til i "activeUsers" array
    activeUsers.push(socket.id);

    // sender ut en oppdatering til alle som er koblett til WebSocket serveren
    // Denne oppdateringen aktiverer en funksjon som oppdaterer teller for antall brukere koblet til
    io.emit('active-users', activeUsers);

    // sender ut en oppdatering til alle som er koblett til WebSocket serveren
    // denne oppdateringen laster inn data i canvas elementet slik at alle ser det likt
    io.emit('loadCanvas', canvasData);


    // socket funksjon som kjører når en klient kobler seg fra eller mister koblingen serveren
    socket.on('disconnect', () => {
        // fjerner klienten fra aktive brukere
        activeUsers = activeUsers.filter(user => user != socket.id);
        // Denne oppdateringen aktiverer en funksjon som oppdaterer teller for antall brukere koblet til
        io.emit('active-users', activeUsers);
    });

    socket.on('newCanvasData', imgData => {
        canvasData = imgData;
    });

    socket.on('draw', (draw) => {
        io.emit('draw', draw);
    });

});

http.listen(8080, () => console.log('listening on http://localhost:8080'));
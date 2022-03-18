let http = require('http');
let server = http.createServer();

let socketIO = require('socket.io');
let io = socketIO(server);

const port = 3000;

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('joined');
    });

    socket.on('message', (data) => {
        io.in(data.room).emit('new message', {user: data.user, message: data.message});
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

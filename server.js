const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;

io.on('connection', socket => {
  console.log('New Connection established');
  socket.broadcast.emit('newUser', 'New User join for chat');

  socket.on('sendMessage', (data) => {
    socket.emit('socketId', socket.id);
    io.emit('message', { data, socketId: socket.id, timestamp: new Date() });
  })

  socket.on('disconnect', () => console.log('User disconnect'))
})

server.listen(PORT, () => console.log(`Server started at ${PORT}`));
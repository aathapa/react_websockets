const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server);
const { generateMessage } = require('./src/utils/message');

const PORT = 4000;

io.on('connection', socket => {
  console.log('New Connection established');
  socket.emit('message', generateMessage('Welcome!!'))
  socket.broadcast.emit('newUser', generateMessage('New User join for chat'));

  socket.on('sendMessage', (data) => {
    socket.emit('socketId', socket.id);
    io.emit('message', { ...generateMessage(data), socketId: socket.id });
  })

  socket.on('sendLocation', ({ latitude, longitude }) => {
    io.emit('location', `https://www.google.com/maps?q=${latitude},${longitude}`);
  })

  socket.on('disconnect', () => console.log('User disconnect'))
})

server.listen(PORT, () => console.log(`Server started at ${PORT}`));
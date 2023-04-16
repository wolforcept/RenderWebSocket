'use strict';
const { Game, ServerClient } = require('./src/game')
const express = require('express');
// const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const server = express()
    .use(express.static('public'))
    // .use(express.static('common.js'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require("socket.io")(server, {
    cors: {
        origins: "*:*",
        methods: ["GET", "POST"]
    }
});
const game = new Game((message) => io.emit('message', JSON.stringify(message)));
io.on('connection', (_socket) => {
    const socket = _socket
    const serverClient = new ServerClient(socket, game, (message) => socket.emit('message', JSON.stringify(message)))
    socket.on('disconnect', () => game.onClientDisconnect(serverClient));
    socket.on('messaged', (args) => {
        try {
            serverClient.onMessage(JSON.parse(args))
        } catch (e) {
            console.log(e)
        }
    });
    game.onClientConnect(serverClient)
});

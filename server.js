'use strict';

const { Game, ServerClient } = require('./src/game')


const express = require('express');
// const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';
const server = express()
    .use(express.static('public'))
    // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require("socket.io")(server, {
    cors: {
        origins: "*:*",
        methods: ["GET", "POST"]
    }
});
const game = new Game((message) => io.emit('message', JSON.stringify(message)));
io.on('connection', (socket) => {
    const serverClient = new ServerClient(socket, game, (message) => console.log(`send message (${message}) to client not implemented on server`))
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

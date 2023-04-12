'use strict';

const { Game, ServerClient } = require('./src/game')

const game = new Game();

const express = require('express');
// const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require("socket.io")(server, {
    cors: {
        origins: "*:*",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    const client = new ServerClient(socket, (message) => io.emit('message', message))
    socket.on('disconnect', () => game.onClientDisconnect(client));
    socket.on('messaged', (args) => {
        client.onMessage(args)
        // io.emit('message', args);
        // console.log(args)
    });
    // socket.on('event_name', (...args) => {
    //     io.emit('message2', args);
    //     console.log(args)
    // });
    game.onClientConnect(client)
});

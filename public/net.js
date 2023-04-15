import { client } from './client'

var socket = io({ transports: ['websocket'] });
socket.on('message', (args) => {
    client.onMessage(JSON.parse(args))
});
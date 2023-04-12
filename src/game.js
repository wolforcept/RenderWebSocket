
class Game {

    onClientConnect(client) {
        console.log(`Client ${client.name} connected`)
    }

    onClientDisconnect(client) {
        console.log(`Client ${client.name} disconnected`)
    }
}

var nextClientId = 1;

class ServerClient {

    name = 'client_' + nextClientId++
    socket = undefined
    sendMessage = () => console.log('ServerClient not connectet yet!')

    constructor(socket, sendMessage) {
        this.socket = socket
        this.sendMessage = sendMessage
    }

    onMessage(args) {
        console.log('onMessage!')
        this.sendMessage(this.name + ' send his regards')
    }

}

module.exports = { Game, ServerClient }
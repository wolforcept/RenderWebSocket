
class Game {

    broadcast = () => console.log('Game not connected yet!')

    constructor(broadcast) {
        this.broadcast = broadcast
    }

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
    color = Math.floor(Math.random() * 255)
    socket = undefined
    game = {}
    sendMessage = () => console.log('ServerClient not connectet yet!')

    constructor(socket, game, sendMessage) {
        this.socket = socket
        this.game = game
        this.sendMessage = sendMessage
    }

    onMessage(args) {
        console.log({ serverOnMessage: args })

        if (args.message.startsWith('/nick ')) {
            this.name = args.message.substring(6)
            return
        }

        this.game.broadcast({ message: args.message, color: this.color, sender: this.name })
    }

}

module.exports = { Game, ServerClient }
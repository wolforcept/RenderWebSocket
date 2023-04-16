const common = require('../public/common.js')

class Data {

    grid = []

    constructor() {

        this.grid.isWithin = (x, y) => x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[x].length;
        this.grid.is = (x, y, type) => this.grid.isWithin(x, y) && this.grid[x][y] === type;

        for (let x = 0; x < common.GRID_W; x++) {
            this.grid[x] = []
            for (let y = 0; y < common.GRID_INITIAL_H; y++) {
                if (y === 0)
                    this.grid[x][y] = common.EMPTY
                else
                    this.grid[x][y] = common.DIRT
            }
        }
    }

    mine(x, y) {
        if (this.grid.isWithin(x, y))
            this.grid[x][y] = 0
    }

}

class Player {

    color = Math.floor(Math.random() * 255)
    x = 0
    y = 0
    money = 0
    food = 0
    stone = 0
    wood = 0
    target = null

    step(data) {
        const grid = data.grid
        if (this.target) {
            const { x: tx, y: ty } = this.target
            if (
                (Math.abs(this.x - tx) == 1 && Math.abs(this.y - ty) == 0)
                ||
                (Math.abs(this.x - tx) == 0 && Math.abs(this.y - ty) == 1)
            ) {
                if (grid.is(tx, ty, common.EMPTY)) {
                    this.x = tx
                    this.y = ty
                } else {
                    data.mine(tx, ty)
                }
            }
            this.target = null
        }
    }
}

class Game {

    data = new Data()
    broadcast = () => console.log('Game not connected yet!')
    clients = []

    constructor(broadcast) {
        this.broadcast = broadcast
        var tick = 0
        // var timer = 0
        setInterval(() => {
            // timer++
            // if (timer > 1000)
            //     this.step()
            this.clients.forEach(client => {
                client.player.step(this.data)
                client.sendMessage({
                    grid: this.data.grid,
                    players: this.clients.map(x => x.player)
                    //  scoreboard: this.getScoreBoard() 
                })
            })
            // this.broadcast({ grid: this.data.grid, scoreboard: this.getScoreBoard() })
            tick++
        }, 1000 / 10)
    }

    onPlayerMessage(player, type, args) {
        if (type === 'click' && args.x >= 0 && args.y >= 0)
            player.target = { x: args.x, y: args.y }
    }

    step() {
        // this.data.grid.forEach(x => x?.obj?.step && x.obj.step())
    }

    getScoreBoard() {
        return this.clients.map(x => `${x.name}: ${x.player.money}$`)
    }

    onClientConnect(client) {
        console.log(`Client ${client.name} connected`)
        this.clients.push(client)
        client.player = new Player()
    }

    onClientDisconnect(client) {
        console.log(`Client ${client.name} disconnected`)
        this.clients = this.clients.filter(x => x !== client)
        // console.log(this.clients)
    }
}

var nextClientId = 1;

class ServerClient {

    player = new Player()
    name = 'client_' + nextClientId++
    socket = undefined
    game = {}
    sendMessage = () => console.log('ServerClient not connectet yet!')

    constructor(socket, game, sendMessage) {
        this.socket = socket
        this.game = game
        this.sendMessage = sendMessage
    }

    onMessage(args) {
        if (args.type)
            this.game.onPlayerMessage(this.player, args.type, args)
        console.log({ serverOnMessage: args })

        // if (args.message.startsWith('/nick ')) {
        //     this.name = args.message.substring(6)
        //     return
        // }

        // this.game.broadcast({ message: args.message, color: this.color, sender: this.name })
    }

}

module.exports = { Game, ServerClient }
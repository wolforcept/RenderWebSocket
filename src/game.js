const common = require('../public/common.js')

const buildings = {
    house: [
        [48, 49, 49, 50],
        [60, 61, 61, 62],
        [72, 74, 73, 75]
    ],
    house2: [
        [48, 49, 49, 50],
        [60, 61, 61, 62],
        [72, 74, 73, 75]
    ],
}

function gaussianRandom(mean = 0, stdev = 1) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}
const len = 20;

class Data {

    grid = []

    constructor() {

        this.grid.isWithin = (x, y) => x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[x].length;
        this.grid.is = (x, y, type) => this.grid.isWithin(x, y) && this.grid[x][y] === type;
        // this.grid.is = (x, y, type) => this.grid[x] && this.grid[x][y] === type;

        for (let j = 0; j < len; j++) {
            for (let i = 0; i < len + j; i++) {
                this.set(i, j, 1)
            }
        }
        for (let j = len; j < len * 2 - 1; j++) {
            for (let i = j - len + 1; i < len * 2 - 1; i++) {
                this.set(i, j, 1)
            }
        }
        for (let i = 0; i < 100; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = gaussianRandom(0, 5);
            const x = Math.max(0, 20 + Math.floor(d * Math.cos(a)));
            const y = Math.max(0, 20 + Math.floor(d * Math.sin(a)));
            if (this.grid.is(x, y, 1))
                this.set(x, y, 2)
        }

        console.log(this.grid)
    }

    setBuilding(a, x, y) {
        for (let dy = 0; dy < a.length; dy++) {
            for (let dx = 0; dx < a[dy].length; dx++) {
                this.set(x + dx, y + dy, a[dy][dx])
            }
        }
    }

    set(x, y, tile) {
        if (!this.grid[x])
            this.grid[x] = []
        // if (this.grid.isWithin(x, y))
        this.grid[x][y] = typeof (tile) === 'object' ? tile.id : tile
    }

    mine(x, y) {
        if (this.grid.isWithin(x, y))
            this.grid[x][y] = 0
    }

    subGrid(x, y, w, h) {
        return this.grid
            .filter((_, i) => i >= x && i < x + w)
            .map(a => a.slice(y, y + h))
    }

}

// const neighbours = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
class Player {

    color = Math.floor(Math.random() * 255)
    x = 0
    y = 0

    menu = {}

    constructor() {
    }

    moveTo(x, y) {
        this.x = x
        this.y = y
    }

}

class Game {

    data = new Data()
    broadcast = () => console.log('Game not connected yet!')
    clients = []

    constructor(broadcast) {
        this.broadcast = broadcast
        var tick = 0
        var timer = 0
        setInterval(() => {
            timer++
            this.clients.forEach(client => {
                client.sendMessage({
                    // grid: this.data.subGrid(client.player.x - 5, client.player.y - 5, 10, 10),
                    grid: this.data.grid,
                    player: { ...client.player },
                    players: this.clients.map(x => x.player)
                    //  scoreboard: this.getScoreBoard() 
                })
            })
            // this.broadcast({ grid: this.data.grid, scoreboard: this.getScoreBoard() })
            tick++
        }, 1000 / 10)
    }

    onPlayerMessage(player, type, args) {
        if (type === 'move' && args.x !== undefined && args.y !== undefined)
            player.moveTo(player.x + args.x, player.y + args.y)
        // player.target = { x: player.x + args.x, y: player.y + args.y }
        // if (type === 'click' && args.x >= 0 && args.y >= 0)
        // player.target = { x: args.x, y: args.y }
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
        client.player.moveTo(0, 0)
    }

    onClientDisconnect(client) {
        console.log(`Client ${client.name} disconnected`)
        this.clients = this.clients.filter(x => x !== client)
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
        // console.log({ serverOnMessage: args })

        // if (args.message.startsWith('/nick ')) {
        //     this.name = args.message.substring(6)
        //     return
        // }

        // this.game.broadcast({ message: args.message, color: this.color, sender: this.name })
    }

}

module.exports = { Game, ServerClient }
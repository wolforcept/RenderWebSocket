const common = require('../public/common.js')

const buildings = {
    house: [
        [48, 49, 49, 50],
        [60, 61, 61, 62],
        [72, 74, 73, 75]
    ],
}
class Data {

    grid = []

    constructor() {

        this.grid.isWithin = (x, y) => x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[x].length;
        this.grid.is = (x, y, type) => this.grid.isWithin(x, y) && this.grid[x][y] === type;

        const tiles = common.tiles

        for (let x = 0; x < common.GRID_W; x++) {
            this.grid[x] = []
            for (let y = 0; y < common.GRID_H; y++) {
                this.grid[x][y] = 0
            }
        }

        for (let x = 0; x < common.GRID_W; x++) {
            for (let y = 0; y < common.GRID_H; y++) {
                if (Math.random() < .5)
                    this.set(x, y, tiles.grass1)
                else if (Math.random() < .4)
                    this.set(x, y, tiles.grass2)
                else
                    this.set(x, y, tiles.grass3)
            }
        }

        this.setBuilding(buildings.house, 5, 5)
    }

    setBuilding(a, x, y) {
        for (let dy = 0; dy < a.length; dy++) {
            for (let dx = 0; dx < a[dy].length; dx++) {
                this.set(x + dx, y + dy, a[dy][dx])
            }
        }
    }

    set(x, y, tile) {
        if (this.grid.isWithin(x, y))
            this.grid[x][y] = tile.id ?? tile
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
        if (this.target && grid.isWithin(this.target.x, this.target.y)) {
            const { x: tx, y: ty } = this.target
            const tile = common.tiles[grid[tx][ty]]
            if (tile) {
                if (
                    (Math.abs(this.x - tx) == 1 && Math.abs(this.y - ty) == 0)
                    ||
                    (Math.abs(this.x - tx) == 0 && Math.abs(this.y - ty) == 1)
                ) {
                    if (!tile.blocks) {
                        this.x = tx
                        this.y = ty
                        // } else {
                        //     data.mine(tx, ty)
                    }
                }
                this.target = null
            }
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
        var timer = 0
        setInterval(() => {
            timer++
            this.clients.forEach(client => {
                client.player.step(this.data)
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
            player.target = { x: player.x + args.x, y: player.y + args.y }
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
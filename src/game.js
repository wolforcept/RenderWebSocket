const antonio = ["building_cabin",
    "building_castle", "building_dock", "building_farm", "building_house", "building_market", "building_mill", "building_mine", "building_sheep", "building_smelter", "building_tower", "building_village", "building_wall", "building_water", "dirt", "dirt_lumber", "grass", "grass_forest", "grass_hill", "path_corner", "path_cornerSharp", "path_crossing", "path_end", "path_intersectionA", "path_intersectionB", "path_intersectionC", "path_intersectionD", "path_intersectionE", "path_intersectionF", "path_intersectionG", "path_intersectionH", "path_start", "path_straight", "river_corner", "river_cornerSharp", "river_crossing",
    "river_end", "river_intersectionA", "river_intersectionB", "river_intersectionC", "river_intersectionD", "river_intersectionE", "river_intersectionF", "river_intersectionG", "river_intersectionH", "river_start", "river_straight", "sand", "sand_rocks", "stone", "stone_hill", "stone_mountain", "stone_rocks", "unit_boat", "unit_house", "unit_houseLarge", "unit_mill", "unit_tower", "unit_tree", "unit_wallTower", "water", "water_island",
    "water_rocks"]

const antonio2 = ["building_cabin", "building_castle", "building_dock", "building_farm", "building_house", "building_market", "building_mill", "building_mine", "building_sheep", "building_smelter", "building_tower", "building_village", "building_wall", "building_water", "dirt", "dirt_lumber", "grass", "grass_forest", "grass_hill", "water", "water_island", "water_rocks"]

const types = {

    // TIER 1

    house: () => ({
        food: 0,
        step: (obj) => { obj.food += 1 },
        click: (player, obj) => { player.food += obj.food; obj.food = 0 }
    }),

    forest: () => ({
        food: 0,
        step: (obj) => { obj.food += 1 },
        click: (player, obj) => { player.food += obj.food; obj.food = 0 }
    }),

    hill: () => ({
        stone: 0,
        step: (obj) => { obj.stone += 1 },
        click: (player, obj) => { player.stone += obj.stone; obj.stone = 0 }
    }),

    cabin: () => ({
        wood: 0,
        step: (obj) => { obj.wood += 1 },
        click: (player, obj) => { player.wood += obj.wood; obj.wood = 0 }
    }),

    tower: () => ({
        money: 0,
        step: (obj) => { obj.money += 1 },
        click: (player, obj) => { player.money += obj.money; obj.money = 0 }
    }),

}

const neighbours = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
]
class Data {

    grid = []

    constructor() {
        // for (let x = -40; x < 40; x++) {
        //     for (let y = -40; y < 40; y++) {
        // let type = antonio2[Math.floor(Math.random() * antonio2.length)];
        // if (Math.random() < .75)
        //     type = "grass"
        // if (Math.random() < (x / 40) * (x / 40) * (x / 40) * (x / 40))
        //     continue
        //     }
        // }
        this.set(0, 0, 'forest')
        this.set(0, 1, 'hill')
    }

    set(x, y, type) {
        this.grid.push({ x, y, type, ...types[type]() })

    }
}

class Player {

    money = 0
    food = 0
    stone = 0
    wood = 0
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
            if (timer > 1000)
                this.step()
            this.broadcast({ grid: this.data.grid, scoreboard: this.getScoreBoard() })
            tick++
        }, 1000 / 30)
    }

    step() {
        this.data.grid.forEach(x => x?.obj?.step && x.obj.step())
    }

    getScoreBoard() {
        return this.clients.map(x => `${x.name}: ${x.player.money}$`)
    }

    onClientConnect(client) {
        console.log(`Client ${client.name} connected`)
        this.clients.push(client)
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

        // if (args.message.startsWith('/nick ')) {
        //     this.name = args.message.substring(6)
        //     return
        // }

        // this.game.broadcast({ message: args.message, color: this.color, sender: this.name })
    }

}

module.exports = { Game, ServerClient }
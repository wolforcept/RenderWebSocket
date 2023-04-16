const MENU_W = 300
const OBJ_W = 32, OBJ_W2 = OBJ_W / 2;
const OBJ_H = 32, OBJ_H2 = OBJ_H / 2;
const VIEW_W = 20;
const VIEW_H = 20;
const CANVAS_W = OBJ_W * VIEW_W + MENU_W
const CANVAS_H = OBJ_H * VIEW_H
const CENTER_X = OBJ_W * VIEW_W / 2
const CENTER_Y = OBJ_H * VIEW_H / 2

let images = [];
function preload() {
    console.log('preloading...')
    Object.keys(common.tiles).forEach(key => {
        const tile = common.tiles[key]
        images[tile.id] = loadImage(`assets/${tile.path}.png`);
        console.log(`images[${tile.id}] = ${tile.path}`)
    })
    console.log({ images })
    console.log('preload done.')
}

function setup() {
    console.log('setuping...')
    createCanvas(CANVAS_W, CANVAS_H);
    console.log(`created canvas ${CANVAS_W}x${CANVAS_H}`)
    console.log('setup done')
}

function draw() {
    noSmooth();
    background(0);

    testInput()

    if (DATA.grid) {
        renderGrid(DATA.grid, DATA.player)
    }
    if (DATA.players) {
        renderPlayers(DATA.players, DATA.player)
    }
}

function renderPlayers(players, player) {
    const px = player?.x ? player.x : 0;
    const py = player?.y ? player.y : 0;

    noStroke();
    colorMode(HSB);

    players.forEach(player => {
        fill(color(player.color, 100, 100));
        ellipse(CENTER_X + (player.x - px) * OBJ_W + OBJ_W2, CENTER_Y + (player.y - py) * OBJ_H + OBJ_W2, OBJ_W * .8, OBJ_W * .8)
    });
    colorMode();
}

function renderGrid(grid, player) {
    const px = player?.x ? player.x : 0;
    const py = player?.y ? player.y : 0;

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            const type = grid[x][y]
            if (!images[type]) continue
            const xx = CENTER_X + (x - px) * OBJ_W;
            const yy = CENTER_Y + (y - py) * OBJ_H;
            // fill(colors[type]);
            if (xx >= 0 && yy >= 0 && xx < CANVAS_W && yy < CANVAS_H)
                image(images[type], xx, yy, OBJ_W, OBJ_H)
        }
    }
}

function mouseClicked() {
    if (mouseX < 0 || mouseY < 0 || mouseX >= CANVAS_W || mouseY >= CANVAS_H)
        return;

    const gx = Math.floor(mouseX / OBJ_W)
    const gy = Math.floor(mouseY / OBJ_H)

    client.sendMessage({ type: "click", x: gx, y: gy })
}

var key_cooldown = 0
const max_key_cooldown = 10
function testInput() {

    if (key_cooldown > 0) {
        key_cooldown--
        return
    }

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        client.sendMessage({ type: "move", x: -1, y: 0 })
        key_cooldown = max_key_cooldown
        return
    }

    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        client.sendMessage({ type: "move", x: 1, y: 0 })
        key_cooldown = max_key_cooldown
        return
    }

    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        client.sendMessage({ type: "move", x: 0, y: -1 })
        key_cooldown = max_key_cooldown
        return
    }

    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        client.sendMessage({ type: "move", x: 0, y: 1 })
        key_cooldown = max_key_cooldown
        return
    }
}
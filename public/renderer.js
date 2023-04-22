const MENU_W = 300;
const OBJ_W = 64, OBJ_W2 = OBJ_W / 2;
const OBJ_H = 96, OBJ_H2 = OBJ_H / 2;
const VIEW_W = 10;
const VIEW_H = 8;
const CANVAS_W = OBJ_W * VIEW_W + MENU_W;
const CANVAS_H = OBJ_H * VIEW_H;
const CENTER_X = OBJ_W * VIEW_W / 2;
const CENTER_Y = OBJ_H * VIEW_H / 2;

const MENU_ITEM_W = 162;
const MENU_ITEM_H = 54;
const MENU_X = OBJ_W * VIEW_W + 24
const MENU_Y = 24
const MMNN = 24
const MENU_SELL_Y = MMNN * 0
const MENU_MINE_Y = MMNN * 1

let menu_images = [];
let tile_images = [];

function preload() {
    console.log('preloading...')
    common.tiles.forEach(tile => {
        const path = `assets/tiles/${tile.name}.png`;
        try {
            tile_images[tile.id] = loadImage(path);
            console.log(`tile_images[${tile.id}]=${path}`)
        } catch (e) {
            console.log(`failed to load image ${path}`)
        }
    });

    // menu items
    // ['mine', 'sell'].forEach(path => {
    //     menu_images[path] = loadImg(`assets/gui/${path}.png`);
    //     menu_images[path + '_down'] = loadImg(`assets/menu_${path}_down.png`);
    // });

    console.log({ tile_images, menu_images })
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
        // renderPlayers(DATA.players, DATA.player)
    }

    if (DATA.player && DATA.player.menu)
        renderGui(DATA.player.menu)
}

function toHex(x, y) {
    const player = DATA.player || { x: 0, y: 0 }
    const px = (player && player.x) ? player.x : 0;
    const py = (player && player.y) ? player.y : 0;

    return {
        x: CENTER_X + (x - px) * OBJ_W - (OBJ_W2 * y),
        y: CENTER_Y + (y - py) * OBJ_H2
    }
}

function renderPlayers(players, player) {
    const px = (player && player.x) ? player.x : 0;
    const py = (player && player.y) ? player.y : 0;

    noStroke();
    colorMode(HSB);

    players.forEach(player => {
        fill(color(player.color, 100, 100));
        ellipse(
            CENTER_X + (player.x - px) * OBJ_W + OBJ_W2,
            CENTER_Y + (player.y - py) * OBJ_H + OBJ_W2, OBJ_W * .8 - (OBJ_W2 * y),
            OBJ_W * .8)
    });
    colorMode();
}

function renderGrid(grid, player) {

    // 
    for (let x = 0; x < grid.length; x++) {
        if (!grid[x]) continue
        for (let y = 0; y < grid[x].length; y++) {
            if (!grid[x][y]) continue
            const type = grid[x][y]
            if (!tile_images[type]) continue
            const { x: xx, y: yy } = toHex(x, y)

            if (xx >= -OBJ_W && yy >= -OBJ_H && xx < CANVAS_W && yy < CANVAS_H) {
                image(tile_images[type], xx, yy, OBJ_W, OBJ_H * .7)
            }
        }
    }
    fill(color(100, 100, 100));
    ellipse(10, 10, 10)
}

var mouseClick = false, mouseWasPressed = false

function haveButton(imageName, x, y, w, h, callback) {
    const isIn = mouseX >= x && mouseY >= y && mouseX <= x + w && mouseY <= y + h
    const img = menu_images[imageName + (mouseIsPressed && isIn ? '_down' : '')]
    image(img, x, y, w, h)

    if (mouseClick && mouseButton === LEFT && isIn)
        callback()
}

function renderGui(menu) {
    mouseClick = !mouseIsPressed && mouseWasPressed
    mouseWasPressed = mouseIsPressed

    if (menu.mine) {
        haveButton('mine', MENU_X, MENU_Y + MENU_MINE_Y, MENU_ITEM_W, MENU_ITEM_H, () => {
            console.log('miiiiine')
        })
    }

    if (menu.sell) {
        haveButton('sell', MENU_X, MENU_Y + MENU_SELL_Y, MENU_ITEM_W, MENU_ITEM_H, () => {
            console.log('selll')
        })
    }

    // if (menu.sell) {
    //     image(menu_images['sell'], MENU_X, MENU_Y + MENU_SELL_Y, MENU_ITEM_W, MENU_ITEM_H)
    // }
    // let dy = 0;
    // menu.forEach(elem => {
    //     dy += MENU_SEPPARATION
    // });
}

function mouseClicked() {
    if (mouseX < 0 || mouseY < 0 || mouseX >= CANVAS_W || mouseY >= CANVAS_H)
        return;

    const gx = Math.floor(mouseX / OBJ_W)
    const gy = Math.floor(mouseY / OBJ_H)

    client.sendMessage({ type: "click", x: gx, y: gy })
}

var key_cooldown = 0
const max_key_cooldown = 5
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

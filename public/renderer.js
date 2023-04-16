colors = []

const MENU_W = 300
const OBJ_W = 64, OBJ_W2 = OBJ_W / 2;
const OBJ_H = 64, OBJ_H2 = OBJ_H / 2;
const CANVAS_W = OBJ_W * common.GRID_W + MENU_W
const CANVAS_H = OBJ_H * common.GRID_INITIAL_H

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    console.log(`created canvas ${CANVAS_W}x${CANVAS_H}`)
    colors[common.DIRT] = color(100, 50, 0)

}

function draw() {
    background(0);

    if (DATA.grid) {
        renderGrid(DATA.grid)
    }
    if (DATA.players) {
        renderPlayers(DATA.players)
    }
}

function renderPlayers(players) {

    noStroke();
    colorMode(HSB);

    players.forEach(player => {
        fill(color(player.color, 100, 100));
        ellipse(player.x * OBJ_W + OBJ_W2, player.y * OBJ_H + OBJ_W2, OBJ_W * .8, OBJ_W * .8)

    });
    colorMode();
}

function renderGrid(grid) {

    const gw = common.GRID_W

    noStroke();
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            const type = grid[x][y]
            if (type <= 0 || type >= colors.length) continue
            fill(colors[type]);
            rect(x * OBJ_W, y * OBJ_H, OBJ_W, OBJ_H)
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
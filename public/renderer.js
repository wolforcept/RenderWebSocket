const assets = {
    asteroid_0: 'assets/asteroid_0.png',
    asteroid_1: 'assets/asteroid_1.png',
    asteroid_2: 'assets/asteroid_2.png',
    black_hole_0: 'assets/black_hole_0.png',
    moon_0: 'assets/moon_0.png',
    moon_1: 'assets/moon_1.png',

    planet_0: 'assets/planet_0.png',
    planet_1: 'assets/planet_1.png',
    planet_2: 'assets/planet_2.png',
    planet_3: 'assets/planet_3.png',
    planet_4: 'assets/planet_4.png',
    planet_5: 'assets/planet_5.png',
    planet_6: 'assets/planet_6.png',
    planet_7: 'assets/planet_7.png',
    planet_8: 'assets/planet_8.png',
    planet_9: 'assets/planet_9.png',
    planet_10: 'assets/planet_10.png',
    planet_11: 'assets/planet_11.png',
    planet_12: 'assets/planet_12.png',
    planet_13: 'assets/planet_13.png',
    planet_14: 'assets/planet_14.png',
    planet_15: 'assets/planet_15.png',
    planet_16: 'assets/planet_16.png',
    planet_17: 'assets/planet_17.png',
    planet_18: 'assets/planet_18.png',
    planet_19: 'assets/planet_19.png',
    planet_20: 'assets/planet_20.png',
    planet_21: 'assets/planet_21.png',
    planet_22: 'assets/planet_22.png',
    planet_23: 'assets/planet_23.png',
    planet_24: 'assets/planet_24.png',
    planet_25: 'assets/planet_25.png',
    planet_26: 'assets/planet_26.png',
    planet_27: 'assets/planet_27.png',
    planet_28: 'assets/planet_28.png',
    planet_29: 'assets/planet_29.png',
    planet_30: 'assets/planet_30.png',
    planet_31: 'assets/planet_31.png',
    planet_32: 'assets/planet_32.png',

    star_0: 'assets/star_0.png',
    star_1: 'assets/star_1.png',
    star_2: 'assets/star_2.png',
    star_3: 'assets/star_3.png',
    star_4: 'assets/star_4.png',
    star_5: 'assets/star_5.png',
    star_6: 'assets/star_6.png',
    star_7: 'assets/star_7.png',
    star_8: 'assets/star_8.png',
    star_9: 'assets/star_9.png',
}

function preload() {
    Object.keys(assets).forEach(key => {
        const img = loadImage(assets[key]);
        assets[key] = img
    });
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

var galaxyPosition = { x: 400, y: 300, zoom: .011 }

const MIN_ZOOM = 0.011
function mouseWheel(event) {

    var i = 10;
    setTimeout(zoom, 1)
    function zoom() {
        if (i-- < 0) return
        const zoomDiff = (event.wheelDeltaY > 0 ? 1.01 : .99)
        if (galaxyPosition.zoom * zoomDiff < MIN_ZOOM) {
            galaxyPosition.zoom = MIN_ZOOM
            return
        }
        const { x: mx, y: my } = mouse.pos
        galaxyPosition.x -= mx;
        galaxyPosition.y -= my;
        galaxyPosition.zoom *= zoomDiff
        // scale *= zoomDiff;
        galaxyPosition.x *= zoomDiff;
        galaxyPosition.y *= zoomDiff;
        galaxyPosition.x += mx;
        galaxyPosition.y += my;
        setTimeout(zoom, 20)
    }

    console.log(JSON.stringify(galaxyPosition))
}

const renderDepths = [0, 1000, 100000]
function renderBody(body, depth = 0) {
    const { x: gx, y: gy, zoom: gz } = galaxyPosition

    if (renderDepths[depth] >= gz) return

    if (body.x > (-64 - gx) / gz
        && body.y > (-64 - gy) / gz
        && body.x < (canvas.width - gx) / gz
        && body.y < (canvas.height - gy) / gz
    ) {

        // let imgSizeFactor = gz
        // for (let i = 0; i < depth; i++) imgSizeFactor /= gz
        const imgSize = Math.min(64, 320 * gz)
        image(assets[body.type + '_' + body.subtype], gx + body.x * gz, gy + body.y * gz, imgSize, imgSize);


        if (body.children) {

            body.children.forEach(child => {
                renderBody(child, depth + 1)
            })
        }
    }
}

function drawSector(id) {
    galaxy.sectors[id]?.bodies?.forEach(body => {
        renderBody(body)
    })
}

var mouseStartDrag = { x: 0, y: 0 }
function draw() {
    background(0);

    if (mouse.presses()) {
        mouseStartDrag = { x: mouse.pos.x - galaxyPosition.x, y: mouse.pos.y - galaxyPosition.y }
    }
    if (mouse.pressing()) {
        galaxyPosition.x = mouse.pos.x - mouseStartDrag.x
        galaxyPosition.y = mouse.pos.y - mouseStartDrag.y
    }

    DATA?.players?.forEach(player => {
        tint(player?.color?.r, player?.color?.g, player?.color?.b, 255);
        image(assets.asteroid_0, player?.x, player?.y);
    });

    drawSector('innerRim')
    drawSector('outerRim')
    for (let i = 1; i < galaxy.distanceDivisions; i++) {
        for (let j = 0; j < galaxy.angleDivisions; j++) {
            drawSector(i + ',' + j)
        }
    }

}

function onResize() {
    resizeCanvas(window.innerWidth, window.innerHeight)
}
window.addEventListener("resize", onResize);


function inverse(m1) {
    var det = m1[0] * (m1[4] * m1[8] - m1[7] * m1[5]) -
        m1[1] * (m1[3] * m1[8] - m1[5] * m1[6]) +
        m1[2] * (m1[3] * m1[7] - m1[4] * m1[6]);

    if (det === 0)
        return [1, 0, 0, 0, 1, 0];

    var invdet = 1 / det;

    var inverted = [];
    inverted[0] = (m1[4] * m1[8] - m1[7] * m1[5]) * invdet;
    inverted[1] = (m1[2] * m1[7] - m1[1] * m1[8]) * invdet;
    inverted[2] = (m1[1] * m1[5] - m1[2] * m1[4]) * invdet;
    inverted[3] = (m1[5] * m1[6] - m1[3] * m1[8]) * invdet;
    inverted[4] = (m1[0] * m1[8] - m1[2] * m1[6]) * invdet;
    inverted[5] = (m1[3] * m1[2] - m1[0] * m1[5]) * invdet;
    inverted[6] = (m1[3] * m1[7] - m1[6] * m1[4]) * invdet;
    inverted[7] = (m1[6] * m1[1] - m1[0] * m1[7]) * invdet;
    inverted[8] = (m1[0] * m1[4] - m1[3] * m1[1]) * invdet;
    return inverted;
}

function transformPoint(point, matrix, isInverse = true) {
    var invertedMatrix = isInverse ? inverse(matrix) : matrix;
    return {
        x: point.x * invertedMatrix[0] + point.y * invertedMatrix[1] + invertedMatrix[2],
        y: point.x * invertedMatrix[3] + point.y * invertedMatrix[4] + invertedMatrix[5]
    };
}

class GalaxyMap {

    galaxy
    loaded
    ctx

    constructor(galaxy) {
        this.galaxy = galaxy
    }

    initCanvas(canvas) {
        var cs = getComputedStyle(canvas);
        this.ctx = canvas.getContext('2d');

        var ctx = this.ctx
        var galaxy = this.galaxy

        canvas.width = parseInt(cs.getPropertyValue('width'), 10);
        canvas.height = parseInt(cs.getPropertyValue('height'), 10);

        var transform = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        ctx.lineWidth = 1;
        let w = 64;
        let h = 64;

        let box = undefined;

        let mouse = { x: 0, y: 0 };
        const setMouse = function setMouse(evt) {
            mouse.x = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            mouse.y = evt.offsetY || (evt.pageY - canvas.offsetTop);
        }
        let mouseThread = {
            maxTime: 5,
            time: 0,
            timeout: setInterval(() => {
                if (mouseThread.time > 0)
                    mouseThread.time--;
                if (!box && mouseThread.time === 1) {
                    ctx._redraw();
                }
            }, 100)
        }

        let hoveredBody = undefined;

        ctx._drawBody = (parentMapX, parentMapY, ctx, body, scale) => {

            let { x, y } = transformPoint({ x: body.x, y: body.y }, transform, false);

            // let isVisible = false;
            // if (x > -w && x < canvas.width + w && y > -h && y < canvas.height + h)
            //     isVisible = true;

            let maxChildRad = 0;
            body.children.forEach(child => {
                let d = child.distance * transform[0];
                if (d > maxChildRad)
                    maxChildRad = d;
            });

            if (x + maxChildRad < -w || x - maxChildRad > canvas.width + w || y + maxChildRad < -h || y - maxChildRad > canvas.height + h)
                return false;

            // isVisible = true;

            // if (!isSelfVisible)
            //     return false;

            // let visibleDescendant = false;
            if (transform[0] > 1000)
                body.children.forEach(child => {

                    if (child.orbit) {
                        ctx.strokeStyle = "#FFFFFF88";
                        ctx.beginPath();
                        ctx.arc(x, y, child.distance * transform[0], 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                    }

                    if (!child.orbit || child.distance * transform[0] > 32) {
                        let nextScale = child.type === 'planet' ? scale / 100 : scale / 10;
                        ctx._drawBody(body.x, body.y, ctx, child, nextScale);
                        // visibleDescendant = true;
                    }
                });


            let imgSize = w * scale;
            imgSize = Math.min(128, imgSize);
            // imgSize *= 2;
            imgSize *= body.size;

            let imgX = parseInt(x - imgSize / 2);
            let imgY = parseInt(y - imgSize / 2);

            if (!box && mouse.x > imgX && mouse.y > imgY && mouse.x < imgX + imgSize && mouse.y < imgY + imgSize) {
                hoveredBody = body;
            }

            let imgName = `${body.type}_${body.subtype}`;

            console.log({ imgName, imgs: ctx.images, });

            if (ctx.images && ctx.images[imgName]) {
                console.log(`image ${imgName} exists`);
                // if (scale)
                // let imgH = h * Math.pow(scale, 1 / 6) / 2;
                // imgH = Math.min(64, imgH);
                ctx.drawImage(ctx.images[imgName], imgX, imgY, imgSize, imgSize);
                // else
                // ctx.drawImage(ctx.images[imgName], x - w4, y - h4, w2*scale, h2);
            }
            if (imgSize > 16)
                ctx.fillText(body.name, x, y - imgSize / 2 - 4);

            return true;
        }

        ctx.drawTextbox = (x, y, text) => {

            let lines = text.split("\n");
            let lineH = 20; // line height
            let b = 20; //border
            let h = b + lines.length * lineH + b;
            let w = b + 200 + b;
            if (canvas.width - mouse.x < w)
                x -= w - canvas.width + mouse.x;
            if (canvas.height - mouse.y < h)
                y -= h - canvas.height + mouse.y;

            box = { x, y, w, h };
            ctx.fillStyle = '#00000099';
            ctx.beginPath();
            ctx.moveTo(x + b, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x, y + b);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#FFFFFF99";
            ctx.textAlign = "left";
            ctx.font = `16px Arial`;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                ctx.fillText(line, x + b, y + b + lineH + i * lineH - 2);
            }
        }

        const makeDistanceString = (distance) => {
            let d = Math.floor(distance * 1000);
            if (d === 0) {
                d = Math.floor(distance * 150000000);
                if (d === 0)
                    return Math.floor(distance * 150000000000) + ' m';
                return d + ' km';
            }
            if (d > 10000000)
                return Math.floor(d / 1000) + ' kAU';
            if (d > 10000)
                return d / 1000 + ' kAU';
            return d + ' AU';
        }

        const drawSectorLines = () => {
            ctx.strokeStyle = "#00000022";
            // ctx.strokeStyle = "#FFFFFF11";
            let center = transformPoint({ x: 0, y: 0 }, transform, false);
            let aDivSize = galaxy.sizeD;
            let dDivSize = galaxy.sizeA;
            for (let i = 0; i < galaxy.angleDivisions; i++) {
                let _x1 = Math.cos(i * aDivSize) * dDivSize;
                let _y1 = Math.sin(i * aDivSize) * dDivSize;
                let _x2 = Math.cos(i * aDivSize) * dDivSize * (galaxy.distanceDivisions);
                let _y2 = Math.sin(i * aDivSize) * dDivSize * (galaxy.distanceDivisions);
                let p1 = transformPoint({ x: _x1, y: _y1 }, transform, false);
                let p2 = transformPoint({ x: _x2, y: _y2 }, transform, false);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
            for (let i = 0; i <= galaxy.distanceDivisions; i++) {
                let transformedRadius = dDivSize * i * transform[0];
                ctx.beginPath();
                ctx.arc(center.x, center.y, transformedRadius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
            }
        }

        ctx._redraw = () => {

            if (!galaxy) {
                setTimeout(ctx._redraw, 1000);
                return;
            }

            // let time = new Date().getTime();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hoveredBody = undefined;

            drawSectorLines();

            ctx.fillStyle = "#FFFFFF99";
            ctx.textAlign = "center";
            ctx.font = `12px Arial`;

            let sectorsToRender = [];
            let canvasCenter = transformPoint({ x: canvas.width / 2, y: canvas.height / 2 }, transform);
            let canvasCircleSize = Math.max(canvas.width, canvas.height) / transform[0];
            let sectorCircleSize = Math.max(galaxy.sizeD, galaxy.sizeA * Math.PI * 2);
            // if (transform[0] < 0.5)
            //     canvasCircleSize = 2000;

            let innerRim = galaxy.sectors['innerRim'];
            if (Math.hypot(innerRim.centerX, innerRim.centerY) < sectorCircleSize + canvasCircleSize)
                sectorsToRender.push(innerRim);

            let outerRim = galaxy.sectors['outerRim'];
            if (transform[0] < 0.5 || Math.hypot(outerRim.centerX, outerRim.centerY) < galaxy.radius - canvasCircleSize)
                sectorsToRender.push(outerRim);
            for (let d = 1; d < galaxy.distanceDivisions; d++) {
                for (let a = 0; a < galaxy.angleDivisions; a++) {
                    // for (let p = renderMinA; p <= renderMaxA; p++) {
                    //     for (let r = renderMinD; r <= renderMaxD; r++) {
                    let sectorName = `${d},${a}`;
                    let sector = galaxy.sectors[sectorName];
                    if (!sector)
                        console.log("missing sector " + sectorName)
                    else
                        if (Math.hypot(sector.centerX - canvasCenter.x, sector.centerY - canvasCenter.y) < sectorCircleSize + canvasCircleSize) {
                            sectorsToRender.push(sector);
                        }
                }
            }

            ctx.strokeStyle = "#FF000055";
            ctx.beginPath();
            let temp = transformPoint({ x: canvasCenter.x, y: canvasCenter.y }, transform, false);
            ctx.arc(temp.x, temp.y, canvasCircleSize * transform[0] * 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();

            // Object.entries(galaxy.sectors).forEach((sector) => {
            // sector[1].forEach(body => {
            sectorsToRender.forEach(sector => {
                sector.bodies.forEach(body => {
                    ctx._drawBody(0, 0, ctx, body, Math.pow(transform[0], .5) * 10 / w);
                });
            });

            if (hoveredBody) {
                let text = "";
                if (hoveredBody.sector === 'innerRim' || hoveredBody.sector === 'outerRim')
                    text += `${hoveredBody.typeName} at ${hoveredBody.sector}`;
                else
                    text += `${hoveredBody.typeName} at sector ${hoveredBody.sector}`;
                text += `\nsubtype ${hoveredBody.subtype}`

                let distance = makeDistanceString(hoveredBody.distance);
                if (hoveredBody.orbit) {
                    text += `\nOrbital Distance: ${distance}`
                } else {
                    text += `\n${distance} from center`
                }
                text += `\nName: ${hoveredBody.name}`;
                text += `\nSize: ${(Math.round(hoveredBody.size * 100)) - 50}%`;
                if (hoveredBody.type === 'star') {
                    text += `\nPlanets: ${hoveredBody.children.length}`
                }
                if (hoveredBody.type === 'planet') {
                    text += `\nMoons: ${hoveredBody.children.length}`
                }
                ctx.drawTextbox(mouse.x, mouse.y, text);
            }
            // console.log("redraw time: " + (new Date().getTime() - time) + "ms");
            // console.log(transform);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        const mult = function mult(multTransform) {
            var temp = [];
            var i, j, k, sum;
            for (i = 0; i <= 2; i++) {
                for (j = 0; j <= 2; j++) {
                    sum = 0;
                    for (k = 0; k <= 2; k++) {
                        sum = sum + transform[i * 3 + k] * multTransform[k * 3 + j];
                    }
                    temp[i * 3 + j] = sum;
                }
            }
            transform = temp;
        }
        const zoom = (direction, x, y, multiplier = 1, alreadyScaled = false) => {
            if (direction > 0 && transform[0] > 1000000000)
                return;

            if (direction < 0 && transform[0] < 0.01)
                return;

            var scaledMouse = { x: x, y: y }
            if (!alreadyScaled)
                scaledMouse = transformPoint(scaledMouse, transform);

            mult([1, 0, scaledMouse.x,
                0, 1, scaledMouse.y,
                0, 0, 1]);
            var scale = 1.001 * multiplier;
            if (direction > 0) {
                mult([scale, 0, 0,
                    0, scale, 0,
                    0, 0, 1]);
            }
            else {
                mult([1 / scale, 0, 0,
                    0, 1 / scale, 0,
                    0, 0, 1]);
            }

            mult([1, 0, -scaledMouse.x,
                0, 1, -scaledMouse.y,
                0, 0, 1]);

            ctx._redraw();
        }
        zoom(-1, canvas.width / 2, canvas.height / 2, 30);

        var dragStart = false;
        var wasDragged = false;

        canvas.addEventListener('mousedown', function (evt) {
            if (evt.buttons & 1 != 0) {
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                dragStart = true;
            }
        }, false);
        canvas.addEventListener('mousemove', function (evt) {
            mouseThread.time = mouseThread.maxTime;
            setMouse(evt);
            if (box) {
                if (mouse.x < box.x || mouse.y < box.y || mouse.x > box.x + box.w || mouse.y > box.y + box.h) {
                    box = null;
                    ctx._redraw();
                }
            }
            if (dragStart) {
                transform[2] += evt.movementX;
                transform[5] += evt.movementY;
                ctx._redraw();
                wasDragged = true;
            }
        }, false);
        canvas.addEventListener('mouseup', function (evt) {
            dragStart = null;
            if (!wasDragged) {
                setMouse(evt);
                ctx._redraw();
                if (hoveredBody) {
                    let body = hoveredBody;
                    let maxTransform = body.type === 'star' || body.type === 'black_hole' ? 10000 : body.type === 'planet' ? 5000000 : 500000000;
                    let interval = setInterval(() => {
                        // let { x, y } = transformPoint({ x: body.x, y: body.y }, transform, false);
                        if (transform[0] < maxTransform)
                            zoom(1, body.x, body.y, 1.5, true);
                        ctx._redraw();
                        if (transform[0] > maxTransform)
                            clearInterval(interval);
                    }, 50);
                }
            }
            wasDragged = false;
        }, false);
        canvas.addEventListener('mouseout', function (evt) {
            dragStart = null;
        }, false);
        canvas.addEventListener('mouseenter', function (evt) {
            if (evt.buttons & 1 != 0) {
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                dragStart = true;
            }
        }, false);
        canvas.addEventListener('wheel', function (evt) {
            setMouse(evt);
            evt.preventDefault();
            zoom(evt.wheelDelta, mouse.x, mouse.y, 2)
        }, false);

        console.log({ 'canvas state': 'innited', canvas, ctx })
    };

    loadImages(assets, callback) {

        var ctx = this.ctx

        console.log('loading images...')
        const imageNames = Object.keys(assets)
        ctx.images = {};
        const finish = () => {
            console.log('images loaded.')
            this.loaded = true;
            callback();
        }
        var i, numLoading = imageNames.length;
        const onLoad = () => { --numLoading === 0 && finish() };
        for (i = 0; i < imageNames.length; i++) {
            console.log({ img: imageNames[i] })
            const img = ctx.images[imageNames[i]] = new Image();
            // img.src = `/_next/image?url=%2Fimages%2F${imageNamesArray[i]}.png&w=128&q=75`;
            img.src = assets[imageNames[i]];
            img.onload = onLoad;
        }
    }

    // useEffect(() => {
    //     Connection.getGalaxy()
    //         .then((galaxy) => {
    //             Connection.getSectors().then(
    //                 (sectors) => {
    //                     galaxy.sectors = sectors;
    //                     setGalaxy(galaxy);
    //                     initCanvas(canvasRef.current);
    //                 }
    //             )
    //         });
    // }, []);

    // useEffect(() => ctx && loadImages(() => ctx._redraw()), [ctx]);

    // return (
    //     <>
    //     {!loaded && <span style={ { padding: '10px 15px', position: 'absolute' } }> Loading...</span>}
    // { <canvas className='Map' style = {{ backgroundColor: '#112233' } } ref = { canvasRef } />}
    // </>
    //     )
}

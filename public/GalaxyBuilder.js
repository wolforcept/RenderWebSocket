
const types = ['black_hole', 'star', 'planet', 'moon', 'asteroid'];
const subtypes = [1, 10, 33, 2, 3]
const imageNamesArray = (() => {
    let array = []
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++)
        for (let i = 0; i < subtypes[typeIndex]; i++)
            array.push(types[typeIndex] + '_' + i)
    return array;
})();

// const names = [
//     'Rihiri', 'Ahiri', 'Gnuhegantu', 'Phaunia', 'Struna 5SD7', 'Gippe 2 ', 'Cumiehiri', 'Busatis',
//     'Destrilia', 'Dogradus', 'Hiacarro', 'Xaogawa', 'Creronope', 'Gneduclite', 'Beron PD6', 'Murn PZN ',
//     'Sonnurilia', 'Mangolea', 'Zebbolla', 'Pustrides', 'Kouclite', 'Ewei', 'Viethea', 'Gusicarro',
//     'Greon DF9', 'Viri FNL ', 'Ritheania', 'Castrovis', 'Pistrolla', 'Endade', 'Tuilea', 'Peturn',
//     'Chagizuno', 'Strezewei', 'Gagua R74', 'Cryke P807 ', 'Denveovis', 'Minvenia', 'Catrichi', 'Lidrillon',
//     'Yeugawa', 'Thounov', 'Draveruta', 'Phucucarro', 'Strara 0Z3G', 'Phao 5C2 ', 'Mugnehines', 'Usuter',
//     'Kudion', 'Dunnyke', 'Yoyama', 'Zuigawa', 'Llubecury', 'Duthecury', 'Larth 51', 'Chilles LXB ',
//     'Mugnehines', 'Usuter', 'Kudion', 'Dunnyke', 'Yoyama', 'Zuigawa', 'Llubecury', 'Duthecury',
//     'Larth 51', 'Chilles LXB ', 'Thalliozuno', 'Agneturn', 'Rachypso', 'Yolrapus', 'Kelia', 'Huthea',
//     'Tresithea', 'Thopipra', 'Dronoe I93Q', 'Grore DHA ', 'Thalliozuno', 'Agneturn', 'Rachypso', 'Yolrapus',
//     'Kelia', 'Huthea', 'Tresithea', 'Thopipra', 'Dronoe I93Q', 'Grore DHA ', 'Thalliozuno', 'Agneturn',
//     'Rachypso', 'Yolrapus', 'Kelia', 'Huthea', 'Tresithea', 'Thopipra', 'Dronoe I93Q', 'Grore DHA ',
//     'Thalliozuno', 'Agneturn', 'Rachypso', 'Yolrapus', 'Kelia', 'Huthea', 'Tresithea', 'Thopipra',
//     'Dronoe I93Q', 'Grore DHA ', 'Xomezuno', 'Sanzucury',
//     'Dugiri', 'Bicrapus', 'Xoter', 'Mucury', 'Strakurus', 'Chalaclite', 'Bagua EIHQ', 'Brade S68 ',
//     'Tilvaipra', 'Olrietera', 'Zudrao', 'Yaccion', 'Yonus', 'Thewei', 'Striathea', 'Lloxoliv',
//     'Triri IU7', 'Brore IW6 ', 'Peziuhiri', 'Elmaunia', 'Ugrilia', 'Chelminda', 'Uemia', 'Ioter',
//     'Duthehiri', 'Zatotis', 'Llonoe TJN', 'Drinda Z38 ', 'Aniatov', 'Ozicarro', 'Ezeshan', 'Thusoth',
//     'Healia', 'Zoibos', 'Molatania', 'Trixomia', 'Zilles HF', 'Ziuq 7PO ', 'Tudaonus', 'Condaiwei',
//     'Cuthara', 'Chogion', 'Thuizuno', 'Ehines', 'Dotulea', 'Gubeter', 'Ladus 7NZ0', 'Ceron L78 ',
//     'Eccautis', 'Anzoatera', 'Lideshan', 'Pebeshan', 'Cheunus', 'Chaclite', 'Llukater', 'Grinewei',
//     'Gnichi I08R', 'Leshan S4N ', 'Gilaitera', 'Tumunov', 'Ulmorix', 'Zilmides', 'Viapra',
//     'Xoter', 'Maremi', 'Drehunids', 'Phone 982', 'Dragua 993 ', 'Robristea', 'Onzater', 'Mabborix', 'Logrerth',
//     'Kongilia', 'Punaewei', 'Cosion', 'Bigrolla', 'Biabos', 'Xuter', 'Bruagantu', 'Bamutania', 'Bomia IEP5', 'Sides 341 ',
// ];

const vowels = [
    { letter: 'a', prob: .21 },
    { letter: 'e', prob: .23 },
    { letter: 'i', prob: .14 },
    { letter: 'o', prob: .16 },
    { letter: 'u', prob: .14 },
    { letter: 'ae', prob: .02 },
    { letter: 'ei', prob: .02 },
    { letter: 'ou', prob: .02 },
    { letter: 'h', prob: .02 },
    { letter: 's', prob: .02 },
    { letter: 'y', prob: .02 }
];
const consonants = [
    { letter: 'b', prob: .03 },
    { letter: 'c', prob: .05 },
    { letter: 'd', prob: .07 },
    { letter: 'f', prob: .04 },
    { letter: 'g', prob: .04 },
    { letter: 'h', prob: .09 },
    { letter: 'j', prob: .02 },
    { letter: 'k', prob: .02 },
    { letter: 'l', prob: .06 },
    { letter: 'm', prob: .04 },
    { letter: 'n', prob: .10 },
    { letter: 'p', prob: .03 },
    { letter: 'q', prob: .02 },
    { letter: 'r', prob: .09 },
    { letter: 's', prob: .06 },
    { letter: 't', prob: .09 },
    { letter: 'v', prob: .02 },
    { letter: 'w', prob: .05 },
    { letter: 'x', prob: .02 },
    { letter: 'y', prob: .04 },
    { letter: 'z', prob: .02 }
];

function randomLetter(arr) {
    let r = Math.random();
    let i = 0;
    while (arr[i].prob < r) {
        r -= arr[i].prob;
        i++;
        if (i >= arr.length)
            return '' //arr[Math.floor(Math.random() * arr.length)].letter;
    }
    return arr[i].letter;
}

function randomName() {

    let name = '';
    let syll = Math.floor(gauss(.5, 3));
    for (let i = 0; i < syll; i++) {
        if (Math.random() < .66)
            name += randomLetter(consonants);
        if (Math.random() < .1)
            name += randomLetter(consonants);
        name += randomLetter(vowels);
    }
    if (name === '') {
        name += randomLetter(consonants);
        name += randomLetter(vowels);
    }

    if (Math.random() < .01)
        name += " " + randomName();

    return name;

    // return names[Math.floor(Math.random() * names.length)];
}

function createStar(sector, mapX, mapY, d, angle, isBlackHole = false, orbit = false) {

    let nPlanets = isBlackHole ? 0 : gauss(6, 8);
    let planets = [];
    if (Math.random() < .9) {
        for (let i = 0; i < nPlanets; i++) {
            planets.push(createPlanet(sector, mapX, mapY, gauss(.010)));
        }
    }
    return {
        sector: sector,
        x: mapX,
        y: mapY,
        type: isBlackHole ? 'black_hole' : 'star',
        typeName: isBlackHole ? 'Black Hole' : 'Star',
        subtype: Math.floor(Math.random() * subtypes[isBlackHole ? 0 : 1]),
        name: randomName(),
        size: .5 + Math.random(),
        distance: d,
        angle: angle,
        speed: 0,
        orbit: orbit,
        children: planets
    };
}

function createPlanet(sector, parentX, parentY, d) {

    let angle = Math.random() * Math.PI * 2;
    let mapX = parentX + d * Math.cos(angle);
    let mapY = parentY + d * Math.sin(angle);

    let nMoons = Math.random() < .2
        ? Math.random() * 20
        : gauss(2);
    let moons = [];
    for (let i = 0; i < nMoons; i++) {
        moons.push(createMoon(sector, mapX, mapY, gauss(d / 100, d / 500)));
    }
    return {
        sector: sector,
        x: mapX,
        y: mapY,
        type: 'planet',
        typeName: 'Planet',
        subtype: Math.floor(Math.random() * subtypes[2]),
        name: randomName(),
        size: .2 + .8 * Math.random(),
        distance: d,
        angle: angle,
        speed: 0,
        orbit: true,
        children: moons
    };
}

function createMoon(sector, parentX, parentY) {
    let angle = Math.random() * Math.PI * 2;
    let d = gauss(0.0004, 0.0002);
    let mapX = parentX + d * Math.cos(angle);
    let mapY = parentY + d * Math.sin(angle);
    return {
        sector: sector,
        x: mapX,
        y: mapY,
        type: 'moon',
        typeName: 'Moon',
        subtype: Math.floor(Math.random() * subtypes[3]),
        name: randomName(),
        size: .2 + .8 * Math.random(),
        distance: d,
        angle: angle,
        speed: 0,
        orbit: true,
        children: []
    };
}

function calcSector(distanceDivisions, angleDivisions, radius, d, a) {
    if (d < radius / distanceDivisions)
        return 'innerRim';
    if (d > radius)
        return 'outerRim';
    let dDiv = Math.floor(d * distanceDivisions / radius);
    let aDiv = Math.floor(a * angleDivisions / Math.PI / 2);
    return dDiv + ',' + aDiv;//aDiv * angleDivisions + dDiv;
}

function createGalaxy(angleDivisions, distanceDivisions, radius) {

    console.log("creating new galaxy");

    let sizeD = radius / distanceDivisions;
    let sizeA = Math.PI * 2 / angleDivisions;

    let galaxy = {
        name: randomName(),
        radius,
        angleDivisions, distanceDivisions,
        sizeD, sizeA,
        totalBodies: 0
    };

    return galaxy;
}

function createSectors(galaxy, nStars, convergence) {

    let sizeD = galaxy.sizeD;
    let sizeA = galaxy.sizeA;
    let angleDivisions = galaxy.angleDivisions;
    let distanceDivisions = galaxy.distanceDivisions;

    let sectors = [];
    for (let aDiv = 0; aDiv < angleDivisions; aDiv++) {
        for (let dDiv = 1; dDiv <= distanceDivisions; dDiv++) {
            // let sectorId = aDiv * angleDivisions + dDiv;
            let sectorId = `${dDiv},${aDiv}`;
            sectors[sectorId] = {
                id: sectorId,
                center: {
                    x: (sizeD * (dDiv + .5)) * Math.cos(sizeA * (aDiv + .5)),
                    y: (sizeD * (dDiv + .5)) * Math.sin(sizeA * (aDiv + .5))
                },
                bodies: []
            };
        }
    }

    sectors['innerRim'] = {
        id: 0,
        center: { x: 0, y: 0 },
        bodies: []
    };
    sectors['outerRim'] = {
        id: -1,
        center: { x: 0, y: 0 },
        bodies: []
    };

    let deviation = galaxy.radius / convergence;
    let nArms = 4//2 + Math.floor(Math.random() * 3);
    for (let arm = 0; arm < nArms; arm++) {
        for (let i = 0; i < nStars / nArms; i++) {
            galaxy.totalBodies++;
            let isBlackHole = Math.random() < .05;
            let d = gauss(isBlackHole ? deviation / 4 : deviation);
            let angle = Math.random() < .1 ? Math.random() * Math.PI * 2.0 : Math.PI * 2.0 / nArms * arm;
            // let angle = Math.PI * 2.0 / nArms * arm;
            angle += gauss(.3, Math.random() * .15, false);
            angle += d / deviation * nArms;
            angle += gauss() * Math.abs(deviation - d) / deviation;
            while (angle > Math.PI * 2)
                angle -= Math.PI * 2;
            while (angle < 0)
                angle += Math.PI * 2;
            let sectorId = calcSector(galaxy.distanceDivisions, galaxy.angleDivisions, galaxy.radius, d, angle);
            let mapX = d * Math.cos(angle);
            let mapY = d * Math.sin(angle);
            sectors[sectorId].bodies.push(createStar(sectorId, mapX, mapY, d, angle, isBlackHole));
        }
    }

    return sectors;
}

function gauss(n = 1, m = 0, isAlwaysPositive = true) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let ret = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    ret *= n;
    ret += m;
    return isAlwaysPositive ? Math.abs(ret) : ret;
}

var galaxyBuilder = { create: createGalaxy, populate: createSectors };


//  █▀▄ █ █ █▄ █
//  █▀▄ ▀▄█ █ ▀█

// import Connection from './Connection'

// if (process.argv.includes('-upload')) {

//     let galaxy = createGalaxy();
//     // let galaxyJson = JSON.stringify(galaxy);

//     // let Connection = require('./Connection.js');
//     console.log(Connection);

//     Connection.createGalaxy(galaxy).then((response) => console.log(response))

// }

// if (process.argv.includes('-save')) {
//     let fs = require('fs');

//     let galaxy = CreateGalaxy();
//     let galaxyJson = JSON.stringify(galaxy);

//     let filename = `galaxy_${galaxy.name}.json`
//     fs.writeFile(filename, galaxyJson,
//         () => console.log(`Galaxy ${filename} created.`)
//     );
// }

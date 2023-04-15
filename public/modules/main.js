import * as THREE from 'three';
import * as Util from './util.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const gradVert = `varying vec2 vUv;
void main(){
  vUv = uv;
  float depth = 1.; //or maybe 1. you can experiment
  gl_Position = vec4(position.xy, depth, 1.);
}`
const gradFrag = `varying vec2 vUv;
uniform vec3 uColorA;
uniform vec3 uColorB;
void main(){
  gl_FragColor = vec4(
    mix( uColorA, uColorB, vec3(vUv.y)),
    1.
  );
}`

// load

const loader = new GLTFLoader();
const models = {}
async function loadModel(type, path) {
    await loader.load(`assets/${path}.glb`, function (gltf) {
        gltf.scene.traverse(child => {
            if (child.material) child.material.metalness = 0;
        });

        // const clone = gltf.scene.clone()
        // let geoms = []
        // let meshes = []
        // clone.updateMatrixWorld(true, true)
        // clone.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())))
        // geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));
        // let gg = BufferGeometryUtils.mergeGeometries(geoms, true)
        // gg.applyMatrix4(clone.matrix.clone().invert());
        // gg.userData.materials = meshes.map(m => m.material)
        models[type] = gltf.scene;
        // new THREE.Mesh(
        //     geoms,
        //     new THREE.MeshBasicMaterial({ color: 0x0000ff })
        // );;
    }, undefined, function (error) {
        console.error(error);
    });
}

// init
const duration = 600; // in seconds
const PI = Math.PI;
const PI2 = Math.PI / 2;
const sunDistance = 100

const colorsMorn = {
    top: new THREE.Color(0x82CAFF),
    bottom: new THREE.Color(0x131862),
    ambient: new THREE.Color(0xFFFFFF),
    sun: new THREE.Color(0xFFFFFF),
    moon: new THREE.Color(0x000055),
    intensity: .8,
}

const colorsNoon = {
    top: new THREE.Color(0x82CAFF),
    bottom: new THREE.Color(0x131862),
    ambient: new THREE.Color(0xFFFFFF),
    sun: new THREE.Color(0xFFFFFF),
    moon: new THREE.Color(0),
    intensity: 1,
}

const colorsEven = {
    top: new THREE.Color(0xff5500),
    bottom: new THREE.Color(0x131862),
    ambient: new THREE.Color(0xFFFFFF),
    sun: new THREE.Color(0xdf8813),
    moon: new THREE.Color(0x2575c5),
    intensity: 1,
}

const colorsNigh = {
    top: new THREE.Color(0x131862),
    bottom: new THREE.Color(0x000000),
    ambient: new THREE.Color(0xFFFFFF),
    sun: new THREE.Color(0),
    moon: new THREE.Color(0x00c6ff),
    intensity: 1,
}

const lightColors = [
    colorsMorn,
    colorsNoon, colorsNoon, colorsNoon, colorsNoon, colorsNoon, colorsNoon,
    colorsEven, colorsEven, colorsEven, colorsEven,
    colorsNigh, colorsNigh, colorsNigh, colorsNigh, colorsNigh, colorsNigh, colorsNigh, colorsNigh,
    colorsMorn,
];

let camera, scene, renderer, clock;
let center, ambientLight, skybox, sun, sunCube, moon, moonCube;
let colorBackgroundTop, colorBackgroundBottom, colorAmbient;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // sky
    {
        // skybox = new THREE.Mesh(
        //     new THREE.PlaneGeometry(2, 2, 1, 1),
        //     new THREE.ShaderMaterial({
        //         uniforms: {
        //             uColorA: { value: new THREE.Color('#131862') },
        //             uColorB: { value: new THREE.Color('#82CAFF') }
        //         },
        //         vertexShader: gradVert,
        //         fragmentShader: gradFrag
        //     })
        // )
        // skybox.material.depthWrite = false
        // skybox.renderOrder = -99999
        // scene.add(skybox)

        center = new THREE.Object3D();
        scene.add(center);

        ambientLight = new THREE.AmbientLight(0xffffff, .25);
        sun = new THREE.DirectionalLight();
        moon = new THREE.DirectionalLight(0x0000ff, 1);
        sun.target = center;
        moon.target = center;
        sunCube = Util.sphere(5, 0xFFFF00)
        moonCube = Util.sphere(5, 0x445566)
        sunCube.material.transparent = true
        moonCube.material.transparent = true
        scene.add(ambientLight);
        scene.add(sun);
        scene.add(moon);
        scene.add(sunCube);
        scene.add(moonCube);
    }

    colorBackgroundTop = new THREE.Color();
    colorBackgroundBottom = new THREE.Color();
    colorAmbient = new THREE.Color();
    sun.color = new THREE.Color();
    moon.color = new THREE.Color();

    // camera.target.position.x = -10
    console.log(camera)
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(center.position.x, center.position.y, center.position.z);

    new OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function render() {
    requestAnimationFrame(render);

    const time = clock.getElapsedTime();
    renderBackground(time)
    renderHoveredObject()
    renderer.render(scene, camera);
}


function renderBackground(t) {

    //background 

    const f = Math.floor(duration / lightColors.length);
    const i1 = Math.floor((t / f) % lightColors.length);
    let i2 = i1 + 1;

    let time = ((t / f) % lightColors.length) / lightColors.length

    if (i2 === lightColors.length) i2 = 0;

    {
        const color1 = lightColors[i1].top;
        const color2 = lightColors[i2].top;
        const a = (t / f) % lightColors.length % 1;
        colorBackgroundTop.copy(color1);
        colorBackgroundTop.lerp(color2, a);
    }

    {
        const color1 = lightColors[i1].bottom;
        const color2 = lightColors[i2].bottom;
        const a = (t / f) % lightColors.length % 1;
        colorBackgroundBottom.copy(color1);
        colorBackgroundBottom.lerp(color2, a);
    }

    {
        const color1 = lightColors[i1].ambient;
        const color2 = lightColors[i2].ambient;
        const a = (t / f) % lightColors.length % 1;
        colorAmbient.copy(color1);
        colorAmbient.lerp(color2, a);
    }

    {
        const color1 = lightColors[i1].sun;
        const color2 = lightColors[i2].sun;
        const a = (t / f) % lightColors.length % 1;
        sun.color.copy(color1);
        sun.color.lerp(color2, a);
    }

    {
        const color1 = lightColors[i1].moon;
        const color2 = lightColors[i2].moon;
        const a = (t / f) % lightColors.length % 1;
        moon.color.copy(color1);
        moon.color.lerp(color2, a);
    }

    ambientLight.color = colorAmbient
    // skybox.material.uniforms.uColorB.value = colorBackgroundTop
    // skybox.material.uniforms.uColorA.value = colorBackgroundBottom

    // sun and moon

    const angle = time * PI * 2

    sun.position.x = sunDistance * Math.cos(angle);
    sun.position.z = sunDistance * Math.cos(angle);
    sun.position.y = sunDistance * Math.sin(angle);

    moon.position.x = sunDistance * Math.cos(angle + PI);
    moon.position.z = sunDistance * Math.cos(angle + PI);
    moon.position.y = sunDistance * Math.sin(angle + PI);

    const intensity = Math.cos(angle - PI2)
    const sunIntensity = Math.max(0, intensity)
    const moonIntensity = .5 * Math.max(0, 1 - intensity)
    sunCube.material.opacity = Math.sqrt(sunIntensity)
    moonCube.material.opacity = Math.sqrt(moonIntensity)

    sunCube.position.x = sun.position.x
    sunCube.position.y = sun.position.y
    sunCube.position.z = sun.position.z

    moonCube.position.x = moon.position.x
    moonCube.position.y = moon.position.y
    moonCube.position.z = moon.position.z

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const sqrt3 = Math.sqrt(3)
const WSQ3 = 2.0 / sqrt3;
export function addObjectToScene(x, y, type) {
    // console.log({ type, m: models[type] })
    const newObj = models[type].clone(true)

    const size = 0.5 / sqrt3
    // const size = WSQ3 * 2
    newObj.position.x = (y % 2 === 0) ? x + 0.5 : x
    newObj.position.z = y * size * 3
    // newObj.position.z = (y % 2 === 0) ? y - HSQ3 : y
    scene.add(newObj)
    return newObj
}

export function removeObjectFromScene(obj) {
    scene.remove(obj)
}


(async () => {
    init();
    // ["building_cabin",
    //     "building_castle", "building_dock", "building_farm", "building_house", "building_market", "building_mill", "building_mine", "building_sheep", "building_smelter", "building_tower", "building_village", "building_wall", "building_water", "dirt", "dirt_lumber", "grass", "grass_forest", "grass_hill", "path_corner", "path_cornerSharp", "path_crossing", "path_end", "path_intersectionA", "path_intersectionB", "path_intersectionC", "path_intersectionD", "path_intersectionE", "path_intersectionF", "path_intersectionG", "path_intersectionH", "path_start", "path_straight", "river_corner", "river_cornerSharp", "river_crossing",
    //     "river_end", "river_intersectionA", "river_intersectionB", "river_intersectionC", "river_intersectionD", "river_intersectionE", "river_intersectionF", "river_intersectionG", "river_intersectionH", "river_start", "river_straight", "sand", "sand_rocks", "stone", "stone_hill", "stone_mountain", "stone_rocks", "unit_boat", "unit_house", "unit_houseLarge", "unit_mill", "unit_tower", "unit_tree", "unit_wallTower", "water", "water_island",
    //     "water_rocks"
    // ]
    [
        { type: 'forest', path: 'grass_forest' },
        { type: 'hill', path: 'stone_hill' },
        { type: 'house', path: 'building_house' },
        { type: 'tower', path: 'building_tower' },
        { type: 'cabin', path: 'building_cabin' },
    ].forEach(async ({ type, path }) => {
        await loadModel(type, path)
    })
    render();
    connect();
})()

//
// INPUTS
// 

function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function renderHoveredObject() {


    scene.children.forEach(object => {

        object.traverse((obj) => {
            if (!obj.isMesh) return
            if (obj.material.userData.prevCol) {
                obj.material.color.set(obj.material.userData.prevCol);
            } else {
                // obj.material.color.set(0x00ffffff)
            }
        });

        // const mat = child?.material
        // if (mat?.userData.prevCol)
        //     mat.color.set(mat.userData.prevCol)
    });

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {

        const object = intersects[i]?.object
        if (!object) continue

        object.traverse((obj) => {
            if (obj.isMesh) {
                console.log(obj.material.color)
                obj.material.userData.prevCol = { ...obj.material.color }
                obj.material.color.set(0xFFB6C1);
            }
        });


        // const mat = intersects[i]?.object?.material
        // if (mat?.color) {
        //     const prevCol = { ...mat.color }
        //     mat.userData.prevCol = prevCol
        //     mat.color.set(0xffffff);
        //     // setTimeout(() => mat.color.set(prevCol), 1)
        // }
    }
}

window.addEventListener('pointermove', onPointerMove);

window.requestAnimationFrame(render);
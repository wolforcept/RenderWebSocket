import * as THREE from 'three';

export function sphere(radius, color, isLambert = false) {
    const geometry = new THREE.SphereGeometry(radius, radius * 3, radius * 2);
    const material = isLambert
        ? new THREE.MeshLambertMaterial({
            color: color
        }) : new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

// export function lerp(min, max, t) {
//     return (1 - t) * min + t * max
// }

// export function lerpMult(t, vals) {

//     if (t == 1)
//         return vals[vals.length - 1]
//     const l = vals.length
//     for (let i = 0; i < l - 1; i++) {
//         const min = vals[i]
//         const max = vals[i + 1]

//         const d = i/l)
//         const t2 =
//         if (t >= i / l && t < (i + 1) / l)
//             return lerp(min, max, t)
//     }
// }

// const vals = [0, 10, 20, 30]
// console.log(lerpMult(0, vals))
// console.log(lerpMult(1, vals))
// console.log(lerpMult(.5, vals))
// console.log(lerpMult(.25, vals))
// console.log(lerpMult(.75, vals))


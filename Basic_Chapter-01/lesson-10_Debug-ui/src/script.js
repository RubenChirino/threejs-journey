import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'dat.gui';

/**
 * Parameters
**/

const parameters = {
    meshColor: 0xff0000,
    spin: () =>
    {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    },
}

/**
 * Debug
 */
const gui = new dat.GUI();  //const gui = new dat.GUI({ closed: true }) For to close by default the Parameters Panel

//dat.GUI({ width: 400 }) If you want to change the width of the GUI

//If you want that the panel is Hide: gui.hide(); OR press the key: H

//If you want to know more about GUI Parameters, visit the following example: https://jsfiddle.net/ikatyang/182ztwao/, 
//Or documentation API: https://github.com/dataarts/dat.gui/blob/HEAD/API.md

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parameters.meshColor });
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock();

/** 
 Debug Options
**/

//gui.add(mesh.position, 'y', -3, 3, 0.01);  // (Object, Value, minValue, maxValue, Presition)

//OR

gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation');

gui.add(mesh, 'visible');

gui.add(material, 'wireframe');

gui.addColor(parameters, 'meshColor').onChange(() =>
{
    material.color.set(parameters.meshColor);
});

gui.add(parameters, 'spin');

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
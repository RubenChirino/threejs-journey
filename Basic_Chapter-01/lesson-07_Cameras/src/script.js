import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera Type
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);

//--
//const aspectRatio = sizes.width / sizes.height;
//const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);

//camera.position.x = 2
//camera.position.y = 2
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* Objetive, De forma predeterminada, la cámara está mirando al centro de la escena. Podemos cambiar eso con la targetpropiedad.
Esta propiedad es un Vector3 , lo que significa que podemos cambiar sus x, yy zpropiedades.
Si queremos que OrbitControls mire por defecto por encima del cubo, solo tenemos que aumentar la ypropiedad */
//controls.target.y = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = - (event.clientY / sizes.height - 0.5);

    //console.log(cursor.x, cursor.y);
})

// Animate
const clock = new THREE.Clock();

const tick = () =>
{
    // Update objects
    //const elapsedTime = clock.getElapsedTime();
    //mesh.rotation.y = elapsedTime;
 
    // Update camera

    //OPTION 1
    /* camera.position.x = cursor.x * 5;
    camera.position.y = cursor.y * 5;
    camera.lookAt(mesh.position); */

    //OPTION 2 
    /* camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
    camera.position.y = cursor.y * 3;
    camera.lookAt(mesh.position); */

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particlesTexture = textureLoader.load('/textures/particles/2.png');

/**
 * Test cube
 */
/* const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube) */

/**
 * Particles
 */

//Geometry
//const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let index = 0; index < count * 3; index++) {
    positions[index] = (Math.random() - 0.5) * 10;   //0.5 is for centered
    colors[index] = Math.random();
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

//Material

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true, //is for example, if you the particle is far from the camara, the particle is small, but if the particle is closed form the camara the particle will be big (In summary sizeAttenuation create perspective).
});
//particlesMaterial.color = new THREE.Color('#f7e883');  // ff88cc
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particlesTexture;  //map
particlesMaterial.vertexColors = true;

/* OR:
particlesMaterial.size = '...';
particlesMaterial.sizeAttenuation = '...';
*/

/* Lecture
For to remove all the axis and to get 100% of thansparency and realist on the 
Parcticles Textures, we have some ways to get it, the following are any: 
*/

//1- AlphaTest = THREE.PointsMaterial.AlphaTestf (Value between 0 to 1)
//particlesMaterial.alphaTest = 0.001;

//2- Depth Test  (Value true or false) (Webgl draw averything)
//particlesMaterial.depthTest = false;
/*
  While this solution seems to completely fix our problem, deactivating the depth testing might create bugs if you have other objects in your scene or particles with different colors. 
  The particles might be drawn as if they were above the rest of the scene.

  Example: 
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)

*/

/* 3- Depth Write, is the same that Depth Test but there are not bugs respects with
other objects in your scene or particles with different colors (Bolean Value) */
particlesMaterial.depthWrite = false;

/* 4- Blendings */
/* Currently, the WebGL draws the pixels one on top of the other.

By changing the blending property, we can tell the WebGL not only to draw the pixel,
 but also to add the color of that pixel to the color of the pixel already drawn. 
 That will have a saturation effect that can look amazing.

To test that, simply change the blending property to THREE.AdditiveBlending 
(keep the depthWrite property): */
//particlesMaterial.blending = THREE.AdditiveBlending; 

//Points 
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    //Update particles 
    //particles.rotation.y = elapsedTime * 0.30; '- elapsedTime * 0.02' (All paticles)

    for (let index = 0; index < count; index++) {  //count * 3 (one solution)

        const i3 = index * 3;  
        /* paticles.position =
        i3 + 0 = x
        i3 + 1 = y
        i3 + 2 = <
        */
        const x = particlesGeometry.attributes.position.array[i3 + 0];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
        
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
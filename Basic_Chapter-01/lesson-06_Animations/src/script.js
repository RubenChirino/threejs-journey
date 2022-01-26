import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


/**
 * Animate
**/

//let time = Date.now(); //WITH JAVASCRIPT DATE

const clock = new THREE.Clock();

/* NO  GSAP */

/* const tick = () =>
 {

    //JavaScript Time
    //const currentTime = Date.now();
    //const deltaTime = currentTime - time;
    //time = currentTime;    //WITH JAVASCRIPT DATE

    //THEEJS Clock
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    //mesh.rotation.y += 0.001 * deltaTime;  //WITH JAVASCRIPT DATE
    //mesh.rotation.y += 0.01;   //THIS DEPENDING OF FPS COMPUTER SCREEN

    //OPTION 1
    //mesh.rotation.y = elapsedTime  //ThreeJs Clock
    //mesh.rotation.y = elapsedTime * Math.PI * 2; 

    //OPTION 2
    mesh.position.x = Math.cos(elapsedTime);
    mesh.position.y = Math.sin(elapsedTime);

    //ANIMATION IN CAMERA
    camera.lookAt(mesh.position);

    // Render
    renderer.render(scene, camera);
 
     window.requestAnimationFrame(tick);
 } */

 /* With GSAP */

 gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

 const tick = () =>
 {


    // Render
    renderer.render(scene, camera);
 
     window.requestAnimationFrame(tick);
 } 
 
 tick();

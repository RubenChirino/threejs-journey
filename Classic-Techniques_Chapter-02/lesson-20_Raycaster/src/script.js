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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3);

/**
 * Raycaster
**/

const raycaster = new THREE.Raycaster();

let currentIntersect = null;

/* const rayOrigin = new THREE.Vector3(-3, 0 , 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

raycaster.set(rayOrigin, rayDirection);

const intersect = raycaster.intersectObject(object2);
console.log(intersect);

const intersects = raycaster.intersectObjects([object1, object2, object3]);
console.log(intersects); */

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
});

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
 * Mouse (Hoverint Raycast)
**/

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1; // OR: - (event.clientY / sizes.height * 2 - 1)

    //console.log(mouse);
});

window.addEventListener('click', () => {
    if(currentIntersect){
        
        //console.log('Click on a sphere'); 

        switch (currentIntersect.object){
            case object1:
                console.log('Click on the object 1');
            break;
            case object2:
                console.log('Click on the object 2');
            break;
            case object3:
                console.log('Click on the object 3');
            break;    
        }
    }
});

/* Lecture: 
Example de vector2 is only for x and y axys 
and the Vector3 is for x, y, and z axys... And so. */

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    //Animate Objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5; //* 1.5 (More slowly)
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    /**
      * Cast a ray 
    **/

    /* const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(1, 0, 0);
    rayDirection.normalize();
    raycaster.set(rayOrigin, rayDirection); */

    raycaster.setFromCamera(mouse, camera);

    const objectsToTest = [object1, object2, object3];

    const intersets = raycaster.intersectObjects(objectsToTest);
    //console.log('Intersects objects:', intersets.length); //intersets

    //Reset the original color
    objectsToTest.forEach(objectToTest => {
        objectToTest.material.color.set('#ff0000');
    })

    //Change color to the intersects objects
    intersets.forEach(interset => {
        //console.log(interset.object); //Mesh
        interset.object.material.color.set('#0000ff');
    }); 

    if(intersets.length){
        //console.log('Something being hovered');

        if(currentIntersect === null){
            //console.log('mouse enter');
        }

        currentIntersect = intersets[0];
    } else {
        //console.log('Nothing being hovered');
         
        if(currentIntersect){
            //console.log('mouse leave');
        }

        currentIntersect = null;
    }

    /* - */

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
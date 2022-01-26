import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

//Directional LiGHT Shadow Setting/Options 
directionalLight.castShadow = true;

console.log(directionalLight.shadow);

directionalLight.shadow.mapSize.width = 1024;  
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

/* Con el ayudante de cámara que acabamos de agregar, podemos ver que la amplitud de la cámara es demasiado grande.

Debido a que estamos usando un DirectionalLight , Three.js está usando un OrthographicCamera . Si usted recuerda de la 
lección Cámaras, podemos controlar hasta qué punto en cada lado de la cámara se puede ver con los top, right, bottom, y 
leftpropiedades. Reduzcamos esas propiedades: */

// NOTE: Cuanto menores sean los valores, más precisa será la sombra. Pero si es demasiado pequeño, las sombras simplemente se recortarán.
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;  

//Blur (Desenfoque de la sombra)
directionalLight.shadow.radius = 10;

const directionalLightShadowResolution = {  //512 (Default)
	r_1k: () => {
        directionalLight.shadow.mapSize.width = 1024;  
        directionalLight.shadow.mapSize.height = 1024;
    },
    r_2k: () => {
        directionalLight.shadow.mapSize.width = 2048;  
        directionalLight.shadow.mapSize.height = 2048;
    },
    r_4k: () => {
        directionalLight.shadow.mapSize.width = 4096;  
        directionalLight.shadow.mapSize.height = 4096;
    },
};

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

directionalLightCameraHelper.visible = false;

//const directionalLightFolder = gui.addFolder('Directional Light');
//directionalLightFolder.add(directionalLightShadowResolution, 'r_1k');
//---------

scene.add(directionalLight);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);

//Spot Shadows
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

//Shadow Camera
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

spotLightCameraHelper.visible = false;

//Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);

//Shadows
pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);

pointLightCameraHelper.visible = false;

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

//Object Shadow
sphere.castShadow = true;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({        //MeshStandartMaterial for Progamatic shadows and MeshBasicMaterial for Backing Shadows (Shadows on Texrues)
        material
    })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

//Object Shadow
plane.receiveShadow = true;

//Sphere Shadow (Dinamyc Shadow but not too Realistic)
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
);

sphereShadow.rotation.x = - Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, sphereShadow, plane);

//Before:
//scene.add(sphere, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2 
gui.add(camera.position, 'x').min(-5).max(5).step(0.001).name('Camera X');
gui.add(camera.position, 'y').min(-5).max(5).step(0.001).name('Camera Y');
gui.add(camera.position, 'z').min(-5).max(5).step(0.001).name('Camera Z');
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

//Renderer Shadows
renderer.shadowMap.enabled = false;

//gui.add(renderer.shadowMap, 'enabled').name('Scene Shadows');

renderer.shadowMap.type = THREE.PCFSoftShadowMap;   //Shadow Blur not work with the PCFSoftShadowMap algorithm
//-----------

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    // Update the shadow
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
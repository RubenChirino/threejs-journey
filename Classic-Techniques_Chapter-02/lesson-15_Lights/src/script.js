import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Parameters
**/

const parameters = {
    skyColor: 0xff0000,
    groundColor: 0x0000ff,
    pointLightColor: 0xff9000,
    spotLightColor: 0x78ff00,
};

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
//Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Intensity');

//Directional Light  (The position is Default in the top like a sun)
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0); //Move the "sun" to the right
scene.add(directionalLight);
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001);

//Point Light
/* const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight); */

//HemisphereLight  (Work in conjunte with AmbientLight, the AmbientLight position is the same position that the HemisphereLight)
const hemisphereLight = new THREE.HemisphereLight(parameters.skyColor, parameters.groundColor, 0.3); //Parametes: SkyColor, GroundColor and Intensity
scene.add(hemisphereLight);

const hemisphereLightFolder = gui.addFolder('hemisphere Light');
hemisphereLightFolder.addColor(parameters, 'skyColor').onChange(() => {
    hemisphereLight.skyColor.set(parameters.skyColor);
});
hemisphereLightFolder.addColor(parameters, 'groundColor').onChange(() => {
    hemisphereLight.groundColor.set(parameters.groundColor);
});
hemisphereLightFolder.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001);

//PointLight (Like a cigarette lighter)
//De forma predeterminada, la intensidad de la luz no se desvanece. Pero puede controlar esa distancia 
//de desvanecimiento y qué tan rápido se desvanece usando las propiedades distancey decay. Puede establecerlos 
//en los parámetros de la clase como tercer y cuarto parámetro, o en las propiedades de la instancia
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);  //Parameters: Color, Intensity, Distance and Decay
pointLight.position.set(1, - 0.5, 1);  //We can move it like anything object
scene.add(pointLight);

const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.001);
pointLightFolder.addColor(parameters, 'pointLightColor').onChange(() => {
    pointLight.color.set(parameters.pointLightColor);
});

const pointLightPositionFolder = pointLightFolder.addFolder('Position');
pointLightPositionFolder.add(pointLight.position, 'x').min(-2.5).max(2.5).step(0.001);
pointLightPositionFolder.add(pointLight.position, 'y').min(-2.5).max(2.5).step(0.001);
pointLightPositionFolder.add(pointLight.position, 'z').min(-2.5).max(2.5).step(0.001);

//RectAreaLight
//El RectAreaLight funciona como las luces grandes del rectángulo se puede ver en el conjunto de fotos. 
//Es una mezcla entre una luz direccional y una luz difusa. El primer parámetro es el color, el segundo 
//parámetro es el intensity, el tercer parámetro es width del rectángulo y el cuarto parámetro es su height:
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);
const rectAreaLightFolder = gui.addFolder('Rect Area Light');
rectAreaLightFolder.add(rectAreaLight, 'width').min(-7).max(7).step(1);

//SpotLight
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

const spotLightFolder = gui.addFolder('Spot Light');
spotLightFolder.addColor(parameters, 'spotLightColor').onChange(() => {
    spotLight.color.set(parameters.spotLightColor);
});
spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.001);
spotLightFolder.add(spotLight, 'distance').min(1).max(20).step(0.001);
spotLightFolder.add(spotLight, 'angle').min(0).max(1).step(0.001);
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.001);
spotLightFolder.add(spotLight, 'decay').min(0).max(1).step(0.001);

//Girar nuestro SpotLight es un poco más difícil. La instancia tiene una propiedad denominada target, 
//que es un Object3D . El SpotLight siempre está mirando ese targetobjeto. Pero si intenta cambiar su posición, el SpotLight no se moverá:
spotLight.target.position.x = - 0.75;
//Eso se debe a que targetno estamos en la escena. Simplemente agregue el targeta la escena, y debería funcionar:
scene.add(spotLight.target);

/**
 * LIGHT HELPERS
**/

//Parameters: Light, Size

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);  
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

//SpotLight Parameters: (Light)

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() =>
{
    spotLightHelper.update()
});

//RectAreaLight
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
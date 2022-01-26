import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ closed: true });

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

//Door Textures 
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

//Bricks (Walss) Textures
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

//Grass Textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

//options:
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

//Activate Wrap

//S
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

//T
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
//scene.add(sphere)

const house = new THREE.Group();
scene.add(house);

//WALLS
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    }),
);
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));

walls.position.y = 2.5 / 2;  //1.25 ||  BoxGeometry.y / 2

//Obj Shadow
walls.castShadow = true;

house.add(walls);

//ROOF
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45'}),
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
);
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));

floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;

//Obj Shadow
floor.receiveShadow = true;

scene.add(floor);

//DOOR
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture, 
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    }),
);
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));

door.position.y = 1; 
door.position.z = 2 + 0.01;
house.add(door);

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(1, 0.2, 2.3);
bush1.scale.set(0.3, 0.3, 0.3);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(-1, 0.2, 2.3);
bush2.scale.set(0.3, 0.3, 0.3);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(1.6, 0.2, 2.3);
bush3.scale.set(0.5, 0.5, 0.5);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1.6, 0.2, 2.3);
bush4.scale.set(0.5, 0.5, 0.5);

//Obj Shadows
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

house.add(bush1, bush2, bush3, bush4);

// Graves

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {

    //Graves Zone
    const angle = Math.random() * Math.PI * 2; //Ramdom Angle 
    const radius = 3 + Math.random() * 6;  //Random Radius
    const x = Math.cos(angle) * radius;    // Get the x position using cosinus
    const z = Math.sin(angle) * radius;    // Get the z position using sinus

    //Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);

    //Position
    grave.position.set(x, 0.3, z);

    //Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    //Obj Shadow
    grave.castShadow = true;

    //Add to the graves container
    graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);

//GUI
const ambientLightGuiFolder = gui.addFolder('Ambient Light');
ambientLightGuiFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001);

scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);

//GUI
const directionalLightGuiFolder = gui.addFolder('Directional Light');
directionalLightGuiFolder.add(moonLight, 'intensity').min(0).max(1).step(0.001);

const directionalLightPositionFolder = directionalLightGuiFolder.addFolder('Position');
directionalLightPositionFolder.add(moonLight.position, 'x').min(- 5).max(5).step(0.001);
directionalLightPositionFolder.add(moonLight.position, 'y').min(- 5).max(5).step(0.001);
directionalLightPositionFolder.add(moonLight.position, 'z').min(- 5).max(5).step(0.001);

//Light Shadow
moonLight.castShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;

scene.add(moonLight);

//Door Light 
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 3);

//Light Shadow
doorLight.castShadow = true;

/* VALUES TO OPTIMIZE */
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

scene.add(doorLight);

/**
 * Fog
**/
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * GHOSTS 
**/

const ghost1 = new THREE.PointLight('#262837', 2, 3);

//Light Shadow
ghost1.castShadow = true;

/* VALUES TO OPTIMIZE */
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

scene.add(ghost1);

const ghost2 = new THREE.PointLight('#262837', 2, 3);

//Light Shadow
ghost2.castShadow = true;

/* VALUES TO OPTIMIZE */
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

scene.add(ghost2);

const ghost3 = new THREE.PointLight('#262837', 2, 3);

//Light Shadow
ghost3.castShadow = true;

/* VALUES TO OPTIMIZE */
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

scene.add(ghost3);

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837');

//Render Shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  //BETTER SHAWDOW

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = - elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
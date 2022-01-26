import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects (1)
 */

/* const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); */
//mesh.position.set(0.7, - 0.6, 1);

//Vector Length 
//console.log('Vector Length:', mesh.position.length());

//Normalize Position (will reduce the length of the vector to 1 unit but retain its direction)
//console.log('Normalize Position:', mesh.position.normalize());

//Scale
/* mesh.scale.x = 2;
mesh.scale.y = 0.25;
mesh.scale.z = 0.5; */

//Rotation (Euler)
//mesh.rotation.x = Math.PI * 0.25;
//mesh.rotation.y = Math.PI * 0.25; 

/* ¿Es fácil? Sí, pero cuando combina esas rotaciones, puede terminar con resultados extraños. ¿Por qué? Porque, mientras gira el xeje, 
también cambia la orientación de los otros ejes. La rotación se aplica en el siguiente orden: x, y, y luego z. Eso puede resultar en comportamientos 
extraños como un bloqueo de cardán llamado cuando un eje no tiene más efecto, todo debido a los anteriores.
Podemos cambiar este orden usando el reorder(...)método object.rotation.reorder('yxz') */

//Quaternion

/**
 * Objects (2)
 */
 const group = new THREE.Group();
 group.scale.y = 2
 group.rotation.y = 0.2
 scene.add(group); //The Scene only add the Group
 
 const cube1 = new THREE.Mesh(
     new THREE.BoxGeometry(1, 1, 1),
     new THREE.MeshBasicMaterial({ color: 0xff0000 })
 );
 cube1.position.x = - 1.5;
 group.add(cube1);   //The Group add the Objects
 
 const cube2 = new THREE.Mesh(
     new THREE.BoxGeometry(1, 1, 1),
     new THREE.MeshBasicMaterial({ color: 0x00ff00 })
 );
 cube2.position.x = 0;
 group.add(cube2);   //The Group add the Objects
 
 const cube3 = new THREE.Mesh(
     new THREE.BoxGeometry(1, 1, 1),
     new THREE.MeshBasicMaterial({ color: 0x0000ff })
 );
 cube3.position.x = 1.5;
 group.add(cube3);   //The Group add the Objects

/**
 * Axes Helper
 */
 const axesHelper = new THREE.AxesHelper(2);
 scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

//Get Distance of anothe Vector3 
//console.log('Distance of anothe Vector3:', mesh.position.distanceTo(camera.position))

//LookAt
//camera.lookAt(new THREE.Vector3(0, -1, 0));

/* También podemos usar cualquier Vector3 existente como el mesh's position, pero eso dará como resultado la posición predeterminada 
de la cámara porque nuestro meshestá en el centro del scene. */

//Object (1)
//camera.lookAt(mesh.position);

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera)
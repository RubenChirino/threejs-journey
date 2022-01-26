import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Color } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 360 });

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
**/
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;

parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let pointsGeometry = null;
let pointsMaterial = null;
let points = null;

const generateGalaxy = () => {

    /*
    * Destroy old Galaxy
    **/
    if(points !== null){
        pointsGeometry.dispose(); /* Always is important remove all the memory data */
        pointsMaterial.dispose();    
        scene.remove(points);
    }

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    /* 
    Inside the loop function, we want to mix these colors into a third color. That mix depends on the distance from the center of the galaxy. If the particle is at the center of the galaxy, it'll have the insideColor and the further it gets from the center, the more it will get mixed with the outsideColor.

    Instead of creating a third Color, we are going to clone the colorInside and then use the lerp(...) method to interpolate the color from that base color to another one. The first parameter of lerp(...) is the other color, and the second parameter is a value between 0 and 1. If it's 0, the color will keep its base value, and if it's 1 the result color will be the one provided. We can use the radius divided by the radius parameter */

    console.log(colorInside);

    /**
  * pointsGeometry
    **/
    pointsGeometry = new THREE.BufferGeometry();

    /**
     * Material
    **/
    pointsMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,  //Look better
        vertexColors: true,
        //color: '#ff5588'
    });

    for(let i = 0; i < parameters.count; i++){

        const i3 = i * 3;

        //Positions
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchesAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
    
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;

        /* (Math.random() - 0.5) is for to convert for example -0.5 to 0.5, so
        the random negative values to positive  */

        /* if(i < 20){
            console.log(i, branchesAngle);
        } */

        positions[i3 + 0] = Math.cos(branchesAngle + spinAngle) * radius + randomX;  //x  radius
        positions[i3 + 1] = randomY;  //y
        positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;  //z
    
        //Colors
    
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);  //radius / parameters.radius | 0

        colors[i3 + 0] = mixedColor.r;   //R
        colors[i3 + 1] = mixedColor.g;   //G
        colors[i3 + 2] = mixedColor.b;   //B
    
    }
    //console.log(positions);

    pointsGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    pointsGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    /**
    * Points
    **/
    points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
};


generateGalaxy();

//CHANGE PARAMETERS
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.01).max(0.1).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);

//Colors
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

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
camera.position.x = 3
camera.position.y = 3
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
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
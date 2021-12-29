const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(24, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const colorYellow = new THREE.Color('hsl(40, 100%, 60%)');
const colorPink = new THREE.Color('hsl(306, 100%, 60%)');
const colorLight = new THREE.Color('hsl(40, 100%, 95%)');

const cubeGeometry = new THREE.BoxGeometry(1,1.5,0.9);
const cubeMaterial = new THREE.MeshPhongMaterial({
    color: colorYellow,
    shininess: 80,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const light = new THREE.PointLight(colorLight, 2);
const lightTwo = new THREE.PointLight(colorLight, .5);

light.position.set(20, -20, -40);
lightTwo.position.set(10, 20, 40);

scene.add(light);
scene.add(lightTwo);
scene.add(cube);

camera.position.z = 25;
cube.rotation.x = 20;
cube.rotation.z = -20;

const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
}

animate();
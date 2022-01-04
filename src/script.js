const scene = new THREE.Scene();

var colorsField = ["#FAF0E6","#CD7F32"]
var colorsPawn = ["#FFDEAD","#000000"]

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

const aspectRatio = window.innerWidth / window.innerHeight;
var cameraWidth = 1900;
var cameraHeight = cameraWidth / aspectRatio;

const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
var draggable = new THREE.Object3D;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2,
    cameraWidth / 2,
    cameraHeight / 2,
    cameraHeight / -2,
    0,
    1000
);

var plane = Plane();
scene.add(plane);

var table = Table();
table.position.z = -55;
scene.add(table);

camera.position.set(0, -210, 300);

var look1 = 0;
var look2 = 0;
var look3 = 0;
camera.lookAt(look1, look2, look3);

window.addEventListener('click', event => {
    if (draggable != null) {
      console.log(`dropping draggable ${draggable.userData.name}`)
      draggable = null
      return;
    }

    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    const found = intersect(clickMouse);
    if (found.length > 0) {
      if (found[0].object.userData.draggable) {
        draggable = found[0].object
        console.log(`found draggable ${draggable.userData.name}`)
      }
    }
  });
  
  window.addEventListener('mousemove', event => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  });

  function dragObject() {
    if (draggable != null) {
      const found = intersect(moveMouse);
      if (found.length > 0) {
        for (let o of found){
            draggable.position.y = o.point.y;
            draggable.position.x = o.point.x;

            if (!o.object.userData.ground){
                continue
            }
        }
      }
    }
  }

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.getElementById("game").appendChild(renderer.domElement)

function Plane(){

    var plane = new THREE.Group();

    for (var color = 0; color < 2; color ++){
        for (var y=360; y>-360; y-=90){
            for (var i=0; i<4; i++){
                var f = Field(color);
                if (y/90 == 4 || y/90 == 2 || y/90 == 0 || y/90 == -2){
                    if (color == 0){
                        f.position.x = -360 + (90 * i *2);
                    }
                    else {
                        f.position.x = -270 + (90 * i *2);
                    }
                }
                else {
                    if (color == 0){
                        f.position.x = -270 + (90 * i *2);
                    }
                    else {
                        f.position.x = -360 + (90 * i *2);
                    }
                }
                f.position.y = y;     
                plane.add(f);
            }
        }
    }

    for (var y=360; y>0; y-=90){
        if (y >= 180 || y <=-90){
            for (var i=0; i<4; i++){
                var p = Pawn(0);
                if (y/90 == 4 || y/90 == 2 || y/90 == 0 || y/90 == -2){
                    if (color == 0){
                        p.position.x = -360 + (90 * i *2);
                    }
                    else {
                        p.position.x = -270 + (90 * i *2);
                    }
                }
                else {
                    if (color == 0){
                        p.position.x = -270 + (90 * i *2);
                    }
                    else {
                        p.position.x = -360 + (90 * i *2);
                    }
                }
                p.position.y = y;
                p.rotation.x = 11;
                p.userData.currentSquare = i;       
                plane.add(p);
            }
        }
    }

    for (var y=0; y>-360; y-=90){
        if (y >= 180 || y <=-90){
            for (var i=0; i<4; i++){
                var p = Pawn(1);
                if (y/90 == 4 || y/90 == 2 || y/90 == 0 || y/90 == -2){
                    if (color == 0){
                        p.position.x = -360 + (90 * i *2);
                    }
                    else {
                        p.position.x = -270 + (90 * i *2);
                    }
                }
                else {
                    if (color == 0){
                        p.position.x = -270 + (90 * i *2);
                    }
                    else {
                        p.position.x = -360 + (90 * i *2);
                    }
                }
                p.position.y = y;
                p.rotation.x = 11;
                p.userData.currentSquare = i;        
                plane.add(p);
            }
        }
    }

    return plane;
}

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}

function Field(number){
    const field = new THREE.PlaneGeometry(90, 90);

    const fieldMesh = new THREE.Mesh(
        field,
        new THREE.MeshLambertMaterial({color: colorsField[number]})
    );

    fieldMesh.userData.name = 'Field';
    fieldMesh.userData.draggable = false;

    return fieldMesh;
}

function Pawn(number){
    const geometry = new THREE.CylinderGeometry(40, 40, 75, 200);

    const pawnMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({color: colorsPawn[number]})
    );

    pawnMesh.userData.name = 'Pawn';
    pawnMesh.userData.draggable = true;

    return pawnMesh;
}

function Table(){
    const geometry = new THREE.BoxGeometry(1200, 1200, 100);

    const tableMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({color: "#5C4033"})
    );

    return tableMesh;
}

function Reset(){
    window.location.reload();
};

window.addEventListener("keydown", function(event) {

    if (event.key == "ArrowUp"){
        look2 += 10;
        camera.lookAt(look1, look2, look3);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "ArrowDown"){
        look2 -= 10;
        camera.lookAt(look1, look2, look3);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "ArrowRight"){
        scene.rotation.z += 0.1;
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "ArrowLeft"){
        scene.rotation.z -= 0.1;
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "w"){
        look3 += 10;
        camera.lookAt(look1, look2, look3);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "s"){
        look3 -= 10;
        camera.lookAt(look1, look2, look3);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "d"){
        scene.remove(draggable.object);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "+"){
        cameraHeight += 100;
        cameraWidth += 100;
        const camera = new THREE.OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            0,
            1000
        );
        camera.position.set(0, -210, 300);
        camera.lookAt(look1, look2, look3);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "-"){
        cameraHeight -= 100;
        cameraWidth -= 100;
        const camera = new THREE.OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            0,
            1000
        );
        camera.position.set(0, -210, 300);
        camera.lookAt(look1, look2, look3);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "R" || event.key == "r"){
        Reset();
        return;
    }
});

const animate = () => {
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

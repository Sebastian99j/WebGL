const scene = new THREE.Scene();

var colorsField = ["#FAF0E6","#CD7F32"];
var colorsPawn = ["#FFDEAD","#000000", "#FF0000", "#FFD700"];

var pawns = new Array();
var found;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

loader = new THREE.TextureLoader()

const aspectRatio = window.innerWidth / window.innerHeight;
var cameraWidth = 1900;
var cameraHeight = cameraWidth / aspectRatio;

const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
var draggable = new THREE.Object3D;

var camera = new THREE.OrthographicCamera(
    cameraWidth / -2,
    cameraWidth / 2,
    cameraHeight / 2,
    cameraHeight / -2,
    0,
    1000
);

const geometry = new THREE.TorusGeometry( 100, 30, 160, 1000 );
const material = new THREE.MeshPhongMaterial( { color: "#00BFFF" } );
const torus = new THREE.Mesh( geometry, material );
torus.position.y = 50;
torus.position.x = 450;
scene.add( torus );

const geometrySphaere = new THREE.SphereGeometry( 100, 270, 110 );
const materialSphaere = new THREE.MeshPhongMaterial( { map:loader.load('./textures/earth.jpg') } );
materialSphaere.color.convertSRGBToLinear();
const sphereStatue = new THREE.Mesh( geometrySphaere, materialSphaere );
sphereStatue.position.y = 50;
sphereStatue.position.z = 100;
sphereStatue.position.x = 450;
scene.add( sphereStatue );

var plane = Plane();
scene.add(plane);

var table = Table();
table.position.z = -55;
scene.add(table);

camera.position.set(0, -100, 300);

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
  
    found = intersect(clickMouse);
    if (found.length > 0) {
      if (found[0].object.userData.draggable) {
        draggable = found[0].object
        console.log("pawn "+ found[0].object.number)
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
renderer.setClearColor("#87CEFA");
renderer.render(scene, camera);

document.getElementById("game").appendChild(renderer.domElement)

function Table(){

    const geometry = new THREE.BoxGeometry(1200, 1200, 100);

    const cubeMaterial = new THREE.MeshStandardMaterial({
        map:loader.load('./textures/wood.jpg')
    });
    cubeMaterial.color.convertSRGBToLinear();

    const cubeMesh = new THREE.Mesh( geometry, cubeMaterial );
    
    return cubeMesh;
}

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
                p.number = `${y}${i}`;
                pawns.push(p);         
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
                p.number = `${y}${i}`;
                pawns.push(p);     
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

    if (event.key == "-"){
        cameraHeight += 100;
        cameraWidth += 100;
        camera = new THREE.OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            0,
            1000
        );
        camera.position.set(0, -210, 300);
        camera.lookAt(look1, look2, look3);
        scene.add(camera);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "+"){
         cameraHeight -= 100;
         cameraWidth -= 100;
        camera = new THREE.OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            0,
            1000
        );
        camera.position.set(0, -210, 300);
        camera.lookAt(look1, look2, look3);
        scene.add(camera);
        renderer.render(scene, camera);
        return;
    }

    if (event.key == "R" || event.key == "r"){
        Reset();
        return;
    }

    if (event.key == "K" || event.key == "k"){
       var newPawns = [];

       pawns.forEach (function (pawn) {
            if (pawn.number == found[0].object.number){

                var newPawn = Pawn(0);
                var color = new THREE.Color(colorsPawn[0]);

                if (pawn.material.color.equals(color)){
                    console.log("bialy");
                    newPawn = Pawn(2);
                }
                else {
                    console.log(pawn.material.color);
                    newPawn = Pawn(3);
                }

                newPawn.rotation.x = 11;

                newPawn.position.x = pawn.position.x;
                newPawn.position.y = pawn.position.y;
                newPawn.position.z = pawn.position.z;

                scene.clear();
                newPawns.push(newPawn);
            }
            else {
                newPawns.push(pawn);
            }
          })

          newPawns.forEach (function(pawn){
            scene.add(pawn);
        })

        pawns = newPawns;

        scene.add(camera);
        scene.add(plane);
        scene.add(table);
        scene.add(ambientLight);
        scene.add(directionalLight);
        scene.add(torus);
        scene.add(sphereStatue);

        renderer.render(scene, camera);

        return;
    }
});

const animate = () => {
    sphereStatue.rotation.x += 0.01;
    sphereStatue.rotation.y += 0.01;
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

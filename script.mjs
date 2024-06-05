import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from  'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/RGBELoader.js';

var container;
var camera, scene, renderer, controls;

var e1, e2, e3, e4, e5, e6;

var selectedObject;

var clock = new THREE.Clock();

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  const fov = 30;
  const aspect = (window.innerWidth) / (window.innerHeight);
  const near = 0.1;
  const far = 1500;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.maxZoom = 800;
  camera.position.set(0, 28, -80);

  scene = new THREE.Scene();
  var hdri = new URL('pines.hdr', import.meta.url);
        
  const rgbeloader = new RGBELoader();
  rgbeloader.load(hdri, function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });

    //this._scene.background = new THREE.Color(0x000033);
    let hemisphere = new THREE.HemisphereLight(0xffffff, 0x999999, 1.5);
    scene.add(hemisphere);
    
    let light = new THREE.SpotLight(0xeeeeee, 1.5);
    light.position.set(150, 100, 50);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    scene.add(light);

    let light1 = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(light1);

  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load( 'sbd/dust_ft.jpg');
  let texture_bk = new THREE.TextureLoader().load( 'sbd/dust_bk.jpg');
  let texture_up = new THREE.TextureLoader().load( 'sbd/dust_up.jpg');
  let texture_dn = new THREE.TextureLoader().load( 'sbd/dust_dn.jpg');
  let texture_rt = new THREE.TextureLoader().load( 'sbd/dust_rt.jpg');
  let texture_lf = new THREE.TextureLoader().load( 'sbd/dust_lf.jpg');
    
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

  for (let i = 0; i < 6; i++)
     materialArray[i].side = THREE.BackSide;

  let skyboxGeo = new THREE.BoxGeometry( 1200, 1200, 1200);
  let skybox = new THREE.Mesh( skyboxGeo, materialArray );
  skybox.castShadow = false;
  skybox.receiveShadow = true;
  scene.add( skybox );

  // scene.add( new CameraHelper( light.shadow.camera ) );
  let grassTex = new THREE.TextureLoader().load( "grass.png" );
  grassTex.wrapS = THREE.RepeatWrapping; 
  grassTex.wrapT = THREE.RepeatWrapping;

  grassTex.repeat.set( 600, 600 );

  var grassMat = new THREE.MeshBasicMaterial({ map : grassTex });
  var geometry = new THREE.BoxGeometry(10000, 1, 10000);
  var plane = new THREE.Mesh(geometry, grassMat);
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.position.y = -1;
  scene.add( plane );

  var cubeGeo = new THREE.BoxGeometry(2, 2, 2);
  var cube = new THREE.Mesh(cubeGeo, grassMat);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(0,0,0);
  scene.add( cube );
  
  var gltfLoader = new GLTFLoader();
  gltfLoader.setPath('/');
  gltfLoader.load('structure.glb', function(gltf){
    gltf.scene.traverse( function ( object ) {
        if ( object.isMesh ) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    } );
    scene.add(gltf.scene);
  });

  renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 2.3
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize((window.innerWidth), window.innerHeight);
  renderer.setClearColor( 0x000000, 0 );
  container.appendChild( renderer.domElement );

  controls = new OrbitControls(
      camera, renderer.domElement);
  controls.target.set(0, 5, 0);
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.maxDistance = 300;
  controls.update();

  window.addEventListener( 'resize', onWindowResize, false );

  window.b1=()=>{
    e1 = true;
  }
  window.b2=()=>{
    e2 = true;
  }
  window.b3=()=>{
    e3 = true;
  }
  window.b4=()=>{
    e4 = true;
  }
  window.b5=()=>{
    e5 = true;
  }
  window.b6=()=>{
    e6 = true;
  }

}

function onWindowResize() {
  camera.aspect = (window.innerWidth) / (window.innerHeight);
  camera.updateProjectionMatrix();
  renderer.setSize((window.innerWidth), window.innerHeight);
}

//

function animate() {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  if(e1 == true){
    controls.target.set(8.66, 3.7, -5);
    camera.position.set(5.2, 3.7, -3);
    e1 = false;
  }
  if(e2 == true){
    controls.target.set(8.66, 3.7, 5);
    camera.position.set(5.2, 3.7, 3);
    e2 = false;
  }
  if(e3 == true){
    controls.target.set(0, 3.7, 10);
    camera.position.set(0, 3.7, 6);
    e3 = false;
  }
  if(e4 == true){
    controls.target.set(-8.66, 3.7, 5);
    camera.position.set(-5.2, 3.7, 3);
    e4 = false;
  }
  if(e5 == true){
    controls.target.set(-8.66, 3.7, -5);
    camera.position.set(-5.2, 3.7, -3);
    e5 = false;
  }
  if(e6 == true){
    camera.rotation.y = 0;
    camera.position.set(0, 28, -80);
    controls.target.set(0, 5, 0);
    e1=e2=e3=e4=e5=e6=false;
  }
  renderer.render( scene, camera );
}
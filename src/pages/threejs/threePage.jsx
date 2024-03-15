import React, {useRef, useEffect} from "react";
import * as THREE from 'three';
import './threePage.scss'
// import dalishi from '@/img/dalishi.webp'
// import zhmian from '@/img/zhmian.png'
// import dibu from '@/img/dibu.png'
// import dinbu from '@/img/dinbu.png'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from 'three/addons/controls/DragControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';


// 初始化纹理加载器
const textloader = new THREE.TextureLoader();
// 场景
const scene = new THREE.Scene();
// 透视摄像机
const camera = new THREE.PerspectiveCamera(75,  window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(20, 20, 20);
// 渲染器
const renderer = new THREE.WebGLRenderer();
// canvas宽高
renderer.setSize( 1000, 1000 * window.innerHeight  / window.innerWidth );
// 开启阴影计算
renderer.shadowMap.enabled = true;
// 立方体对象
const geometry = new THREE.BoxGeometry(3,3,3);
// 材质 x正方向轴的面，x负方向轴的面，y正方向轴的面，y负方向轴的面，z正方向轴的面，z负方向轴的面.
const material = [
    // new THREE.MeshStandardMaterial({ map: textloader.load(zhmian)}),/
    // new THREE.MeshStandardMaterial({ map: textloader.load(zhmian)}),
    // new THREE.MeshStandardMaterial({ map: textloader.load(dinbu)}),/
    // new THREE.MeshStandardMaterial({ map: textloader.load(dibu)}),
    // new THREE.MeshStandardMaterial({ map: textloader.load(zhmian)}),
    // new THREE.MeshStandardMaterial({ map: textloader.load(zhmian)}),
]
// 网格
const cube = new THREE.Mesh( geometry, material );
// 将网格添加进场景
scene.add( cube );  
// 摄像机位置
camera.position.z = 5;

// 几何体
// const points = [];
// points.push( new THREE.Vector3( -100, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 100, 0 ) );
// points.push( new THREE.Vector3( 100, 0, 0 ) );
// const geometry1 = new THREE.BufferGeometry().setFromPoints( points );

// 线的材质
const materialLine = new THREE.LineBasicMaterial( { 
    color: 0x000000,
    linewidth: 10,
	linecap: 'butt', //ignored by WebGLRenderer
	linejoin:  'round' //ignored by WebGLRenderer 
} );
const line = new THREE.Line( geometry, materialLine );
// scene.add(line)

// 添加光源
const light = new THREE.AmbientLight( 0x404040 ); // 柔和的白光
scene.add( light );
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 添加正方体底部的平面
const planeGeometry = new THREE.PlaneGeometry(100, 100);
// 地面添加纹理

// 2. 给地板加载纹理
const planeMaterial = new THREE.MeshStandardMaterial({
//   map: textloader.load(dalishi),
});
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.position.set(0, -3, 0);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// 阴影
// 1. 渲染器能够渲染阴影效果
renderer.shadowMap.enabled = true;
// 2. 该方向会投射阴影效果
directionalLight.castShadow = true;
// 3. 
cube.castShadow = true;

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
);
scene.add(directionalLightHelper); // 辅助线
// 线性雾
// scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );


// 多面体
const verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
];

const indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];

const geometry2 = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 3, 3 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const line1 = new THREE.Line( geometry2, materialLine );
const mesh = new THREE.Mesh( geometry2, material2 )
mesh.position.set(5,0,10)
mesh.castShadow = true
line1.position.set(5,0,10)
scene.add(mesh)
scene.add(line1)

// 轨道控制器 可以使得相机围绕目标进行轨道运动
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true
controls.update();

document.addEventListener('wheel', function(event) {  
    if (event.deltaMode === 4) {  
      console.log('鼠标中键被滚动');  
    }  
});

// 拖放交互
const controls1 = new DragControls( [cube, mesh, line1], camera, renderer.domElement );
controls1.addEventListener( 'dragstart', function ( event ) {
    console.log('event', event);
    controls.enabled = false
} );

controls1.addEventListener( 'dragend', function ( event ) {
    console.log('event', event);
    controls.enabled = true

} );

// 第一人称控制器
const firstPersonControls = new FirstPersonControls(camera, renderer.domElement)

// 渲染场景 
function animate() {
    // 动画循环
	requestAnimationFrame( animate );
    // 摄像机旋转
    // controls.update();
    // 第一人称控制器
    // firstPersonControls.update(0.01)

    // 旋转
    // cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // line.rotation.x += 0.01;
    line.rotation.y += 0.01;
    // 光源旋转
    // directionalLight.rotation.y += 0.01
    // directionalLight.rotation.x += 0.01
    // 最终渲染
	renderer.render( scene, camera );
}
animate();



// 在react中将canvas渲染
const ThreePage = () => {
    const boxRef = useRef()
    useEffect(()=>{
        boxRef.current && boxRef.current.appendChild(renderer.domElement)
    }, [])
    return <>
        <div ref={boxRef}></div>
    </>
}

export default ThreePage
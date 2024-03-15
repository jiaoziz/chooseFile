import React, {useRef, useEffect} from "react";
import * as THREE from 'three';
import './threePageExercise.scss'
// import dalishi from '@/img/dalishi.webp'
// import yhe from '@/img/yhe.webp'
// import zhmian from '@/img/zhmian.png'
// import dibu from '@/img/dibu.png'
// import dinbu from '@/img/dinbu.png'

import { TransformControls } from 'three/addons/controls/TransformControls.js'; // 引入模块
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from 'three/addons/controls/DragControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


// 初始化纹理加载器
const textloader = new THREE.TextureLoader();
// const texture = new THREE.TextureLoader().load(yhe);
// 场景
const scene = new THREE.Scene();
// scene.background = texture
// 透视摄像机
const camera = new THREE.PerspectiveCamera(75,  window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(20, 20, 20);
// 渲染器
const renderer = new THREE.WebGLRenderer();
// canvas宽高
renderer.setSize( 1000, 1000 * window.innerHeight  / window.innerWidth );
// 开启阴影计算
renderer.shadowMap.enabled = true;

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
planeMesh.position.set(0, -35, 0);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// 轨道控制器 可以使得相机围绕目标进行轨道运动
const controls = new OrbitControls(camera, renderer.domElement);
controls.keyPanSpeed = 7
controls.enabled = true
controls.enableDamping = true
controls.update();

const pointerLockControls = new PointerLockControls( camera, document.body );
pointerLockControls.lock()

// 添加光源
// const light = new THREE.AmbientLight( 0x404040 ); // 柔和的白光
// scene.add( light );
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0,100,0);
scene.add(directionalLight);

// 阴影
// 1. 渲染器能够渲染阴影效果
renderer.shadowMap.enabled = true;
// 2. 该方向会投射阴影效果
directionalLight.castShadow = true;
const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
);

scene.add(directionalLightHelper); // 辅助线
// 运动

// 运动的物体
const box = new THREE.BoxGeometry(1, 1, 1 )
const directionalBox = new THREE.MeshBasicMaterial({color: 0x76b3e5})
const mesh = new THREE.Mesh(box, directionalBox)
mesh.castShadow = true
directionalLight.target = mesh
scene.add(mesh)


// 1, 创建关键空间点数组
const initialPoints = [
    { x: 10, y: 20, z: -10 },
    { x: 10, y: 10, z: 10 },
    { x: -10, y: 10, z: 10 },
    { x: -20, y: -10, z: -30 },
    { x: 30, y: -10, z: -10 },
    { x: 50, y: 20, z: -10 },
];

const addCube = (pos) => {
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({color:0xffffff});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(pos);
    console.log(cube);
    scene.add(cube)
    return cube
}

const cubeList = initialPoints.map(pos => {
    return addCube(pos);
});

// 2、根据点数组绘制曲线
const curve = new THREE.CatmullRomCurve3(
    cubeList.map((cube) => cube.position) // 直接绑定方块的position以便后续用方块调整曲线
);
curve.curveType = 'chordal'; // 曲线类型
curve.closed = true; // 曲线是否闭合

const points = curve.getPoints(50); // 50等分获取曲线点数组
const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
); // 绘制实体线条，仅用于示意曲线，后面的向量线条同理，相关代码就省略了

scene.add(line);

// 3、获取曲线上特定位置的点，修改物体位置
function changePosition (t) {
    const position = curve.getPointAt(t); // t: 当前点在线条上的位置百分比，后面计算
    mesh.position.copy(position);
    return position
}

// 4、获取曲线上特定位置的切线，修改物体朝向
function changeLookAt (t) {
    const doitInLinePosition = changePosition(t)
    const tangent = curve.getTangentAt(t);
    const position = {
        x: doitInLinePosition.x + tangent.x,
        y: doitInLinePosition.y + tangent.y,
        z: doitInLinePosition.z + tangent.z
    }
    // camera.position.set(position);
    const lookAtVec = tangent.add(position); // 位置向量和切线向量相加即为所需朝向的点向量
    mesh.lookAt(lookAtVec);
}

// const sphere = new THREE.SphereGeometry();
// const object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0xff0000 ) );
// 碰撞箱
const box1 = new THREE.BoxHelper( mesh, 0xffff00 );
scene.add( box1 );
const boxArrUpdataFun = cubeList.map((cube) => {
   const box = new THREE.BoxHelper( cube, 0xffff00 )
   scene.add(box)
   return box
})

console.log('scene', scene);
// const light1 = new THREE.AmbientLight( 0x404040 ); // 柔和的白光
// scene.add( light1 );


// 拖放交互
const controls1 = new DragControls( cubeList.map(i=>i), camera, renderer.domElement );
controls1.addEventListener( 'dragstart', function ( event ) {
    console.log('event', event);
    controls.enabled = false
} );
controls1.addEventListener( 'dragend', function ( event ) {
    console.log('event', event);
    controls.enabled = true
    if (!event.value) {
        const points = curve.getPoints(50);
        line.geometry.setFromPoints(points);
    }
} );

const loopTime = 10 * 1000; // loopTime: 循环一圈的时间
// 渲染场景 
function animate() {
    // 动画循环
	requestAnimationFrame( animate );

    let time = Date.now();
    let t = (time % loopTime) / loopTime; // 计算当前时间进度百分比
    
    changeLookAt(t);
    box1.update()
    boxArrUpdataFun.forEach(item => item.update())
    // 最终渲染
	renderer.render( scene, camera );
}
animate();


// 在react中将canvas渲染
const ThreePageExercise = () => {
    const boxRef = useRef()
    useEffect(()=>{
        boxRef.current && boxRef.current.appendChild(renderer.domElement)
    }, [])
    return <>
        <div ref={boxRef}></div>
    </>
}

export default ThreePageExercise
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const redSphere = new THREE.Mesh(
new THREE.SphereGeometry(0.5, 32, 32),
new THREE.MeshPhongMaterial({ color: 0xff0000 })
);

// 立方体のジオメトリとマテリアルの作成
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

// 立方体のメッシュを作成し、7行目8列目の地点に配置
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(7, 0.5, 8);
scene.add(cube);

// Raycasterの作成
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// マウスイベントのリスナーを追加
renderer.domElement.addEventListener("click", (event) => {
  event.preventDefault();

  // マウス座標の正規化
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycasterの更新
  raycaster.setFromCamera(mouse, camera);

  // オブジェクトとの交差判定
  const intersects = raycaster.intersectObjects([redSphere]);
  const intersects2 = raycaster.intersectObjects([cube]);

  // 交差している場合
  // if (intersects.length > 0) {
  //   alert("球");
  // }
  // if (intersects2.length > 0) {
  //   alert("立方体");
  // }
});

// テクスチャの読み込み
const textureLoader = new THREE.TextureLoader();
const marbleTexture = textureLoader.load("textures/marble.jpg");

// 床の作成
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshPhongMaterial({ map: marbleTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

// 床の配置と回転
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.01;
scene.add(floor);

// ライティングの追加
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
redSphere.position.set(3, 0.5, 4);
scene.add(redSphere);

camera.position.z = 10;
camera.position.y = 1.5;
camera.rotation.order = "YXZ";

let xPos = 10;
let yPos = 10;

const moveForward = () => {
  camera.position.x += Math.sin(camera.rotation.y);
  camera.position.z += Math.cos(camera.rotation.y);
  xPos += Math.round(Math.sin(camera.rotation.y));
  yPos += Math.round(Math.cos(camera.rotation.y));
};

const moveBackward = () => {
    camera.position.x -= Math.sin(camera.rotation.y);
  camera.position.z -= Math.cos(camera.rotation.y);
  xPos -= Math.round(Math.sin(camera.rotation.y));
  yPos -= Math.round(Math.cos(camera.rotation.y));
};

const turnLeft = () => {
  camera.rotation.y += Math.PI / 2;
};

const turnRight = () => {
  camera.rotation.y -= Math.PI / 2;
};


const animate = () => {
  requestAnimationFrame(animate);

  // 立方体の回転
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
    moveBackward();
      
      break;
    case "ArrowDown":
    moveForward();
      break;
    case "ArrowLeft":
      turnLeft();
      break;
    case "ArrowRight":
      turnRight();
      break;
  }
});

// テクスチャローダーの作成
const textureLoader2 = new THREE.TextureLoader();

// デプスマップ画像と元の画像をテクスチャとして読み込む
const depthTexture = textureLoader2.load("textures/depthmap.png");
const originalTexture = textureLoader2.load("textures/original_image.png");

// PlaneGeometry のサイズとセグメント数を設定
const width = 10;
const height = 10;
const widthSegments = 128;
const heightSegments = 128;

// PlaneGeometry を作成
const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);

// デプスマップ画像を使用して頂点の高さを調整
geometry.vertices.forEach((vertex, i) => {
  // デプスマップの値を取得 (0.0 - 1.0 の範囲)
  const depthValue = depthTexture.image.data[i * 4] / 255;

  // 頂点の高さをデプスマップの値に基づいて調整
  vertex.z = depthValue * 1; // 1 は高さの最大値を表します。必要に応じて調整してください。
});

// マテリアルを作成し、元の画像をテクスチャとして適用
const material = new THREE.MeshStandardMaterial({ map: originalTexture });

// メッシュを作成
const mesh = new THREE.Mesh(geometry, material);

// シーンにメッシュを追加
scene.add(mesh);

// メッシュの位置を調整
mesh.position.set(5, 1, 5);


const hammer = new Hammer(renderer.domElement);
hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

hammer.on("swipeleft", turnRight);
hammer.on("swiperight", turnLeft);
hammer.on("swipeup", moveForward);
hammer.on("swipedown", moveBackward);


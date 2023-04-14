// index.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// Variable to hold the mesh object
let mesh;

// Load texture
textureLoader.load('textures/original_image.png', (texture) => {
  // Create a hemisphere geometry
  const geometry = new THREE.SphereGeometry(5, 64, 64, 0, Math.PI, 0, Math.PI);

  // Apply a scale transformation to the geometry to stretch it along the Y axis
  geometry.scale(1, 1.2, 1);

  // Apply the texture to a material
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create the mesh with the geometry and material
  mesh = new THREE.Mesh(geometry, material);

  // Add the mesh to the scene
  scene.add(mesh);
});

// Set camera position and look at the center of the object
camera.position.set(15, -4, 15);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Animate the scene
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the mesh
  if (mesh) {
    mesh.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
};

animate();

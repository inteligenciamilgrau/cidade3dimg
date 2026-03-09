// =====================================================================
// core/renderer.js — Configuração do Three.js: scene, camera, renderer
// =====================================================================
import * as THREE from 'https://esm.sh/three@0.128.0';

export { THREE };

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Céu azul

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const renderer = new THREE.WebGLRenderer({ antialias: false }); // Voxel look
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

export const clock = new THREE.Clock();

// Zoom via scroll (Scroll = Zoom)
export let cameraZoom = 1;
window.addEventListener('wheel', (e) => {
    cameraZoom += e.deltaY * 0.001;
    cameraZoom = Math.max(0.5, Math.min(cameraZoom, 3));
});

// --- Iluminação ---
export const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

export const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 200, 50);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 200;
dirLight.shadow.camera.bottom = -200;
dirLight.shadow.camera.left = -200;
dirLight.shadow.camera.right = 200;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Redimensionamento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =====================================================================
// world/landmarks.js — Lago, Corcovado, Pão de Açúcar, Bondinho, Patinho
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel } from '../core/voxel.js';
import { matWater, matWood, matSkin, matGrass } from '../core/materials.js';
import { collidables } from './city.js';
const matBondinho = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const matGlass = new THREE.MeshLambertMaterial({ color: 0xaaeeff, transparent: true, opacity: 0.5 });
const matPlat = new THREE.MeshLambertMaterial({ color: 0x555555 });


// ---- Lago (Pond) ----
const pondMat = new THREE.MeshLambertMaterial({ color: 0xdbce9d }); // Areia
for (let i = 0; i < 4; i++) {
    const s = 40 - i * 8;
    const dY = -1.2 - i * 0.8;
    createVoxel(80, dY, 80, s, 1, s, pondMat, false, true);
}
export const pond = createVoxel(80, -0.2, 80, 40, 0.4, 40, matWater, false, true);

// Ponte arqueada sobre o lago
for (let i = 0; i < 18; i++) {
    const zProg = i / 17;
    const bZ = 96 - 32 * zProg;
    const bY = 0.5 + Math.sin(zProg * Math.PI) * 3;
    const step = createVoxel(80, bY, bZ, 8, 0.5, 2.5, matWood, true, true);
    collidables.push(new THREE.Box3().setFromObject(step));
}

// ---- Barquinho ----
export const boat = new THREE.Group();
boat.position.set(80, 0.2, 80);
const bBase = createVoxel(0, 0, 0, 3, 0.6, 6, matWood);
const bMast = createVoxel(0, 1.5, 0, 0.2, 3, 0.2, matWood);
const matSail = new THREE.MeshLambertMaterial({ color: 0xffffff });
const bSail = createVoxel(0, 1.5, 1, 0.1, 2, 2, matSail);
boat.add(bBase, bMast, bSail);
scene.add(boat);
export const boatBox = new THREE.Box3();
collidables.push(boatBox);

// ---- Patinho ----
export const duck = new THREE.Group();
duck.position.set(70, 0.4, 70);
const matYellow = new THREE.MeshLambertMaterial({ color: 0xffff00 });
const matOrange = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
const matBlack = new THREE.MeshLambertMaterial({ color: 0x000000 });
const dBody = createVoxel(0, 0, 0, 1.2, 0.8, 1.6, matYellow);
const dHead = createVoxel(0, 0.8, 0.6, 0.8, 0.8, 0.8, matYellow);
const dBeak = createVoxel(0, 0.7, 1.1, 0.6, 0.2, 0.4, matOrange);
const dEyeL = createVoxel(-0.41, 0.9, 0.7, 0.1, 0.1, 0.1, matBlack);
const dEyeR = createVoxel(0.41, 0.9, 0.7, 0.1, 0.1, 0.1, matBlack);
export const dLegL = createVoxel(-0.3, -0.6, 0.4, 0.2, 0.8, 0.2, matOrange);
export const dLegR = createVoxel(0.3, -0.6, 0.4, 0.2, 0.8, 0.2, matOrange);
duck.add(dBody, dHead, dBeak, dEyeL, dEyeR, dLegL, dLegR);
scene.add(duck);

// ---- Corcovado ----
const mountainMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
const corcovadoLevels = 24;
for (let i = 0; i < corcovadoLevels; i++) {
    const s = 30 - i * (30 / corcovadoLevels);
    const h = 40 / corcovadoLevels;
    const y = i * h + h / 2;
    const layer = createVoxel(-80, y, -80, s, h, s, mountainMat);
    collidables.push(new THREE.Box3().setFromObject(layer));
}

// Placa Gemini no Corcovado
const canvasGemini = document.createElement('canvas');
canvasGemini.width = 512; canvasGemini.height = 128;
const ctxGem = canvasGemini.getContext('2d');
ctxGem.fillStyle = '#222222';
ctxGem.fillRect(0, 0, 512, 128);
ctxGem.fillStyle = '#4285F4';
ctxGem.font = 'bold 40px Arial';
ctxGem.textAlign = 'center';
ctxGem.textBaseline = 'middle';
ctxGem.fillText('Gemini 3.1 Pro High', 256, 64);
const texGem = new THREE.CanvasTexture(canvasGemini);
const matGem = new THREE.MeshBasicMaterial({ map: texGem });
export const geminiSign = createVoxel(-66, 36.5, -70, 8, 2, 0.5, matGem);
geminiSign.rotation.y = Math.PI / 2;
collidables.push(new THREE.Box3().setFromObject(geminiSign));

// Cristo Redentor GIGANTE (Animado / Rotacionado)
const stoneMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
export const christGroup = new THREE.Group();
christGroup.position.set(-80, 35, -80);
scene.add(christGroup);

function addCHPart(x, y, z, w, h, d) {
    const m = createVoxel(x, y, z, w, h, d, stoneMat);
    christGroup.add(m);
    m.position.set(x + 80, y - 35, z + 80); // Transforma em local
    return m;
}

// Pedestal
addCHPart(-80, 37.5, -80, 10, 5, 10);
// Estátua
export const chBase = addCHPart(-80, 44, -80, 8, 8, 8); // Pés
addCHPart(-80, 60, -80, 8, 24, 6); // Corpo
addCHPart(-80, 68, -80, 32, 4, 4); // Braços
addCHPart(-80, 75, -80, 6, 6, 6); // Cabeça

// Rotaciona 45 graus (PI/4) para olhar direto para o centro da cidade (0,0)
christGroup.rotation.y = Math.PI / 4;

// Colisão da base (como o grupo rotaciona, usamos a caixa da base fixa para simplificar)
collidables.push(new THREE.Box3().setFromObject(chBase));

// ---- Pão de Açúcar (Níveis mais altos e trilha contínua para subir fácil) ----
const paoLevels = 24; 
for (let i = 0; i < paoLevels; i++) {
    const s = 20 - i * (20 / paoLevels);
    const h = 30 / paoLevels; // h = 1.25
    const y = i * h + h / 2;
    const layer = createVoxel(-40, y, -80, s, h, s, mountainMat);
    collidables.push(new THREE.Box3().setFromObject(layer));

    // Trilinha cinza contínua (mais fácil de subir que degraus picados)
    const trailStep = createVoxel(-40, y, -80 + (s/2) + 0.2, 5, h, 1, matPlat);
    collidables.push(new THREE.Box3().setFromObject(trailStep));
}

// ---- Bondinho ----

export const bondinho = new THREE.Group();
bondinho.position.set(-60, 25, -100);
scene.add(bondinho);
export const bondinhoBoxes = [];

function addBPart(x, y, z, w, h, d, mat, isCol) {
    const m = createVoxel(x, y, z, w, h, d, mat);
    bondinho.add(m);
    if (isCol) {
        const box = new THREE.Box3();
        bondinhoBoxes.push({ mesh: m, box });
        collidables.push(box);
    }
}

// Base e Teto maiores (5x6, altura 5)
addBPart(0, 0.1, 0, 5, 0.2, 6, matBondinho, true);
addBPart(0, 4.9, 0, 5, 0.2, 6, matBondinho, true);

// Pilastras nos 4 cantos
addBPart(-2.4, 2.5, -2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(2.4, 2.5, -2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(-2.4, 2.5, 2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(2.4, 2.5, 2.9, 0.2, 5, 0.2, matBondinho, true);

// Paredes mínimas (apenas faixas nos cantos) para portas GIGANTES nos 4 lados
// Lado Esquerdo (X-) - Apenas 0.8 de largura nos cantos
addBPart(-2.4, 2.5, -2.6, 0.2, 5, 0.8, matGlass, true);
addBPart(-2.4, 2.5, 2.6, 0.2, 5, 0.8, matGlass, true);
// Lado Direito (X+)
addBPart(2.4, 2.5, -2.6, 0.2, 5, 0.8, matGlass, true);
addBPart(2.4, 2.5, 2.6, 0.2, 5, 0.8, matGlass, true);
// Lado Frente (Z+)
addBPart(-2.1, 2.5, 2.9, 0.8, 5, 0.2, matGlass, true);
addBPart(2.1, 2.5, 2.9, 0.8, 5, 0.2, matGlass, true);
// Lado Trás (Z-)
addBPart(-2.1, 2.5, -2.9, 0.8, 5, 0.2, matGlass, true);
addBPart(2.1, 2.5, -2.9, 0.8, 5, 0.2, matGlass, true);

// Suporte para o cabo (mais alto agora: altura 5 + 2.3 = 7.3)
addBPart(0, 6.1, 0, 0.4, 2.5, 0.4, matWood, false);
addBPart(0, 7.3, 0, 1, 0.2, 1, matWood, false);

// ---- Cabo do Bondinho ----
// Conectando os dois extremos (Corcovado STATION e Pão de Açúcar)
const p1 = new THREE.Vector3(-72, 35.5, -80);  // Estação Corcovado
const p2 = new THREE.Vector3(-40, 30, -90);  // Estação Pão de Açúcar
const dist = p1.distanceTo(p2);
const cableMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, dist),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
);
cableMesh.position.copy(p1).add(p2).multiplyScalar(0.5);
cableMesh.position.y += 7.3; // Alinhado com o suporte
cableMesh.lookAt(p2.x, p2.y + 7.3, p2.z);
scene.add(cableMesh);

// ---- Estações do Bondinho ----


// Estação Corcovado (Plataforma Panorâmica REDONDA)
const circGeo = new THREE.CylinderGeometry(15, 15, 0.5, 32);
const plat1 = new THREE.Mesh(circGeo, matPlat);
plat1.position.set(-80, 35, -80);
scene.add(plat1);

// Gramado Redondo
const grassGeo = new THREE.CylinderGeometry(14, 14, 0.2, 32);
const grassCorc = new THREE.Mesh(grassGeo, matGrass);
grassCorc.position.set(-80, 35.3, -80);
scene.add(grassCorc);

// Colisões (Aproximação por caixas para performance)
const platBox = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(-80, 35, -80), 
    new THREE.Vector3(22, 0.5, 22)
);
const platBox2 = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(-80, 35, -80), 
    new THREE.Vector3(12, 0.5, 30)
);
const platBox3 = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(-80, 35, -80), 
    new THREE.Vector3(30, 0.5, 12)
);
collidables.push(platBox, platBox2, platBox3);

// Poste da Estação Corcovado (onde o bondinho para)
createVoxel(-72, 38, -80, 1, 8, 1, matPlat, true, true);

// Estação Pão de Açúcar (y=30)
// Plataforma estendida de -80 até -95 (para trás)
const plat2 = createVoxel(-40, 29.5, -87.5, 12, 0.5, 15, matPlat);
collidables.push(new THREE.Box3().setFromObject(plat2));

// Poste da Estação Pão de Açúcar
createVoxel(-40, 33, -90, 1, 8, 1, matPlat, true, true);


// Acesso ao Corcovado agora é APENAS via Bondinho.

export let bondinhoP = 0;
// bBase exportado para colisão dinâmica do barco
export { bBase };

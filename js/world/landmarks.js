// =====================================================================
// world/landmarks.js — Lago, Corcovado, Pão de Açúcar, Bondinho, Patinho
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel } from '../core/voxel.js';
import { matWater, matWood, matSkin } from '../core/materials.js';
import { collidables } from './city.js';

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
export const geminiSign = createVoxel(-75, 42, -75, 8, 2, 0.5, matGem);
geminiSign.rotation.y = -Math.PI / 4;
collidables.push(new THREE.Box3().setFromObject(geminiSign));

// Cristo Redentor
const stoneMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
export const chBase = createVoxel(-80, 42, -80, 4, 4, 4, stoneMat);
createVoxel(-80, 48, -80, 4, 10, 3, stoneMat);
createVoxel(-80, 50, -80, 16, 2, 2, stoneMat);
createVoxel(-80, 54, -80, 3, 3, 3, stoneMat);
collidables.push(new THREE.Box3().setFromObject(chBase));

// ---- Pão de Açúcar ----
const paoLevels = 18;
for (let i = 0; i < paoLevels; i++) {
    const s = 20 - i * (20 / paoLevels);
    const h = 30 / paoLevels;
    const y = i * h + h / 2;
    const layer = createVoxel(-40, y, -120, s, h, s, mountainMat);
    collidables.push(new THREE.Box3().setFromObject(layer));
}

// ---- Bondinho ----
const matBondinho = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const matGlass = new THREE.MeshLambertMaterial({ color: 0xaaeeff, transparent: true, opacity: 0.5 });
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

addBPart(0, 0.1, 0, 4, 0.2, 5, matBondinho, true);
addBPart(0, 3.9, 0, 4, 0.2, 5, matBondinho, true);
addBPart(-1.9, 1, 0, 0.2, 2, 5, matBondinho, true);
addBPart(-1.9, 2.5, 0, 0.2, 1, 5, matGlass, true);
addBPart(-1.9, 3.5, 0, 0.2, 1, 5, matBondinho, true);
addBPart(1.9, 1, 0, 0.2, 2, 5, matBondinho, true);
addBPart(1.9, 2.5, 0, 0.2, 1, 5, matGlass, true);
addBPart(1.9, 3.5, 0, 0.2, 1, 5, matBondinho, true);
addBPart(-1.4, 2, -2.4, 1.2, 4, 0.2, matBondinho, true);
addBPart(1.4, 2, -2.4, 1.2, 4, 0.2, matBondinho, true);
addBPart(0, 3.5, -2.4, 1.6, 1, 0.2, matBondinho, true);
addBPart(-1.4, 2, 2.4, 1.2, 4, 0.2, matBondinho, true);
addBPart(1.4, 2, 2.4, 1.2, 4, 0.2, matBondinho, true);
addBPart(0, 3.5, 2.4, 1.6, 1, 0.2, matBondinho, true);

export let bondinhoP = 0;
// bBase exportado para colisão dinâmica do barco
export { bBase };

// world/landmarks.js
import { THREE, scene } from '../core/renderer.js';
import { createVoxel } from '../core/voxel.js';
import { matWood, matWater } from '../core/materials.js';
import { collidables } from './city.js';

const matBondinho = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const matGlass = new THREE.MeshLambertMaterial({ color: 0xaaeeff, transparent: true, opacity: 0.5 });
const matPlat = new THREE.MeshLambertMaterial({ color: 0x555555 });

// ---- Bondinho Cabine ----
export const bondinho = new THREE.Group();
window.bondinho = bondinho;
bondinho.position.set(-60, 25, -100);
scene.add(bondinho);
bondinho.visible = false;
export const bondinhoBoxes = [];

function addBPart(x, y, z, w, h, d, mat, isCol) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), mat);
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    m.castShadow = true;
    m.receiveShadow = true;
    bondinho.add(m);
    if (isCol) {
        const box = new THREE.Box3();
        bondinhoBoxes.push({ mesh: m, box });
        collidables.push(box);
    }
}

addBPart(0, 0.1, 0, 5, 0.2, 6, matBondinho, true);
addBPart(0, 4.9, 0, 5, 0.2, 6, matBondinho, true);
addBPart(-2.4, 2.5, -2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(2.4, 2.5, -2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(-2.4, 2.5, 2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(2.4, 2.5, 2.9, 0.2, 5, 0.2, matBondinho, true);
addBPart(-2.4, 2.5, -2.6, 0.2, 5, 0.8, matGlass, true);
addBPart(-2.4, 2.5, 2.6, 0.2, 5, 0.8, matGlass, true);
addBPart(2.4, 2.5, -2.6, 0.2, 5, 0.8, matGlass, true);
addBPart(2.4, 2.5, 2.6, 0.2, 5, 0.8, matGlass, true);
addBPart(-2.1, 2.5, 2.9, 0.8, 5, 0.2, matGlass, true);
addBPart(2.1, 2.5, 2.9, 0.8, 5, 0.2, matGlass, true);
addBPart(-2.1, 2.5, -2.9, 0.8, 5, 0.2, matGlass, true);
addBPart(2.1, 2.5, -2.9, 0.8, 5, 0.2, matGlass, true);

// Suporte para o cabo
addBPart(0, 6.1, 0, 0.4, 2.5, 0.4, matWood, false);
addBPart(0, 7.3, 0, 1, 0.2, 1, matWood, false);

// ---- Globals para animação de entidades (usados em main.js) ----
export const boatGroup = new THREE.Group();
window.boatGroup = boatGroup;
export const boatBox = new THREE.Box3();
collidables.push(boatBox);
scene.add(boatGroup);

export const duckGroup = new THREE.Group();
window.duckGroup = duckGroup;
export const dLegL = new THREE.Group(); // placeholders
export const dLegR = new THREE.Group();
scene.add(duckGroup);

export let bondinhoP = 0;
export const bBase = boatGroup; 
export const boat = boatGroup;
export const duck = duckGroup;
export const geminiSign = new THREE.Group(); 
export const chBase = new THREE.Group(); 


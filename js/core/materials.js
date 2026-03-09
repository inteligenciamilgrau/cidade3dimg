// =====================================================================
// core/materials.js — Materiais voxel reutilizáveis
// =====================================================================
import { THREE } from './renderer.js';

export const matRoad = new THREE.MeshLambertMaterial({ color: 0x333333 });
export const matSidewalk = new THREE.MeshLambertMaterial({ color: 0x888888 });
export const matGrass = new THREE.MeshLambertMaterial({ color: 0x33aa33 });
export const matBuilding = [
    new THREE.MeshLambertMaterial({ color: 0xaa5555 }),
    new THREE.MeshLambertMaterial({ color: 0x5555aa }),
    new THREE.MeshLambertMaterial({ color: 0xaaaa55 }),
    new THREE.MeshLambertMaterial({ color: 0x888888 }),
];
export const matWindows = new THREE.MeshLambertMaterial({ color: 0xffffcc });
export const matTrunk = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
export const matLeaves = new THREE.MeshLambertMaterial({ color: 0x228b22 });
export const matWater = new THREE.MeshLambertMaterial({ color: 0x4444ff, transparent: true, opacity: 0.8 });
export const matWood = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
export const matSkin = new THREE.MeshLambertMaterial({ color: 0xffcc99 });
export const matShirt = new THREE.MeshLambertMaterial({ color: 0xff0000 });
export const matPants = new THREE.MeshLambertMaterial({ color: 0x0000ff });
export const matStripe = new THREE.MeshBasicMaterial({ color: 0xffffff });
export const matZebra = new THREE.MeshBasicMaterial({ color: 0xdddddd });

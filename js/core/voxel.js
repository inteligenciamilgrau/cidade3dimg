// =====================================================================
// core/voxel.js — Criação de voxels, checagem de colisão, mensagens HUD
// =====================================================================
import { THREE, scene } from './renderer.js';

// Geometria compartilhada (Box 1×1×1 reusada para todos os voxels)
const geomBox = new THREE.BoxGeometry(1, 1, 1);

/**
 * Cria um voxel (cubo escalável) na cena e retorna o mesh.
 * @param {number} x,y,z   - posição absoluta no mundo
 * @param {number} w,h,d   - largura, altura, profundidade
 * @param {THREE.Material} mat
 * @param {boolean} castShadow
 * @param {boolean} receiveShadow
 */
export function createVoxel(x, y, z, w, h, d, mat, castShadow = true, receiveShadow = true) {
    const mesh = new THREE.Mesh(geomBox, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    scene.add(mesh);
    return mesh;
}

/**
 * AABB collision check entre dois THREE.Box3.
 */
export function checkCollision(box1, box2) {
    return box1.min.x <= box2.max.x && box1.max.x >= box2.min.x &&
        box1.min.y <= box2.max.y && box1.max.y >= box2.min.y &&
        box1.min.z <= box2.max.z && box1.max.z >= box2.min.z;
}

/**
 * Exibe uma mensagem flutuante na HUD por 3 segundos.
 */
export function showMsg(txt) {
    const d = document.createElement('div');
    d.innerText = txt;
    document.getElementById('messages').appendChild(d);
    setTimeout(() => d.remove(), 3000);
}

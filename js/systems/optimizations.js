// =====================================================================
// systems/optimizations.js — Backface Culling + Frustum Culling por Bloco
// =====================================================================
import { THREE, scene, camera } from '../core/renderer.js';
import { blockGroups } from '../world/city.js';
import * as CONFIG from '../config.js';

// === Frustum reutilizável ===
const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();

// === Dados pré-calculados por bloco ===
const blockData = []; // { group, box, center }

// =====================================================================
//  INICIALIZAÇÃO (chamada uma vez após buildCity)
// =====================================================================
export function initOptimizations() {
    if (!CONFIG.OPTIMIZATION_ENABLED) return;

    let meshCount = 0;

    // --- BACKFACE CULLING: Forçar FrontSide em materiais opacos ---
    scene.traverse(obj => {
        if (obj.isMesh) {
            meshCount++;
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => {
                        if (!m.transparent) m.side = THREE.FrontSide;
                    });
                } else {
                    if (!obj.material.transparent) obj.material.side = THREE.FrontSide;
                }
            }
            // Frustum culling nativo por mesh (já é default, mas garante)
            obj.frustumCulled = true;
            // Pré-calcula bounding sphere para frustum check mais rápido
            if (obj.geometry && !obj.geometry.boundingSphere) {
                obj.geometry.computeBoundingSphere();
            }
        }
    });

    // --- Pré-calcula bounding box dos grupos de blocos ---
    blockGroups.forEach(group => {
        if (group.children.length === 0) return;
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        blockData.push({ group, box, center });
    });

    console.log(
        `[Otimização] ${meshCount} meshes (backface culling) | ` +
        `${blockData.length} blocos (frustum culling)`
    );
}

// =====================================================================
//  UPDATE POR FRAME — Só frustum + distância, sem tocar em sombra/fog
// =====================================================================
export function updateOptimizations() {
    if (!CONFIG.OPTIMIZATION_ENABLED) return;

    // Atualiza frustum da câmera
    camera.updateMatrixWorld();
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

    const camPos = camera.position;
    const viewDistSq = CONFIG.VIEW_DISTANCE * CONFIG.VIEW_DISTANCE;

    for (let i = 0; i < blockData.length; i++) {
        const bd = blockData[i];

        // Distance culling — longe demais? Esconde o grupo inteiro
        const distSq = bd.center.distanceToSquared(camPos);
        if (distSq > viewDistSq) {
            bd.group.visible = false;
            continue;
        }

        // Frustum culling — fora do campo de visão? Esconde
        bd.group.visible = frustum.intersectsBox(bd.box);
    }
}

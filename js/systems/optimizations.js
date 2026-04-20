// =====================================================================
// systems/optimizations.js — Culling de Frustum e Oclusão em Nível de Bloco
// =====================================================================
import { THREE, camera } from '../core/renderer.js';
import { blockGroups } from '../world/city.js';
import * as CONFIG from '../config.js';

const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const blockBounds = new Map();

/**
 * Inicializa as bounding boxes de cada bloco para otimização futura.
 * Deve ser chamado APÓS buildCity().
 */
export function initOptimizations() {
    if (!CONFIG.OPTIMIZATION_ENABLED) return;
    
    blockGroups.forEach(group => {
        if (group.children.length > 0) {
            const box = new THREE.Box3().setFromObject(group);
            blockBounds.set(group, box);
        }
    });
    console.log(`[Otimização] ${blockGroups.length} blocos monitorados para culling.`);
}

/**
 * Executa o culling de frustum e distância em cada frame.
 */
export function updateOptimizations() {
    if (!CONFIG.OPTIMIZATION_ENABLED) return;

    // Atualiza a matriz do frustum da câmera
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

    const playerPos = camera.position;
    const viewDistSq = CONFIG.VIEW_DISTANCE * CONFIG.VIEW_DISTANCE;

    blockGroups.forEach(group => {
        const box = blockBounds.get(group);
        if (!box) return;

        // 1. DISTANCE CULLING (Oclusão Simplificada/Neblina)
        const center = box.getCenter(new THREE.Vector3());
        const distSq = center.distanceToSquared(playerPos);
        
        if (distSq > viewDistSq) {
            group.visible = false;
            return;
        }

        // 2. FRUSTUM CULLING
        // Verifica se a bounding box do bloco intersecta o que a câmera vê
        if (frustum.intersectsBox(box)) {
            group.visible = true;
        } else {
            group.visible = false;
        }
    });
}

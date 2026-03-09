// =====================================================================
// world/city.js — Geração procedural da cidade: ruas, cruzamentos, quarteirões
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel } from '../core/voxel.js';
import { matRoad, matSidewalk, matGrass, matBuilding, matWindows, matTrunk, matLeaves } from '../core/materials.js';
import { CITY_SIZE, BLOCK_SIZE, ROAD_WIDTH } from '../config.js';

export const buildings = [];
export const roads = [];
export const trafficLights = [];
export const collidables = [];

// Chão verde base (ground)
createVoxel(-20, -0.5, 0, 160, 1, 200, matGrass, false, true);  // Esquerda
createVoxel(80, -0.5, -20, 40, 1, 160, matGrass, false, true); // Direita

export function buildCity() {
    const half = CITY_SIZE / 2;
    const matYellowStripe = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const matCrosswalk = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 1) RUAS — tiras contínuas ao longo de cada linha do grid
    for (let g = -half; g <= half; g += BLOCK_SIZE) {
        // Rua horizontal
        createVoxel(0, 0.01, g, CITY_SIZE, 0.1, ROAD_WIDTH, matRoad, false, true);
        roads.push({ x: 0, z: g, w: CITY_SIZE, d: ROAD_WIDTH, dir: 'x' });
        for (let dx = -half; dx < half; dx += 8) {
            createVoxel(dx + 2, 0.03, g, 4, 0.1, 0.4, matYellowStripe, false, false);
        }

        // Rua vertical
        createVoxel(g, 0.01, 0, ROAD_WIDTH, 0.1, CITY_SIZE, matRoad, false, true);
        roads.push({ x: g, z: 0, w: ROAD_WIDTH, d: CITY_SIZE, dir: 'z' });
        for (let dz = -half; dz < half; dz += 8) {
            createVoxel(g, 0.03, dz + 2, 0.4, 0.1, 4, matYellowStripe, false, false);
        }
    }

    // 2) CRUZAMENTOS — faixas de pedestres e semáforos
    for (let gx = -half; gx <= half; gx += BLOCK_SIZE) {
        for (let gz = -half; gz <= half; gz += BLOCK_SIZE) {
            const rw2 = ROAD_WIDTH / 2;
            // Faixas de pedestre nos 4 lados
            for (let s = -rw2 + 1; s < rw2; s += 2) {
                createVoxel(gx + s, 0.03, gz - rw2 - 1.5, 1, 0.1, 3, matCrosswalk, false, false);
                createVoxel(gx + s, 0.03, gz + rw2 + 1.5, 1, 0.1, 3, matCrosswalk, false, false);
                createVoxel(gx - rw2 - 1.5, 0.03, gz + s, 3, 0.1, 1, matCrosswalk, false, false);
                createVoxel(gx + rw2 + 1.5, 0.03, gz + s, 3, 0.1, 1, matCrosswalk, false, false);
            }

            // Semáforo + poste
            const pole = createVoxel(gx + rw2 + 1, 4, gz - rw2 - 1, 0.5, 8, 0.5, matRoad);
            createVoxel(gx + rw2 + 0.5, 8.5, gz - rw2 - 1, 2, 5, 2, matRoad);
            const redL = createVoxel(gx + rw2 - 0.6, 10.2, gz - rw2 - 1, 0.3, 1, 1, new THREE.MeshBasicMaterial({ color: 0x440000 }), false);
            const yellowL = createVoxel(gx + rw2 - 0.6, 8.5, gz - rw2 - 1, 0.3, 1, 1, new THREE.MeshBasicMaterial({ color: 0x444400 }), false);
            const greenL = createVoxel(gx + rw2 - 0.6, 6.8, gz - rw2 - 1, 0.3, 1, 1, new THREE.MeshBasicMaterial({ color: 0x00ff00 }), false);
            const pointLight = new THREE.PointLight(0xffffcc, 0, 50);
            pointLight.position.set(gx + rw2 - 1, 10, gz - rw2 - 1);
            scene.add(pointLight);
            collidables.push(new THREE.Box3().setFromObject(pole));
            trafficLights.push({
                x: gx, z: gz,
                state: 'green',
                timer: Math.random() * 10,
                redObj: redL, yellowObj: yellowL, greenObj: greenL,
                pointLight
            });
        }
    }

    // 3) QUARTEIRÕES — prédios ou árvores (geração padrão)
    const blockW = BLOCK_SIZE - ROAD_WIDTH;
    let colIdx = 0;
    for (let bx = -half + BLOCK_SIZE / 2; bx < half; bx += BLOCK_SIZE) {
        colIdx++;
        let rowIdx = 0;
        for (let bz = -half + BLOCK_SIZE / 2; bz < half; bz += BLOCK_SIZE) {
            rowIdx++;
            const isMountainArea = (bx <= -20 && bz <= -60);
            const isLakeArea = (bx >= 60 && bz >= 60);
            const isHeliArea = (bx === 0 && bz === -40);

            if (!isLakeArea) {
                createVoxel(bx, 0.1, bz, blockW, 0.2, blockW, matSidewalk, true, true);
            }

            // Verifica bloco customizado
            const blockKey = colIdx + '_' + rowIdx;
            if (window.customBlocks && window.customBlocks[blockKey]) {
                try {
                    window.customBlocks[blockKey]({
                        createVoxel, THREE, collidables, buildings,
                        centerX: bx, centerZ: bz, blockW
                    });
                    console.log('Bloco customizado carregado:', blockKey, `em X=${bx} Z=${bz}`);
                } catch (e) {
                    console.error('Erro no bloco customizado ' + blockKey + ':', e);
                }
            } else if (!isMountainArea && !isLakeArea && !isHeliArea) {
                if (Math.random() > 0.2) {
                    const h = 10 + Math.random() * 30;
                    const bw = blockW - 4;
                    const m = matBuilding[Math.floor(Math.random() * matBuilding.length)];
                    const b = createVoxel(bx, h / 2, bz, bw, h, bw, m);
                    collidables.push(new THREE.Box3().setFromObject(b));
                    buildings.push(b);
                    for (let wy = 5; wy < h; wy += 5) {
                        for (let wx = -bw / 2 + 2; wx <= bw / 2 - 2; wx += 4) {
                            createVoxel(bx + wx, wy, bz + bw / 2 + 0.1, 2, 2, 0.1, matWindows, false, false);
                            createVoxel(bx + wx, wy, bz - bw / 2 - 0.1, 2, 2, 0.1, matWindows, false, false);
                        }
                    }
                } else {
                    for (let t = 0; t < 3; t++) {
                        const tx = bx + (Math.random() - 0.5) * (blockW - 4);
                        const tz = bz + (Math.random() - 0.5) * (blockW - 4);
                        const trunk = createVoxel(tx, 2, tz, 1, 4, 1, matTrunk);
                        collidables.push(new THREE.Box3().setFromObject(trunk));
                        const lv = createVoxel(tx, 5, tz, 4, 4, 4, matLeaves);
                        collidables.push(new THREE.Box3().setFromObject(lv));
                    }
                }
            }
        }
    }
}

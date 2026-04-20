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
export const blockGroups = []; // Grupos para otimização

// Chão verde base (ground)
const ground = new THREE.Group();
scene.add(ground);
createVoxel(-20, -0.5, 0, 160, 1, 200, matGrass, false, true, ground);  // Esquerda
createVoxel(80, -0.5, -20, 40, 1, 160, matGrass, false, true, ground); // Direita

export function buildCity() {
    const half = CITY_SIZE / 2;
    const matYellowStripe = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const matCrosswalk = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 1) RUAS — tiras contínuas ao longo de cada linha do grid
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);
    blockGroups.push(roadGroup);

    for (let g = -half; g <= half; g += BLOCK_SIZE) {
        // Rua horizontal
        createVoxel(0, 0.01, g, CITY_SIZE, 0.1, ROAD_WIDTH, matRoad, false, true, roadGroup);
        roads.push({ x: 0, z: g, w: CITY_SIZE, d: ROAD_WIDTH, dir: 'x' });
        for (let dx = -half; dx < half; dx += 8) {
            createVoxel(dx + 2, 0.03, g, 4, 0.1, 0.4, matYellowStripe, false, false, roadGroup);
        }

        // Rua vertical
        createVoxel(g, 0.01, 0, ROAD_WIDTH, 0.1, CITY_SIZE, matRoad, false, true, roadGroup);
        roads.push({ x: g, z: 0, w: ROAD_WIDTH, d: CITY_SIZE, dir: 'z' });
        for (let dz = -half; dz < half; dz += 8) {
            createVoxel(g, 0.03, dz + 2, 0.4, 0.1, 4, matYellowStripe, false, false, roadGroup);
        }
    }

    // 2) CRUZAMENTOS — faixas de pedestres e semáforos
    for (let gx = -half; gx <= half; gx += BLOCK_SIZE) {
        for (let gz = -half; gz <= half; gz += BLOCK_SIZE) {
            const intGroup = new THREE.Group();
            scene.add(intGroup);
            blockGroups.push(intGroup);

            const rw2 = ROAD_WIDTH / 2;
            // Faixas de pedestre nos 4 lados
            for (let s = -rw2 + 1; s < rw2; s += 2) {
                createVoxel(gx + s, 0.03, gz - rw2 - 1.5, 1, 0.1, 3, matCrosswalk, false, false, intGroup);
                createVoxel(gx + s, 0.03, gz + rw2 + 1.5, 1, 0.1, 3, matCrosswalk, false, false, intGroup);
                createVoxel(gx - rw2 - 1.5, 0.03, gz + s, 3, 0.1, 1, matCrosswalk, false, false, intGroup);
                createVoxel(gx + rw2 + 1.5, 0.03, gz + s, 3, 0.1, 1, matCrosswalk, false, false, intGroup);
            }

            // Semáforo + poste
            const pole = createVoxel(gx + rw2 + 1, 4, gz - rw2 - 1, 0.5, 8, 0.5, matRoad, true, true, intGroup);
            createVoxel(gx + rw2 + 0.5, 8.5, gz - rw2 - 1, 2, 5, 2, matRoad, true, true, intGroup);
            const redL = createVoxel(gx + rw2 - 0.6, 10.2, gz - rw2 - 1, 0.3, 1, 1, new THREE.MeshBasicMaterial({ color: 0x440000 }), false, false, intGroup);
            const yellowL = createVoxel(gx + rw2 - 0.6, 8.5, gz - rw2 - 1, 0.3, 1, 1, new THREE.MeshBasicMaterial({ color: 0x444400 }), false, false, intGroup);
            const greenL = createVoxel(gx + rw2 - 0.6, 6.8, gz - rw2 - 1, 0.3, 1, 1, new THREE.MeshBasicMaterial({ color: 0x00ff00 }), false, false, intGroup);
            const pointLight = new THREE.PointLight(0xffffcc, 0, 50);
            pointLight.position.set(gx + rw2 - 1, 10, gz - rw2 - 1);
            intGroup.add(pointLight);
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
            
            const blockGroup = new THREE.Group();
            scene.add(blockGroup);
            blockGroups.push(blockGroup);

            // Verifica bloco customizado
            const blockKey = colIdx + '_' + rowIdx;
            const customHandler = window.customBlocks && window.customBlocks[blockKey];
            if (Object.hasOwn(window.customBlocks || {}, blockKey) && typeof customHandler === 'function') {
                try {
                    // Wrapper para garantir que todos os voxels do bloco caiam no grupo de otimização
                    const createVoxelWrapper = (...args) => {
                        if (args.length < 10) {
                            while(args.length < 9) args.push(undefined);
                            args[9] = blockGroup;
                        }
                        return createVoxel(...args);
                    };

                    customHandler({
                        createVoxel: createVoxelWrapper, 
                        THREE, scene, collidables, buildings,
                        centerX: bx, centerZ: bz, blockW, parent: blockGroup
                    });
                } catch (e) {
                    console.error('Erro no bloco customizado ' + blockKey + ':', e);
                }
            } else {
                createVoxel(bx, 0.1, bz, blockW, 0.2, blockW, matSidewalk, true, true, blockGroup);
                if (Math.random() > 0.5) {
                    const h = 3.5 + Math.random() * 1.5; 
                    const bw = blockW - 10; 
                    createVoxel(bx, 0.2, bz, blockW - 2, 0.1, blockW - 2, matGrass, false, true, blockGroup);
                    const m = matBuilding[Math.floor(Math.random() * matBuilding.length)];
                    const b = createVoxel(bx, h / 2, bz, bw, h, bw, m, true, true, blockGroup);
                    collidables.push(new THREE.Box3().setFromObject(b));
                    buildings.push(b);
                    const matRoof = new THREE.MeshLambertMaterial({ color: 0x8b3a3a });
                    const roof = createVoxel(bx, h + 0.5, bz, bw + 1, 1, bw + 1, matRoof, true, true, blockGroup);
                    collidables.push(new THREE.Box3().setFromObject(roof));
                    for (let wx = -bw / 2 + 2; wx <= bw / 2 - 2; wx += 4) {
                        createVoxel(bx + wx, 2.0, bz + bw / 2 + 0.1, 1.5, 1.5, 0.1, matWindows, false, false, blockGroup);
                        createVoxel(bx + wx, 2.0, bz - bw / 2 - 0.1, 1.5, 1.5, 0.1, matWindows, false, false, blockGroup);
                    }
                    for (let t = 0; t < 2; t++) {
                        const tx = bx + (Math.random() > 0.5 ? 1 : -1) * (bw / 2 + 2);
                        const tz = bz + (Math.random() > 0.5 ? 1 : -1) * (bw / 2 + 2);
                        const trunk = createVoxel(tx, 1.5, tz, 0.6, 3, 0.6, matTrunk, true, true, blockGroup);
                        collidables.push(new THREE.Box3().setFromObject(trunk));
                        const lv = createVoxel(tx, 3.5, tz, 2.5, 2.5, 2.5, matLeaves, true, true, blockGroup);
                        collidables.push(new THREE.Box3().setFromObject(lv));
                    }
                } else {
                    createVoxel(bx, 0.2, bz, blockW - 2, 0.1, blockW - 2, matGrass, false, true, blockGroup);
                    createVoxel(bx, 0.5, bz, 4, 0.8, 4, new THREE.MeshLambertMaterial({color: 0x999999}), true, true, blockGroup);
                    const agua = createVoxel(bx, 1.0, bz, 3.5, 0.5, 3.5, new THREE.MeshLambertMaterial({color: 0x3388ff}), true, true, blockGroup);
                    collidables.push(new THREE.Box3().setFromObject(agua));
                    for (let t = 0; t < 4; t++) {
                        const tx = bx + (Math.random() - 0.5) * (blockW - 8);
                        const tz = bz + (Math.random() - 0.5) * (blockW - 8);
                        if (Math.abs(tx - bx) < 3 && Math.abs(tz - bz) < 3) continue;
                        const trunk = createVoxel(tx, 2, tz, 1, 4, 1, matTrunk, true, true, blockGroup);
                        collidables.push(new THREE.Box3().setFromObject(trunk));
                        const lv = createVoxel(tx, 5, tz, 4, 4, 4, matLeaves, true, true, blockGroup);
                        collidables.push(new THREE.Box3().setFromObject(lv));
                    }
                }
            }
        }
    }
}

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
            // Tudo agora é área de quarteirão
            
            



            // Verifica bloco customizado
            const blockKey = colIdx + '_' + rowIdx;
            const customHandler = window.customBlocks && window.customBlocks[blockKey];
            if (Object.hasOwn(window.customBlocks || {}, blockKey) && typeof customHandler === 'function') {
                try {
                    customHandler({
                        createVoxel, THREE, scene, collidables, buildings,
                        centerX: bx, centerZ: bz, blockW
                    });
                } catch (e) {
                    console.error('Erro no bloco customizado ' + blockKey + ':', e);
                }
            } else {
                createVoxel(bx, 0.1, bz, blockW, 0.2, blockW, matSidewalk, true, true);
                if (Math.random() > 0.5) {
                    // Casa Térrea com Jardim
                    const h = 3.5 + Math.random() * 1.5; // Casa baixa (um andar)
                    const bw = blockW - 10; // Deixa 5 de jardim de cada lado
                    
                    // Gramado do terreno (jardim)
                    createVoxel(bx, 0.2, bz, blockW - 2, 0.1, blockW - 2, matGrass, false, true);

                    const m = matBuilding[Math.floor(Math.random() * matBuilding.length)];
                    const b = createVoxel(bx, h / 2, bz, bw, h, bw, m);
                    collidables.push(new THREE.Box3().setFromObject(b));
                    buildings.push(b);

                    // Telhado
                    const matRoof = new THREE.MeshLambertMaterial({ color: 0x8b3a3a }); // Telha vermelha
                    const roof = createVoxel(bx, h + 0.5, bz, bw + 1, 1, bw + 1, matRoof);
                    collidables.push(new THREE.Box3().setFromObject(roof));

                    // Algumas janelas nas paredes laterais
                    for (let wx = -bw / 2 + 2; wx <= bw / 2 - 2; wx += 4) {
                        createVoxel(bx + wx, 2.0, bz + bw / 2 + 0.1, 1.5, 1.5, 0.1, matWindows, false, false);
                        createVoxel(bx + wx, 2.0, bz - bw / 2 - 0.1, 1.5, 1.5, 0.1, matWindows, false, false);
                    }

                    // Duas arvorezinhas pequenas no quintal
                    for (let t = 0; t < 2; t++) {
                        const tx = bx + (Math.random() > 0.5 ? 1 : -1) * (bw / 2 + 2);
                        const tz = bz + (Math.random() > 0.5 ? 1 : -1) * (bw / 2 + 2);
                        const trunk = createVoxel(tx, 1.5, tz, 0.6, 3, 0.6, matTrunk);
                        collidables.push(new THREE.Box3().setFromObject(trunk));
                        const lv = createVoxel(tx, 3.5, tz, 2.5, 2.5, 2.5, matLeaves);
                        collidables.push(new THREE.Box3().setFromObject(lv));
                    }
                } else {
                createVoxel(bx, 0.1, bz, blockW, 0.2, blockW, matSidewalk, true, true);
                    // Praça com Árvores e Chafariz
                    // Gramado do terreno
                    createVoxel(bx, 0.2, bz, blockW - 2, 0.1, blockW - 2, matGrass, false, true);
                    
                    // Chafariz simples no centro (Voxel cinza e azul)
                    createVoxel(bx, 0.5, bz, 4, 0.8, 4, new THREE.MeshLambertMaterial({color: 0x999999}));
                    const agua = createVoxel(bx, 1.0, bz, 3.5, 0.5, 3.5, new THREE.MeshLambertMaterial({color: 0x3388ff}));
                    collidables.push(new THREE.Box3().setFromObject(agua));

                    // Várias árvores maiores na praça
                    for (let t = 0; t < 4; t++) {
                        const tx = bx + (Math.random() - 0.5) * (blockW - 8);
                        const tz = bz + (Math.random() - 0.5) * (blockW - 8);
                        // Evita plantar em cima do chafariz
                        if (Math.abs(tx - bx) < 3 && Math.abs(tz - bz) < 3) continue;
                        
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

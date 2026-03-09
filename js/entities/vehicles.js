// =====================================================================
// entities/vehicles.js — Carros NPC + Helicóptero: spawn e update
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel, checkCollision, showMsg } from '../core/voxel.js';
import { matRoad, matWindows } from '../core/materials.js';
import { collidables, roads, trafficLights } from '../world/city.js';
import { spawnNPC, npcs } from './npcs.js';
import { createExplosion } from '../systems/collisions.js';
import { CITY_SIZE } from '../config.js';

export const cars = [];
const carColors = [0x00aaff, 0xff3333, 0x33ff33, 0xffff00, 0xff6600, 0xcc00cc, 0x00cccc, 0xffffff];

export function spawnCar() {
    if (!roads || roads.length === 0) return;
    const r = roads[Math.floor(Math.random() * roads.length)];
    if (!r) return;

    const cDir = new THREE.Vector3();
    let cx = r.x, cz = r.z;

    if (r.dir === 'x') {
        cDir.x = Math.random() > 0.5 ? 1 : -1;
        cx = r.x + (Math.random() - 0.5) * r.w;
        cz = r.z + (cDir.x > 0 ? 2 : -2);
    } else {
        cDir.z = Math.random() > 0.5 ? 1 : -1;
        cz = r.z + (Math.random() - 0.5) * r.d;
        cx = r.x + (cDir.z > 0 ? -2 : 2);
    }

    const carMat = new THREE.MeshLambertMaterial({ color: carColors[Math.floor(Math.random() * carColors.length)] });
    const matDark = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const matHeadlight = new THREE.MeshBasicMaterial({ color: 0xffffee });
    const matTaillight = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const matWheel = new THREE.MeshLambertMaterial({ color: 0x222222 });

    const g = new THREE.Group();
    g.position.set(cx, 0.5, cz);

    const chassi = createVoxel(0, 0.4, 0, 2.6, 0.8, 5.2, carMat);
    const cabine = createVoxel(0, 1.25, -0.4, 2.2, 0.9, 2.6, matWindows);
    const teto = createVoxel(0, 1.7, -0.4, 2.2, 0.1, 2.4, carMat);
    const bumperF = createVoxel(0, 0.2, 2.65, 2.4, 0.4, 0.3, matDark);
    const bumperR = createVoxel(0, 0.2, -2.65, 2.4, 0.4, 0.3, matDark);
    const hL = createVoxel(-0.9, 0.6, 2.61, 0.6, 0.3, 0.1, matHeadlight);
    const hR = createVoxel(0.9, 0.6, 2.61, 0.6, 0.3, 0.1, matHeadlight);
    const tL = createVoxel(-0.9, 0.6, -2.61, 0.6, 0.3, 0.1, matTaillight);
    const tR = createVoxel(0.9, 0.6, -2.61, 0.6, 0.3, 0.1, matTaillight);
    const spL = createVoxel(-0.9, 0.9, -2.3, 0.1, 0.4, 0.2, matDark);
    const spR = createVoxel(0.9, 0.9, -2.3, 0.1, 0.4, 0.2, matDark);
    const spW = createVoxel(0, 1.15, -2.3, 2.4, 0.1, 0.6, carMat);
    const wFL = createVoxel(-1.35, 0.3, 1.5, 0.4, 0.8, 0.8, matWheel);
    const wFR = createVoxel(1.35, 0.3, 1.5, 0.4, 0.8, 0.8, matWheel);
    const wBL = createVoxel(-1.35, 0.3, -1.5, 0.4, 0.8, 0.8, matWheel);
    const wBR = createVoxel(1.35, 0.3, -1.5, 0.4, 0.8, 0.8, matWheel);

    g.add(chassi, cabine, teto, bumperF, bumperR, hL, hR, tL, tR, spL, spR, spW, wFL, wFR, wBL, wBR);
    scene.add(g);

    if (cDir.lengthSq() > 0) g.lookAt(g.position.clone().add(cDir));
    else cDir.set(1, 0, 0);

    cars.push({ mesh: g, dir: cDir, speed: 10, maxSpeed: 10 + Math.random() * 10 });
}

// --- Helicóptero ---
export const heli = new THREE.Group();
heli.position.set(0, 12, -40);

const heliH = createVoxel(0, 6, -40, 6, 12, 6, matRoad);
collidables.push(new THREE.Box3().setFromObject(heliH));

// Escadas para o heliporto
for (let i = 0; i < 12; i++) {
    const stair = createVoxel(0, i + 0.5, -34 - i * 0.3, 2, 1, 1, matRoad);
    collidables.push(new THREE.Box3().setFromObject(stair));
}

const hBody = createVoxel(0, 1, 0, 2, 2, 4, new THREE.MeshLambertMaterial({ color: 0x222222 }));
export const hRotor = createVoxel(0, 2.2, 0, 8, 0.1, 0.5, new THREE.MeshLambertMaterial({ color: 0xdddddd }));
const hTail = createVoxel(0, 1, 3, 0.5, 1, 3, new THREE.MeshLambertMaterial({ color: 0x222222 }));
heli.add(hBody, hRotor, hTail);
scene.add(heli);

export let isHeliOn = false;
export let heliVelocity = new THREE.Vector3();

/**
 * Atualiza carros NPC (IA, colisão, semáforo, respawn).
 */
export function updateCars(dt, currentVehicle) {
    for (let i = cars.length - 1; i >= 0; i--) {
        const c = cars[i];
        if (c.destroyed) {
            scene.remove(c.mesh);
            cars.splice(i, 1);
            continue;
        }
        if (c === currentVehicle) continue;

        let stop = false;
        trafficLights.forEach(tl => {
            if (Math.abs(c.mesh.position.x - tl.x) < 8 &&
                Math.abs(c.mesh.position.z - tl.z) < 8 &&
                tl.state === 'red') stop = true;
        });

        if (!stop) {
            const oldPos = c.mesh.position.clone();
            c.mesh.position.addScaledVector(c.dir, c.speed * dt);

            const carBox = new THREE.Box3().setFromObject(c.mesh);
            let hitBuilding = false;
            for (const col of collidables) {
                if (checkCollision(carBox, col)) { hitBuilding = true; break; }
            }

            let hitNPC = false;
            for (let j = 0; j < cars.length; j++) {
                const other = cars[j];
                if (i !== j && other !== currentVehicle && !other.destroyed) {
                    const otherBox = new THREE.Box3().setFromObject(other.mesh);
                    const shrink = new THREE.Vector3(-0.3, 0, -0.3);
                    carBox.expandByVector(shrink);
                    otherBox.expandByVector(shrink);
                    if (checkCollision(carBox, otherBox)) {
                        hitNPC = true;
                        other.destroyed = true;
                        createExplosion(other.mesh.position.x, other.mesh.position.y, other.mesh.position.z);
                        break;
                    }
                }
            }

            if (hitBuilding) {
                c.mesh.position.copy(oldPos);
                c.dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
                c.mesh.lookAt(c.mesh.position.clone().add(c.dir));
            } else if (hitNPC) {
                createExplosion(c.mesh.position.x, c.mesh.position.y, c.mesh.position.z);
                scene.remove(c.mesh);
                c.destroyed = true;
                spawnCar(); spawnCar();
            }
        }

        // Loop mundo
        if (Math.abs(c.mesh.position.x) > CITY_SIZE / 2) c.mesh.position.x *= -0.9;
        if (Math.abs(c.mesh.position.z) > CITY_SIZE / 2) c.mesh.position.z *= -0.9;
    }
}

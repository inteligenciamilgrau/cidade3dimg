// =====================================================================
// entities/projectiles.js — Balas, ricochete e tiro
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel, checkCollision } from '../core/voxel.js';
import { collidables } from '../world/city.js';
import { npcs, spawnNPC } from './npcs.js';
import { cars, spawnCar } from './vehicles.js';
import { createExplosion } from '../systems/collisions.js';

export const bullets = [];

/**
 * Dispara uma bala a partir da posição do jogador/veículo para a
 * direção em que a câmera está apontando.
 */
export function fireBullet(sourcePosition, cameraQuaternion) {
    const startPos = sourcePosition.clone();
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraQuaternion);
    const bullet = createVoxel(
        startPos.x, startPos.y, startPos.z,
        0.2, 0.2, 0.2,
        new THREE.MeshBasicMaterial({ color: 0xffff00 }),
        false, false
    );
    bullets.push({ mesh: bullet, dir: dir.normalize(), life: 5, bounces: 0 });
}

/**
 * Atualiza todas as balas ativas (movimento, colisão, ricochete).
 */
export function updateBullets(dt, currentVehicle) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.life -= dt;
        b.mesh.position.addScaledVector(b.dir, 50 * dt);

        let removed = false;
        const bBox = new THREE.Box3().setFromObject(b.mesh);

        // Acerta NPC
        npcs.forEach((n, idx) => {
            if (!removed && checkCollision(bBox, new THREE.Box3().setFromObject(n.mesh))) {
                createExplosion(n.mesh.position.x, n.mesh.position.y, n.mesh.position.z);
                scene.remove(n.mesh); npcs.splice(idx, 1); spawnNPC(n.isSpc);
                removed = true;
            }
        });

        // Acerta Carro
        cars.forEach((c, idx) => {
            if (!removed && c !== currentVehicle && checkCollision(bBox, new THREE.Box3().setFromObject(c.mesh))) {
                createExplosion(c.mesh.position.x, c.mesh.position.y, c.mesh.position.z);
                scene.remove(c.mesh); cars.splice(idx, 1); spawnCar();
                removed = true;
            }
        });

        // Ricochete no chão
        if (!removed && b.mesh.position.y <= 0) {
            b.dir.y *= -1;
            b.bounces++;
        }
        // Ricochete em collidables
        collidables.forEach(col => {
            if (!removed && checkCollision(bBox, col)) {
                b.dir.negate();
                b.bounces++;
            }
        });

        if (b.bounces > 3 || b.life <= 0 || removed) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}

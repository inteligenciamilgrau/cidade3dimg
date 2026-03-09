// =====================================================================
// systems/collisions.js — collidables, explosões e partículas
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel } from '../core/voxel.js';
import { showMsg } from '../core/voxel.js';

export const particles = [];

/**
 * Cria uma explosão visual de partículas e adiciona bônus de tempo.
 * @param {number} x,y,z - posição da explosão
 * @param {object} gameState - { timeLeft, timerActive } (mutável pelo caller)
 */
export function createExplosion(x, y, z, gameState = null) {
    if (gameState && gameState.timerActive) gameState.timeLeft += 5;
    if (gameState) showMsg("+5s Explosão!");

    for (let i = 0; i < 20; i++) {
        const p = createVoxel(
            x, y, z, 0.5, 0.5, 0.5,
            new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xffaa00 : 0xff0000 }),
            false, false
        );
        particles.push({
            mesh: p,
            vx: (Math.random() - 0.5) * 20,
            vy: Math.random() * 20,
            vz: (Math.random() - 0.5) * 20,
            life: 1
        });
    }
}

/**
 * Atualiza a física das partículas de explosão.
 */
export function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.vy -= 40 * dt;
        if (p.life <= 0) {
            scene.remove(p.mesh);
            particles.splice(i, 1);
        }
    }
}

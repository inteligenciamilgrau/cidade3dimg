// =====================================================================
// systems/minimap.js — Desenho do minimapa circular
// =====================================================================
import { npcs } from '../entities/npcs.js';
import { heli } from '../entities/vehicles.js';
import { roads } from '../world/city.js';
import { chBase, geminiSign } from '../world/landmarks.js';

const ctxMinimap = document.getElementById('minimap').getContext('2d');

/**
 * Desenha o minimapa a cada frame.
 * @param {THREE.Object3D} pObj - jogador ou veículo ativo
 * @param {number}         yaw  - rotação atual da câmera
 */
export function drawMinimap(pObj, yaw) {
    ctxMinimap.clearRect(0, 0, 150, 150);
    ctxMinimap.save();
    ctxMinimap.translate(75, 75);
    ctxMinimap.rotate(yaw);

    const px = pObj.position.x;
    const pz = pObj.position.z;

    // Ruas
    ctxMinimap.fillStyle = '#555';
    roads.forEach(r => {
        const rx = r.x - px, rz = r.z - pz;
        ctxMinimap.fillRect(rx * 0.5 - r.w * 0.25, rz * 0.5 - r.d * 0.25, r.w * 0.5, r.d * 0.5);
    });

    // Jogador (centro)
    ctxMinimap.fillStyle = '#fff';
    ctxMinimap.beginPath(); ctxMinimap.arc(0, 0, 3, 0, 7); ctxMinimap.fill();

    // Objetivos de missão
    npcs.forEach(n => {
        if (!n.isSpc || !n.marker?.visible) return;
        const nx = n.mesh.position.x - px;
        const nz = n.mesh.position.z - pz;
        const isGreen = n.marker.material.color.getHex() === 0x00ff00;
        ctxMinimap.fillStyle = isGreen ? '#00ff00' : '#ffff00';
        ctxMinimap.strokeStyle = '#000000';
        ctxMinimap.lineWidth = 1;
        ctxMinimap.beginPath();
        if (isGreen) {
            ctxMinimap.arc(nx * 0.5, nz * 0.5, 5, 0, Math.PI * 2);
            ctxMinimap.fill(); ctxMinimap.stroke();
        } else {
            ctxMinimap.rect(nx * 0.5 - 4, nz * 0.5 - 4, 8, 8);
            ctxMinimap.fill(); ctxMinimap.stroke();
        }
    });

    // Helicóptero (quadrado azul)
    const hx = heli.position.x - px, hz = heli.position.z - pz;
    ctxMinimap.fillStyle = '#0000ff';
    ctxMinimap.fillRect(hx * 0.5 - 3, hz * 0.5 - 3, 6, 6);

    // Cristo Redentor (cruz branca)
    const cx = chBase.position.x - px, cz = chBase.position.z - pz;
    ctxMinimap.fillStyle = '#ffffff';
    ctxMinimap.fillRect(cx * 0.5 - 1, cz * 0.5 - 4, 2, 8);
    ctxMinimap.fillRect(cx * 0.5 - 4, cz * 0.5 - 1, 8, 2);

    // Placa Gemini (retângulo azul Google)
    const gx = geminiSign.position.x - px, gz = geminiSign.position.z - pz;
    ctxMinimap.fillStyle = '#4285F4';
    ctxMinimap.fillRect(gx * 0.5 - 3, gz * 0.5 - 1.5, 6, 3);

    ctxMinimap.restore();
}

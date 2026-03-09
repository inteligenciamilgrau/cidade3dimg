// =====================================================================
// world/trafficLights.js — Ciclo de semáforos (green → yellow → red)
// =====================================================================
import { trafficLights } from './city.js';

/**
 * Atualiza todos os semáforos a cada frame.
 * @param {number} dt - delta time em segundos
 */
export function updateTrafficLights(dt) {
    trafficLights.forEach(tl => {
        tl.timer -= dt;
        if (tl.timer <= 0) {
            if (tl.state === 'green') {
                tl.state = 'yellow';
                tl.timer = 2;
            } else if (tl.state === 'yellow') {
                tl.state = 'red';
                tl.timer = 5 + Math.random() * 5;
            } else {
                tl.state = 'green';
                tl.timer = 5 + Math.random() * 5;
            }
            tl.redObj.material.color.setHex(tl.state === 'red' ? 0xff0000 : 0x440000);
            tl.yellowObj.material.color.setHex(tl.state === 'yellow' ? 0xffcc00 : 0x444400);
            tl.greenObj.material.color.setHex(tl.state === 'green' ? 0x00ff00 : 0x004400);
        }
    });
}

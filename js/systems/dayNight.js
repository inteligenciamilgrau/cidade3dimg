// =====================================================================
// systems/dayNight.js — Ciclo dia/noite e iluminação ambiente
// =====================================================================
import { scene, ambientLight, dirLight } from '../core/renderer.js';
import { trafficLights } from '../world/city.js';

export let dayTime = 0;

/**
 * Avança o ciclo dia/noite.
 * @param {number} dt - delta time em segundos
 */
export function updateDayNight(dt) {
    dayTime += dt * 0.1;
    const lightY = Math.sin(dayTime) * 100;
    dirLight.position.y = lightY;
    dirLight.position.x = Math.cos(dayTime) * 100;

    if (lightY < 0) {
        scene.background.setHex(0x000011);   // Noite
        ambientLight.intensity = 0.35;
        dirLight.intensity = 0;
        trafficLights.forEach(tl => tl.pointLight.intensity = 0.8);
    } else {
        scene.background.setHex(0x87CEEB);   // Dia
        ambientLight.intensity = 0.6;
        dirLight.intensity = 0.8;
        trafficLights.forEach(tl => tl.pointLight.intensity = 0);
    }
}

export { dayTime as getDayTime };

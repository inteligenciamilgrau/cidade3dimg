// =====================================================================
// systems/mission.js — Missões de entrega, score e timer
// =====================================================================
import { npcs } from '../entities/npcs.js';
import { MISSION_POINTS, MISSION_TIME_BONUS, GAME_TIME_START } from '../config.js';
import { showMsg } from '../core/voxel.js';

export let score = 0;
export let timeLeft = GAME_TIME_START;
export let timerActive = true;
export let missionState = 0; // 0=buscar, 1=entregar

/**
 * Escolhe novos NPCs origem (verde) e destino (amarelo) para a missão.
 * @param {object|null} excludeNPC - NPC que acabou de receber (não sortear de novo)
 */
export function pickNewMission(excludeNPC = null) {
    const specials = npcs.filter(n => n.isSpc && n !== excludeNPC);
    specials.sort(() => Math.random() - 0.5);
    npcs.forEach(n => { if (n.isSpc && n.marker) n.marker.visible = false; });
    if (specials.length >= 2) {
        specials[0].marker.visible = true;
        specials[0].marker.material.color.setHex(0x00ff00);
        specials[1].marker.visible = true;
        specials[1].marker.material.color.setHex(0xffff00);
    }
}

/**
 * Verifica se o jogador está próximo de um NPC de missão.
 * @param {THREE.Object3D} pObj - jogador ou veículo ativo
 * @param {object} state - objeto mutável com { carryingTarget, handObj, timeLeft, timerActive }
 * @param {Function} onScore - callback chamado ao pontuar
 */
export function checkMission(pObj, state, onScore) {
    npcs.forEach(n => {
        if (!n.isSpc || pObj.position.distanceTo(n.mesh.position) >= 8) return;

        const isGreen = n.marker?.visible && n.marker.material.color.getHex() === 0x00ff00;
        const isYellow = n.marker?.visible && n.marker.material.color.getHex() === 0xffff00;

        if (missionState === 0 && isGreen) {
            missionState = 1;
            state.carryingTarget = true;
            state.handObj.visible = true;
            n.marker.visible = false;
            showMsg("Objeto pego! Leve ao destino AMARELO!");
        } else if (missionState === 1 && isYellow) {
            missionState = 0;
            state.carryingTarget = false;
            state.handObj.visible = false;
            score += MISSION_POINTS;
            if (state.timerActive) state.timeLeft += MISSION_TIME_BONUS;
            document.getElementById('score').innerText = score;
            showMsg(`+${MISSION_POINTS} Pontos! +${MISSION_TIME_BONUS} Segundos!`);
            pickNewMission(n);
            onScore?.();
        }
    });
}

/**
 * Decrementa o timer e atualiza o display. Retorna true se o tempo acabou.
 */
export function tickTimer(dt, state) {
    if (!state.timerActive || state.health <= 0) return false;
    state.timeLeft -= dt;
    const m = Math.floor(state.timeLeft / 60);
    const s = Math.floor(state.timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('time').innerText = `${m}:${s}`;
    return state.timeLeft <= 0;
}

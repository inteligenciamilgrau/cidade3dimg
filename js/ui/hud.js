// =====================================================================
// ui/hud.js — HUD: saúde, timer toggle e game over
// =====================================================================
import { showMsg } from '../core/voxel.js';

export let health = 3;

export function updateHealthDisplay() {
    document.getElementById('health').innerText = '❤️'.repeat(Math.max(0, health));
}

export function gameOver(reason, score) {
    document.getElementById('hud').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('gameOverMsg').innerText = reason + " | Pontos: " + score;
    document.exitPointerLock();
}

export function setupTimerToggle(state) {
    document.getElementById('timerToggle').addEventListener('change', (e) => {
        state.timerActive = e.target.checked;
    });
}

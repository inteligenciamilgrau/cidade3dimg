// =====================================================================
// ui/screens.js — Start Screen, Config Screen e integração com pointer lock
// =====================================================================

/**
 * Configura os eventos de todas as telas de menu.
 * @param {object} callbacks
 *   .onStart()       - chamado ao entrar no jogo
 *   .onSaveConfig()  - chamado ao salvar configurações
 */
export function setupScreens(callbacks = {}) {
    // Botão Jogar
    document.getElementById('startBtn').addEventListener('click', () => {
        document.body.requestPointerLock();
        callbacks.onStart?.();
    });

    // Config Screen
    document.getElementById('openConfigBtn').addEventListener('click', () => {
        document.getElementById('configScreen').style.display = 'flex';
    });

    document.getElementById('closeConfigBtn').addEventListener('click', () => {
        const npcMode = document.getElementById('npcModeToggle').checked;
        localStorage.setItem('npcMode', npcMode);

        const apiKeyInput = document.getElementById('geminiApiKey').value.trim();
        callbacks.onSaveConfig?.({ npcMode, apiKey: apiKeyInput });

        document.getElementById('configScreen').style.display = 'none';
    });

    // Limpar histórico
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja apagar o histórico de todas as conversas?')) {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('chatHistory_')) localStorage.removeItem(key);
            });
            localStorage.removeItem('phoneContacts');
            callbacks.onClearHistory?.();
            alert('Histórico e agenda limpos!');
        }
    });

    // Restaurar estado salvo do npcMode
    const savedNpcMode = localStorage.getItem('npcMode') === 'true';
    document.getElementById('npcModeToggle').checked = savedNpcMode;
}

export function showPauseScreen() {
    document.getElementById('startScreen').style.display = 'flex';
    document.querySelector('#startScreen h1').innerText = "PAUSADO";
}

export function hidePauseScreen() {
    document.getElementById('startScreen').style.display = 'none';
}

export function showRespawnScreen() {
    document.getElementById('respawnScreen').style.display = 'block';
    if (document.exitPointerLock) document.exitPointerLock();
}

export function hideRespawnScreen() {
    document.getElementById('respawnScreen').style.display = 'none';
    if (document.body.requestPointerLock) document.body.requestPointerLock();
}

export function setupRespawnEvents(onConfirm, onCancel) {
    document.getElementById('respawnConfirmBtn').addEventListener('click', () => {
        hideRespawnScreen();
        onConfirm();
    });
    document.getElementById('respawnCancelBtn').addEventListener('click', () => {
        hideRespawnScreen();
        if (onCancel) onCancel();
    });
}

// ==== MAPA (TAB) ====
let mapActive = false;

export function toggleMap(monumentData) {
    const map = document.getElementById('mapOverlay');
    mapActive = !mapActive;
    map.style.display = mapActive ? 'block' : 'none';
    
    if (mapActive) {
        setupMapGrid(monumentData);
    }
}

function setupMapGrid(monumentData) {
    const grid = document.getElementById('mapGrid');
    grid.innerHTML = '';
    
    for (let row = 1; row <= 5; row++) {
        for (let col = 1; col <= 5; col++) {
            const key = `${col}_${row}`;
            const data = monumentData[key];
            const cell = document.createElement('div');
            
            cell.style.cssText = `
                background: ${data ? 'rgba(111, 211, 255, 0.1)' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${data ? '#6fd3ff' : '#333'};
                border-radius: 8px;
                padding: 10px;
                min-height: 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-size: 11px;
            `;
            
            if (data) {
                cell.innerHTML = `
                    <div style="font-size:24px; margin-bottom:5px;">${data.icon}</div>
                    <div style="font-weight:bold; color:#fff;">${data.name}</div>
                    <div style="color:#6fd3ff; font-size:9px; margin-top:3px;">${data.model}</div>
                `;
            } else {
                cell.innerHTML = `<div style="color:#444;">${col}_${row}</div>`;
            }
            grid.appendChild(cell);
        }
    }
}

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

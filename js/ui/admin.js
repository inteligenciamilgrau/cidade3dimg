// =====================================================================
// ui/admin.js — Painel de controle admin: logs de chat e edição de backstory
// =====================================================================
import { npcs, persistentNpcs } from '../entities/npcs.js';

export let adminOpen = false;

export function openAdminPanel() {
    adminOpen = true;
    document.getElementById('adminScreen').style.display = 'flex';
    document.exitPointerLock();
    document.getElementById('adminChatView').style.display = 'none';
    document.getElementById('adminListView').style.display = 'flex';

    const list = document.getElementById('adminContactsList');
    list.innerHTML = '';
    let foundAny = false;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('chatHistory_')) continue;
        foundAny = true;
        const phoneNum = key.replace('chatHistory_', '');
        const npcIdx = (parseInt(phoneNum) - 10).toString();
        let npcName = "Desconhecido";
        if (persistentNpcs[npcIdx]) npcName = persistentNpcs[npcIdx].name;
        else { const f = npcs.find(n => n.phone == phoneNum); if (f) npcName = f.data.name; }

        const div = document.createElement('div');
        div.style.cssText = 'background:#333;padding:10px;border-radius:5px;display:flex;justify-content:space-between;align-items:center;';
        const info = document.createElement('div');
        info.innerHTML = `<strong style="color:#0f0;">${npcName}</strong> <span style="font-size:12px;color:#888;">(${phoneNum})</span>`;
        const btn = document.createElement('button');
        btn.innerText = 'Ver Chat / Editar';
        btn.style.cssText = 'background:#00f;color:#fff;border:none;border-radius:3px;padding:8px 12px;cursor:pointer;pointer-events:auto;';
        btn.onclick = () => adminOpenChat(phoneNum, npcName);
        div.append(info, btn);
        list.appendChild(div);
    }

    if (!foundAny) {
        list.innerHTML = '<p style="color:#f0a;">Nenhum histórico de chat encontrado. Converse com algum NPC primeiro.</p>';
    }
}

export function closeAdminPanel() {
    adminOpen = false;
    document.getElementById('adminScreen').style.display = 'none';
    document.body.requestPointerLock();
}

function adminOpenChat(targetNum, targetName) {
    document.getElementById('adminListView').style.display = 'none';
    document.getElementById('adminChatView').style.display = 'flex';
    document.getElementById('adminNpcName').innerText = targetName;
    document.getElementById('adminTargetPhone').value = targetNum;

    const logs = document.getElementById('adminLogs');
    logs.innerHTML = '';
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem('chatHistory_' + targetNum)) || []; } catch (e) { }
    if (hist.length === 0) {
        logs.innerHTML = '<div style="color:#666;text-align:center;">Vazio</div>';
    } else {
        hist.forEach(msg => {
            const div = document.createElement('div');
            div.style.cssText = `padding:6px;border-radius:5px;background:${msg.role === 'user' ? '#113311' : '#333'};color:#ddd;border-left:4px solid ${msg.role === 'user' ? '#0f0' : '#aaa'};`;
            div.innerText = `${msg.role === 'user' ? 'Você' : (msg.name || targetNum)}: ${msg.text}`;
            logs.appendChild(div);
        });
    }
    logs.scrollTop = logs.scrollHeight;

    const idx = (parseInt(targetNum) - 10).toString();
    const pData = persistentNpcs[idx];
    if (pData) {
        document.getElementById('adminBackstoryInput').value = pData.backstory;
    } else {
        const fNpc = npcs.find(n => n.phone == targetNum);
        document.getElementById('adminBackstoryInput').value = fNpc ? fNpc.data.backstory : "História não encontrada.";
    }
}

export function setupAdminEvents() {
    document.getElementById('adminBtn').addEventListener('click', openAdminPanel);
    document.getElementById('closeAdminBtn').addEventListener('click', closeAdminPanel);
    document.getElementById('adminBackBtn').addEventListener('click', () => {
        document.getElementById('adminChatView').style.display = 'none';
        document.getElementById('adminListView').style.display = 'flex';
    });
    document.getElementById('adminSaveConfigBtn').addEventListener('click', () => {
        const targetNum = document.getElementById('adminTargetPhone').value;
        const newBs = document.getElementById('adminBackstoryInput').value.trim();
        const idx = (parseInt(targetNum) - 10).toString();
        if (persistentNpcs[idx]) {
            persistentNpcs[idx].backstory = newBs;
            localStorage.setItem('gameNpcsData', JSON.stringify(persistentNpcs));
            const fNpc = npcs.find(n => n.phone == targetNum);
            if (fNpc) fNpc.data.backstory = newBs;
            const btn = document.getElementById('adminSaveConfigBtn');
            const old = btn.innerText;
            btn.innerText = "Salvo!"; btn.style.background = "#0f0";
            setTimeout(() => { btn.innerText = old; btn.style.background = "#0a0"; }, 1000);
        } else {
            console.error("Erro ao localizar ID desse NPC (" + idx + ").");
        }
    });
}

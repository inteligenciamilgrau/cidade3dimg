// =====================================================================
// ui/phone.js — UI do celular: agenda de contatos e chat
// =====================================================================
import { npcs, persistentNpcs } from '../entities/npcs.js';
import { askGemini } from '../api/gemini.js';

export let phoneContacts = [];
try { phoneContacts = JSON.parse(localStorage.getItem('phoneContacts')) || []; } catch (e) { }

export function renderChatHistory(targetNum) {
    const logs = document.getElementById('phoneLogs');
    logs.innerHTML = '<div style="font-size:12px;color:#666;text-align:center;">Inicie a conversa</div>';
    if (!targetNum) return;

    let hist = [];
    try { hist = JSON.parse(localStorage.getItem('chatHistory_' + targetNum)) || []; } catch (e) { }

    hist.forEach(msg => {
        const div = document.createElement('div');
        div.style.padding = '8px'; div.style.borderRadius = '10px';
        div.style.maxWidth = '80%'; div.style.fontSize = '14px';
        if (msg.role === 'user') {
            div.style.alignSelf = 'flex-end'; div.style.background = '#dcf8c6'; div.style.color = '#000';
            div.innerText = msg.text;
        } else {
            div.style.alignSelf = 'flex-start'; div.style.background = '#fff'; div.style.color = '#000';
            div.innerText = `${msg.name || targetNum}: ${msg.text}`;
        }
        logs.appendChild(div);
    });
    logs.scrollTop = logs.scrollHeight;
}

export function openChat(targetNum, targetName) {
    document.getElementById('agendaView').style.display = 'none';
    document.getElementById('chatView').style.display = 'flex';
    document.getElementById('phoneTarget').value = targetNum;
    document.getElementById('chatTitle').innerText = targetName || targetNum;
    renderChatHistory(targetNum);
}

export function closeChat() {
    document.getElementById('chatView').style.display = 'none';
    document.getElementById('agendaView').style.display = 'flex';
}

export function renderContacts() {
    const list = document.getElementById('contactsList');
    list.innerHTML = '';
    if (phoneContacts.length === 0) {
        list.innerHTML = '<div style="font-size:12px;color:#666;text-align:center;">Nenhum contato salvo ainda.</div>';
        return;
    }
    phoneContacts.forEach(contact => {
        const div = document.createElement('div');
        div.style.cssText = 'background:#fff;padding:8px;border-radius:5px;display:flex;justify-content:space-between;align-items:center;';
        const info = document.createElement('div');
        info.innerHTML = `<strong>${contact.name}</strong><br><span style="font-size:12px;color:#666;">(${contact.phone})</span>`;
        const btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:5px;';
        const btnChat = document.createElement('button');
        btnChat.innerText = 'Chat'; btnChat.style.cssText = 'background:#0a0;color:#fff;border:none;border-radius:3px;padding:5px;cursor:pointer;pointer-events:auto;';
        btnChat.onclick = () => openChat(contact.phone, contact.name);
        const btnDel = document.createElement('button');
        btnDel.innerText = 'X'; btnDel.style.cssText = 'background:#f00;color:#fff;border:none;border-radius:3px;padding:5px;cursor:pointer;pointer-events:auto;';
        btnDel.onclick = () => {
            phoneContacts = phoneContacts.filter(c => c.phone !== contact.phone);
            localStorage.setItem('phoneContacts', JSON.stringify(phoneContacts));
            renderContacts();
        };
        btns.append(btnChat, btnDel);
        div.append(info, btns);
        list.appendChild(div);
    });
}

export function setupPhoneEvents() {
    renderContacts();
    document.getElementById('backToAgendaBtn').addEventListener('click', closeChat);

    document.getElementById('addContactBtn').addEventListener('click', () => {
        const phone = document.getElementById('addContactPhone').value.trim();
        if (!phone) return;
        if (phoneContacts.some(c => c.phone === phone)) { alert("Contato já está na lista!"); return; }
        const foundNpc = npcs.find(n => n.phone == phone);
        phoneContacts.push({ phone, name: foundNpc ? foundNpc.data.name : "Desconhecido" });
        localStorage.setItem('phoneContacts', JSON.stringify(phoneContacts));
        document.getElementById('addContactPhone').value = '';
        renderContacts();
    });

    document.getElementById('phoneSendBtn').addEventListener('click', async () => {
        const targetNum = document.getElementById('phoneTarget').value.trim();
        const msgText = document.getElementById('phoneMsg').value.trim();
        if (!targetNum || !msgText) return;

        let hist = [];
        try { hist = JSON.parse(localStorage.getItem('chatHistory_' + targetNum)) || []; } catch (e) { }
        hist.push({ role: 'user', text: msgText });
        localStorage.setItem('chatHistory_' + targetNum, JSON.stringify(hist));
        renderChatHistory(targetNum);
        document.getElementById('phoneMsg').value = '';

        const foundNpc = npcs.find(n => n.phone == targetNum);
        const npcData = foundNpc ? foundNpc.data : { name: "Desconhecido", backstory: "Um número misterioso." };
        const npcMode = document.getElementById('npcModeToggle').checked;

        // Indicador "digitando..."
        const logs = document.getElementById('phoneLogs');
        const thinkDiv = document.createElement('div');
        thinkDiv.id = 'thinkingDiv';
        thinkDiv.style.cssText = 'align-self:flex-start;background:#fff;padding:8px;border-radius:10px;max-width:80%;color:#888;font-style:italic;';
        thinkDiv.innerText = "Digitando...";
        logs.appendChild(thinkDiv); logs.scrollTop = logs.scrollHeight;

        let replyText;
        if (npcMode) {
            replyText = await askGemini(npcData, msgText, hist);
        } else {
            await new Promise(r => setTimeout(r, 1000));
            if (foundNpc) {
                const respostas = ["Oi! Tudo bem?", "Estou ocupado agora, desculpe.", "Que cidade legal, né?", "Cuidado com os carros!", "Gostei de falar com você!"];
                replyText = respostas[Math.floor(Math.random() * respostas.length)];
            } else {
                replyText = "Sistema: Número não encontrado.";
                npcData.name = "Sistema";
            }
        }

        document.getElementById('thinkingDiv')?.remove();
        hist.push({ role: 'npc', name: npcData.name, text: replyText });
        localStorage.setItem('chatHistory_' + targetNum, JSON.stringify(hist));
        renderChatHistory(targetNum);

        if (foundNpc?.talkingIndicator) {
            foundNpc.jumpTimer = Math.PI;
            foundNpc.talkingIndicator.visible = true;
            if (foundNpc.talkTimeout) clearTimeout(foundNpc.talkTimeout);
            foundNpc.talkTimeout = setTimeout(() => { foundNpc.talkingIndicator.visible = false; }, 4000);
        }
    });

    document.getElementById('phoneMsg').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('phoneSendBtn').click();
    });
}

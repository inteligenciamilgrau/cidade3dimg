// =====================================================================
// api/gemini.js — Integração com a API Gemini (ou backend futuro)
// =====================================================================

/**
 * Envia uma mensagem para o NPC via Gemini API e retorna a resposta.
 *
 * Para integrar com um backend próprio, basta trocar `GEMINI_API_URL`
 * pela URL da sua rota (ex: '/api/chat') e ajustar o body/response.
 *
 * @param {object} npc         - { name, backstory }
 * @param {string} userText    - mensagem do jogador
 * @param {Array}  chatHistory - histórico anterior [{ role, text }]
 * @returns {Promise<string>}  - resposta do NPC
 */
export async function askGemini(npc, userText, chatHistory) {
    const apiKey = document.getElementById('geminiApiKey').value.trim();
    if (!apiKey) return "Erro: Chave API do Gemini não configurada! Verifique as configurações.";

    // ---------------------------------------------------------------
    // 🔁 PONTO DE INTEGRAÇÃO COM BACKEND
    // Para usar um backend, substitua estas linhas:
    //   const url  = `/api/chat`;
    //   const body = JSON.stringify({ npcPhone: npc.phone, npcName: npc.name,
    //                                 backstory: npc.backstory, userText, chatHistory });
    // ---------------------------------------------------------------
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    const systemInstruction = `Você é um NPC neste jogo. Seu nome é ${npc.name}. Sua história: ${npc.backstory}. Responda à mensagem do jogador de forma curta (máx 2 frases), natural e mantendo o personagem.`;

    // Monta o histórico multi-turn
    const contents = chatHistory.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: userText }] });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro da API do Gemini:", response.status, errorText);
            return `Erro da API ${response.status}: O nome do modelo pode estar errado ou a API Key é inválida.`;
        }

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        return "Erro na resposta da API.";
    } catch (err) {
        console.error("Erro no fetch:", err);
        return "Erro ao conectar com a API Gemini.";
    }
}

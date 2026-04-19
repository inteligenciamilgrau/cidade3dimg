# -*- coding: utf-8 -*-
import os, glob, re

blocks_dir = "blocks"
template_func = """
        // === FUNÇÃO PADRÃO DE PLACA ===
        function createSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');
            c2.fillStyle = '#0f1720';
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#6fd3ff';
            c2.lineWidth = 10;
            c2.strokeRect(10, 10, 492, 172);
            c2.fillStyle = '#eef7ff';
            c2.font = 'bold 56px Arial';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.fillText(monumentName, 256, 78);
            c2.font = 'bold 34px Arial';
            c2.fillStyle = '#6fd3ff';
            c2.fillText(aiModel, 256, 132);
            const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(canvas) });
            const matDark = new ctx.THREE.MeshLambertMaterial({ color: 0x222222 });
            let pX = ctx.centerX - 10; // moved left to not collide with corner perfectly
            let pZ = ctx.centerZ + 12;
            ctx.createVoxel(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            ctx.createVoxel(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            let fundo = ctx.createVoxel(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            ctx.createVoxel(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));
        }
"""

for f in glob.glob(os.path.join(blocks_dir, "block_*.js")):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    monument = "MONUMENTO ALFA"
    ai = "IA DESCONHECIDA"
    if 'BURJ' in content: monument, ai = "BURJ KHALIFA", "GPT 5.4"
    elif 'Biblioteca' in content.lower() or '395' in f: monument, ai = "BIBLIOTECA TIANJIN", "AGENTE KIMI 2.5"
    elif 'Claude' in content: monument, ai = "MUSEU DE ARTE", "CLAUDE OPUS 4.6"
    elif 'GEMINI' in content: monument, ai = "TORRE COMERCIAL", "GEMINI 3.1 PRO"
    elif 'Qwen' in content: monument, ai = "TORRE QWEN", "QWEN 3.6 PLUS"
    elif '1_3' in f: monument, ai = "PREDIO MODERNO", "IA DESCONHECIDA"
    elif '2_4' in f: monument, ai = "PREDIO COMERCIAL", "GPT 4"
    elif '3_3' in f: monument, ai = "VILA CENTRAL", "CLAUDE OPUS"
    elif '4_2' in f: monument, ai = "HOTEL ELEGANTE", "LLAMA 3"

    content = content.replace("createSign();", "")
    content = content.replace("createInteriorSign();", "")
    content = content.replace("drawSignText();", "")
    
    sig1 = "function(ctx) {"
    sig2 = "function (ctx) {"
    sig = sig1 if sig1 in content else sig2
    
    if sig in content and "function createSign(monumentName, aiModel)" not in content:
        content = content.replace(sig, sig + "\n" + template_func, 1)
        
    if "createSign('" not in content:
        sub_str = "        createSign('" + monument + "', '" + ai + "');\n    };\n})();"
        content = re.sub(r'\}\s*;\s*\n*\)\(\);', sub_str, content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print('Done')

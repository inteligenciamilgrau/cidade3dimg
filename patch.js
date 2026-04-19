const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'blocks');

const createSignFunc = 
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
            let pX = ctx.centerX - 10;
            let pZ = ctx.centerZ + 12;
            ctx.createVoxel(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            ctx.createVoxel(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            let fundo = ctx.createVoxel(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            ctx.createVoxel(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));
        }
;

function processFile(file) {
    if (!file.endsWith('.js')) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Attempt logic inference for monument and AI
    let monument = "Edifício Alpha";
    let ai = "IA Desconhecida";
    if (content.match(/BURJ/i)) { monument = "BURJ KHALIFA"; ai = "GPT 5.4"; }
    else if (content.match(/Biblioteca/i)) { monument = "BIBLIOTECA TIANJIN"; ai = "Agente Kimi 2.5"; }
    else if (content.match(/Claude/i)) { monument = "MONUMENTO CLAUDE"; ai = "Claude Opus 4.6"; }
    else if (content.match(/GEMINI/i)) { monument = "MONUMENTO GEMINI"; ai = "GEMINI 3.1 PRO"; }
    else if (content.match(/Qwen/i)) { monument = "TORRE QWEN"; ai = "Qwen 3.6 Plus"; }
    else if (file.includes('3_3')) { monument = "CENTRO MUNICIPAL"; ai = "Claude Opus"; }
    else if (file.includes('4_2')) { monument = "PRÉDIO EMPRESARIAL"; ai = "Llama 3"; }
    
    // Remove all usages of canvas
    let regexCreateSign = /function\s+create(Interior)?Sign\s*\([\s\S]*?\}[ \t]*\n?/g;
    content = content.replace(regexCreateSign, '');
    
    let regexSignCalls = /createSign\s*\([^)]*\)\s*;/g;
    content = content.replace(regexSignCalls, '');
    let regexIntSignCalls = /createInteriorSign\s*\([^)]*\)\s*;/g;
    content = content.replace(regexIntSignCalls, '');

    // Add function if not present
    if (!content.includes('function createSign(monumentName, aiModel)')) {
        let insertPos = content.indexOf('function createBlock');
        if (insertPos === -1) insertPos = content.indexOf('// === PARÂMETROS');
        if (insertPos === -1) insertPos = content.indexOf('const THREE');
        if (insertPos !== -1) {
            content = content.slice(0, insertPos) + createSignFunc + content.slice(insertPos);
        } else {
            content = content.replace('(function () {', '(function () {\n' + createSignFunc);
        }
    }
    
    // If no createSign calls at the end, append one
    if (!content.includes("createSign(")) {
        content = content.replace(/\};\s*\n*\)\(\);/g, "    createSign('" + monument + "', '" + ai + "');\n    };\n})();");
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Processed ' + file);
}

fs.readdirSync(dir).forEach(file => processFile(path.join(dir, file)));

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'blocks');

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.js')) return;
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Rename the injected standard function to avoid conflicts
    content = content.replace('function createSign(monumentName, aiModel)', 'function renderStandardSign(monumentName, aiModel)');

    let monument = "MONUMENTO ALFA";
    let ai = "IA DESCONHECIDA";
    if (content.match(/BURJ/i)) { monument = "BURJ KHALIFA"; ai = "GPT 5.4"; }
    else if (content.match(/Biblioteca/i)) { monument = "BIBLIOTECA TIANJIN"; ai = "Agente Kimi 2.5"; }
    else if (content.match(/Claude/i)) { monument = "MUSEU DE ARTE"; ai = "Claude Opus 4.6"; }
    else if (content.match(/GEMINI/i)) { monument = "TORRE COMERCIAL"; ai = "GEMINI 3.1 PRO"; }
    else if (content.match(/Qwen/i)) { monument = "TORRE QWEN"; ai = "Qwen 3.6 Plus"; }
    else if (file.includes('1_3')) { monument = "PRÉDIO MODERNO"; ai = "IA DESCONHECIDA"; }
    else if (file.includes('2_4')) { monument = "PRÉDIO EMPRESARIAL"; ai = "GPT 4"; }
    else if (file.includes('3_3')) { monument = "CENTRO MUNICIPAL"; ai = "Claude Opus"; }
    else if (file.includes('4_2')) { monument = "HOTEL ELEGANTE"; ai = "Llama 3"; }

    // If it hasn't been called yet, insert it at the very very end of the file
    // We can just look for the last closing brace and insert it right before
    if (!content.includes('renderStandardSign(')) {
        const insertCode =         renderStandardSign('', '');\n    };\n})();;
        
        // Find the last "    };\n})();" or similar
        const idx1 = content.lastIndexOf('};\n})();');
        const idx2 = content.lastIndexOf('}\n})();');
        const idx3 = content.lastIndexOf('})();');
        
        if (idx1 !== -1) {
            content = content.substring(0, idx1) + insertCode;
        } else if (idx3 !== -1) {
            content = content.substring(0, content.lastIndexOf('}') ) + \n        renderStandardSign('', '');\n    };\n})();;
        }
    }
    
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

// Also fix TEMPLATE.md
let template = fs.readFileSync(path.join(dir, 'TEMPLATE.md'), 'utf8');
template = template.replace(/function createSign/g, 'function renderStandardSign');
template = template.replace(/createSign\('Predio Exemplo'/g, "renderStandardSign('Predio Exemplo'");
fs.writeFileSync(path.join(dir, 'TEMPLATE.md'), template, 'utf8');

console.log('Fixed');

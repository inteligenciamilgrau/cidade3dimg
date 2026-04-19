import os, glob

blocks_dir = "blocks"

for f in glob.glob(os.path.join(blocks_dir, "block_*.js")):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    monument = "MONUMENTO ALFA"
    ai = "IA DESCONHECIDA"
    if 'BURJ' in content: monument, ai = "BURJ KHALIFA", "GPT 5.4"
    elif 'BIBLIOTECA' in content: monument, ai = "BIBLIOTECA TIANJIN", "Agente Kimi 2.5"
    elif 'MUSEU DE ARTE' in content or '3_4' in f: monument, ai = "MUSEU DE ARTE", "Claude Opus 4.6"
    elif 'GEMINI' in content or '4_3' in f: monument, ai = "TORRE COMERCIAL", "GEMINI 3.1 PRO"
    elif 'QWEN' in content or '1_4' in f: monument, ai = "TORRE QWEN", "Qwen 3.6 Plus"
    elif '1_3' in f: monument, ai = "PREDIO MODERNO", "IA DESCONHECIDA"
    elif '2_4' in f: monument, ai = "PREDIO EMPRESARIAL", "GPT 4"
    elif '3_3' in f: monument, ai = "VILA CENTRAL", "Claude Opus"
    elif '4_2' in f: monument, ai = "HOTEL ELEGANTE", "Llama 3"

    if "renderStandardSign(" not in content.split("function renderStandardSign")[-1]:
        # just replace the last occurrence of "})();"
        idx = content.rfind("})();")
        if idx != -1:
            idx_brace = content.rfind("};", 0, idx)
            if idx_brace != -1:
                content = content[:idx_brace] + "    renderStandardSign('" + monument + "', '" + ai + "');\n    };\n})();"

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print('Fixed end of file')

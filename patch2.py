import os, glob

blocks_dir = "blocks"

for f in glob.glob(os.path.join(blocks_dir, "block_*.js")):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # Rename the function
    content = content.replace("function createSign(monumentName, aiModel)", "function renderStandardSign(monumentName, aiModel)")

    monument = "MONUMENTO ALFA"
    ai = "IA DESCONHECIDA"
    if 'BURJ' in content: monument, ai = "BURJ KHALIFA", "GPT 5.4"
    elif 'Biblioteca' in content.lower() or '395' in f: monument, ai = "BIBLIOTECA TIANJIN", "Agente Kimi 2.5"
    elif 'Claude' in content: monument, ai = "MUSEU DE ARTE", "Claude Opus 4.6"
    elif 'GEMINI' in content: monument, ai = "TORRE COMERCIAL", "GEMINI 3.1 PRO"
    elif 'Qwen' in content: monument, ai = "TORRE QWEN", "Qwen 3.6 Plus"
    elif '1_3' in f: monument, ai = "PREDIO MODERNO", "IA DESCONHECIDA"
    elif '2_4' in f: monument, ai = "PREDIO EMPRESARIAL", "GPT 4"
    elif '3_3' in f: monument, ai = "VILA CENTRAL", "Claude Opus"
    elif '4_2' in f: monument, ai = "HOTEL ELEGANTE", "Llama 3"

    if 'renderStandardSign(' not in content:
        # replace the last "})();" block with the injected call
        idx = content.rfind('})();')
        if idx != -1:
            # find where "};" is before this
            idx_brace = content.rfind('};', 0, idx)
            if idx_brace != -1:
                content = content[:idx_brace] + f"    renderStandardSign('{monument}', '{ai}');\n    }};\n}})();"

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

with open(os.path.join(blocks_dir, "TEMPLATE.md"), 'r', encoding='utf-8') as file:
    template = file.read()
template = template.replace('function createSign', 'function renderStandardSign')
template = template.replace('createSign(', 'renderStandardSign(')
with open(os.path.join(blocks_dir, "TEMPLATE.md"), 'w', encoding='utf-8') as file:
    file.write(template)

print('Fixed calls')

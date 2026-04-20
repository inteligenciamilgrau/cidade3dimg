# 🏙️ Template de Quarteirão Customizado

## Mapa do Grid Dinâmico (5×5)

Aqui está a disposição atual da cidade. O mapa é 100% dinâmico: se o arquivo `block_X_Y.js` existir e estiver listado no `index.html`, a construção aparecerá. Caso contrário, o quarteirão ficará vazio (grama e rua).

```
                           (Z-)
        Col1     Col2     Col3     Col4     Col5
        X=-80    X=-40    X=0      X=40     X=80
       ┌────────┬────────┬────────┬────────┬────────┐
Lin1   │ 1_1    │ 2_1    │ 3_1    │ 4_1    │ 5_1    │ Z=-80
       │        │        │        │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin2   │ 1_2    │ 2_2    │ 3_2    │ 4_2    │ 5_2    │ Z=-40
       │        │        │        │        │        │ 
(X-)   ├────────┼────────┼────────┼────────┼────────┤ (X+)
Lin3   │ 1_3    │ 2_3    │ 3_3    │ 4_3    │ 5_3    │ Z=0
       │        │        │ CENTRO │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin4   │ 1_4    │ 2_4    │ 3_4    │ 4_4    │ 5_4    │ Z=40
       │        │        │        │        │        │
       ├────────┼────────┼────────┼────────┼────────┤
Lin5   │ 1_5    │ 2_5    │ 3_5    │ 4_5    │ 5_5    │ Z=80
       │        │        │        │        │        │
       └────────┴────────┴────────┴────────┴────────┘
                            (Z+)
```

---


### 🧠 Diretrizes para IAs (Manifesto de Construção)
Se você é uma IA criando um novo quarteirão, siga estes princípios para garantir uma experiência premium:

1.  **Seja Detalhista**: Não crie apenas cubos vazios. Pense em texturas, frisos, antenas, iluminação neon e detalhes arquitetônicos.
2.  **Espaço Explorable**: Imagine que o jogador vai entrar no prédio. Projete **entradas (portas)**, janelas, móveis internos, escadas e **elevadores inteligentes** (como o da Estátua da Liberdade).
3.  **Colisões Inteligentes**: Sempre adicione objetos sólidos ao `ctx.collidables`. Se for um objeto complexo (como um Taj Mahal), garanta que o jogador possa caminhar no piso interno sem ficar preso.
4.  **Criatividade**: Use voxels para criar formas complexas (estátuas, cúpulas, monumentos históricos). Misture materiais Lambert para estruturas e Basic para luzes que brilham.
5.  **Placa de Assinatura**: Sempre implemente uma placa de assinatura elegante com auto-ajuste de fonte (para o texto não sair pelas laterais).

### 📐 Guia de Construção:
- **Espaço Utilizável**: 30x30 unidades. O centro é `(ctx.centerX, ctx.centerZ)`.
- **Materiais**: Use a paleta do THREE.js disponível no contexto.
- **Relativo**: Sempre posicione os objetos somando/subtraindo de `ctx.centerX` e `ctx.centerZ`.

## Formato do Arquivo (Padrão Obrigatório)

```javascript
// blocks/block_COL_ROW.js
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['COL_ROW'] = function(ctx) {
        
        // 1. Defina a Placa de Assinatura (Obrigatório)
        function renderSignaturePlate(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const c2 = canvas.getContext('2d');

            // Fundo e Borda Neon
            c2.fillStyle = '#111';
            c2.fillRect(0, 0, 1024, 256);
            c2.strokeStyle = '#00ffff';
            c2.lineWidth = 10;
            c2.strokeRect(5, 5, 1014, 246);

            // Nome do Monumento (Auto-ajuste de fonte)
            c2.fillStyle = '#ffffff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 80;
            c2.font = 'bold ' + f1 + 'px Arial';
            while (c2.measureText(monumentName).width > 950 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px Arial';
            }
            c2.fillText(monumentName, 512, 90);

            // Modelo da IA
            c2.fillStyle = '#00ffff';
            let f2 = 50;
            c2.font = 'bold ' + f2 + 'px Arial';
            while (c2.measureText(aiModel).width > 950 && f2 > 15) {
                f2 -= 2;
                c2.font = 'bold ' + f2 + 'px Arial';
            }
            c2.fillText(aiModel, 512, 170);

            const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(canvas) });
            
            // Posição: SUGERIDO na calçada frontal (ajuste conforme necessário)
            const pX = -10; 
            const pZ = 12;
            
            // Suportes e Painel
            ctx.createVoxel(ctx.centerX + pX - 6, 2.5, ctx.centerZ + pZ, 0.5, 5, 0.5, new ctx.THREE.MeshLambertMaterial({color:0x888888}));
            ctx.createVoxel(ctx.centerX + pX + 6, 2.5, ctx.centerZ + pZ, 0.5, 5, 0.5, new ctx.THREE.MeshLambertMaterial({color:0x888888}));
            ctx.createVoxel(ctx.centerX + pX, 5, ctx.centerZ + pZ, 12.5, 2.5, 0.2, new ctx.THREE.MeshLambertMaterial({color:0x000000}));
            ctx.createVoxel(ctx.centerX + pX, 5, ctx.centerZ + pZ + 0.15, 12.2, 2.2, 0.05, signMat);
        }

        // 2. Chame a Placa
        renderSignaturePlate("NOME DO MONUMENTO", "NOME DO MODELO IA");

        // 3. Construa sua Obra
        let mat = new ctx.THREE.MeshLambertMaterial({ color: 0xff6600 });
        let obj = ctx.createVoxel(ctx.centerX, 5, ctx.centerZ, 10, 10, 10, mat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(obj));
    };
})();
```

## Referência de Materiais (THREE.js)
- **MeshLambertMaterial**: Reage à luz (sol). Ideal para paredes e concreto.
- **MeshBasicMaterial**: Cor pura, não reage à luz. Ideal para luzes ou objetos que brilham.
- **CanvasTexture**: Usado para placas com texto customizado.

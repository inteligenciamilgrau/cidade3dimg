// blocks/block_1_3.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['1_3'] = function (ctx) {

        // === FUNÇÃO PADRÃO DE PLACA ===
        function renderStandardSign(monumentName, aiModel) {
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
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 56;
            c2.font = 'bold ' + f1 + 'px Arial';
            while (c2.measureText(monumentName).width > 470 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px Arial';
            }
            c2.fillText(monumentName, 256, 78);
            
            let f2 = 34;
            c2.font = 'bold ' + f2 + 'px Arial';
            while (c2.measureText(aiModel).width > 470 && f2 > 15) {
                f2 -= 2;
                c2.font = 'bold ' + f2 + 'px Arial';
            }
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


        // === MATERIAIS ===
        const obsidian = new ctx.THREE.MeshLambertMaterial({ color: 0x0a0a12 });
        const concrete = new ctx.THREE.MeshLambertMaterial({ color: 0x444455 });
        const energyCyan = new ctx.THREE.MeshBasicMaterial({ color: 0x00ffff });
        const energyGold = new ctx.THREE.MeshBasicMaterial({ color: 0xffd700 });
        const neonPink = new ctx.THREE.MeshBasicMaterial({ color: 0xff00ff });
        const signMaterial = new ctx.THREE.MeshBasicMaterial({ color: 0x001122 }); // Fundo do Painel
        const frameMaterial = new ctx.THREE.MeshLambertMaterial({ color: 0x222222 }); // Moldura
        const floorSignMaterial = new ctx.THREE.MeshLambertMaterial({ color: 0x111111 }); // Fundo do Chão

        // === FUNDAÇÃO (Base Ziggurat) ===
        let base0 = ctx.createVoxel(ctx.centerX, 1, ctx.centerZ, 28, 2, 28, concrete);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(base0));

        let base1 = ctx.createVoxel(ctx.centerX, 3, ctx.centerZ, 22, 2, 22, obsidian);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(base1));

        let base2 = ctx.createVoxel(ctx.centerX, 5, ctx.centerZ, 16, 2, 16, concrete);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(base2));

        // === OBELISCO PRINCIPAL ===
        let towerHeight = 50;
        let tower = ctx.createVoxel(ctx.centerX, 5 + (towerHeight / 2), ctx.centerZ, 6, towerHeight, 6, obsidian);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(tower));

        // === VEIAS DE ENERGIA ===
        for (let i = 0; i < 4; i++) {
            let angle = (i * Math.PI) / 2;
            let offsetX = Math.cos(angle) * 2.5;
            let offsetZ = Math.sin(angle) * 2.5;
            let vein = ctx.createVoxel(ctx.centerX + offsetX, 5 + (towerHeight / 2), ctx.centerZ + offsetZ, 0.5, towerHeight, 0.5, energyCyan);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(vein));
        }

        // === ANÉIS ORBITAIS ===
        let ring1_y = 15;
        ctx.createVoxel(ctx.centerX + 6, ring1_y, ctx.centerZ, 12, 0.5, 0.5, energyCyan);
        ctx.createVoxel(ctx.centerX - 6, ring1_y, ctx.centerZ, 12, 0.5, 0.5, energyCyan);
        ctx.createVoxel(ctx.centerX, ring1_y, ctx.centerZ + 6, 0.5, 0.5, 12, energyCyan);
        ctx.createVoxel(ctx.centerX, ring1_y, ctx.centerZ - 6, 0.5, 0.5, 12, energyCyan);

        let ring2_y = 30;
        ctx.createVoxel(ctx.centerX + 8, ring2_y, ctx.centerZ + 8, 0.5, 0.5, 16, energyGold);
        ctx.createVoxel(ctx.centerX - 8, ring2_y, ctx.centerZ - 8, 0.5, 0.5, 16, energyGold);
        ctx.createVoxel(ctx.centerX + 8, ring2_y, ctx.centerZ - 8, 16, 0.5, 0.5, energyGold);
        ctx.createVoxel(ctx.centerX - 8, ring2_y, ctx.centerZ + 8, 16, 0.5, 0.5, energyGold);

        // === NÚCLEO QUÂNTICO (Topo) ===
        let core = ctx.createVoxel(ctx.centerX, 5 + towerHeight + 3, ctx.centerZ, 6, 6, 6, energyGold);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(core));

        // Detalhes flutuantes
        ctx.createVoxel(ctx.centerX + 5, 5 + towerHeight + 1, ctx.centerZ, 1, 1, 1, neonPink);
        ctx.createVoxel(ctx.centerX - 5, 5 + towerHeight + 5, ctx.centerZ, 1, 1, 1, neonPink);
        ctx.createVoxel(ctx.centerX, 5 + towerHeight + 2, ctx.centerZ + 5, 1, 1, 1, neonPink);

        // === PORTÃO DE ENERGIA (Entrada) ===
        ctx.createVoxel(ctx.centerX, 4, ctx.centerZ + 3.5, 3, 4, 0.5, energyCyan);

        // ==============================================================
        // === LETREIRO DA TORRE "GLM 5.1"                           ===
        // ==============================================================
        let signBaseX = ctx.centerX + 4;
        let textX = ctx.centerX + 5;
        let baseY = 26;

        let panel = ctx.createVoxel(signBaseX, baseY + 2, ctx.centerZ, 0.5, 7, 22, signMaterial);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(panel));

        ctx.createVoxel(signBaseX, baseY + 5.5, ctx.centerZ, 0.5, 1, 24, frameMaterial);
        ctx.createVoxel(signBaseX, baseY - 1.5, ctx.centerZ, 0.5, 1, 24, frameMaterial);
        ctx.createVoxel(signBaseX, baseY + 2, ctx.centerZ + 11.5, 0.5, 7, 1, frameMaterial);
        ctx.createVoxel(signBaseX, baseY + 2, ctx.centerZ - 11.5, 0.5, 7, 1, frameMaterial);

        // G (Torre)
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ + 9, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ + 8, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ + 7, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ + 9, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ + 9, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ + 7, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ + 9, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ + 7, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 9, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 8, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 7, 1, 1, 1, energyCyan);

        // L (Torre)
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ + 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ + 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ + 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ + 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 4, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 3, 1, 1, 1, energyCyan);

        // M (Torre)
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 1, 1, 1, 1, energyCyan);

        // 5 (Torre)
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ - 4, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ - 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ - 6, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ - 4, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ - 4, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ - 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ - 6, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ - 6, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 4, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 5, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 6, 1, 1, 1, energyCyan);

        // . (Torre)
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 8, 1, 1, 1, energyCyan);

        // 1 (Torre)
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ - 9, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 4, ctx.centerZ - 10, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 3, ctx.centerZ - 10, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 2, ctx.centerZ - 10, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 1, ctx.centerZ - 10, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 10, 1, 1, 1, energyCyan);
        ctx.createVoxel(textX, baseY + 0, ctx.centerZ - 9, 1, 1, 1, energyCyan);


        // ==============================================================
        // === PLACA DE CHÃO "GLM 5.1" (Fácil e Sem Espelhamento!)   ===
        // ==============================================================

        // Placa no chão (na frente da entrada, para quem vem do sul/centro ler)
        let floorX = ctx.centerX;
        let floorY = 0.25; // Levemente acima do chão para não flickar
        let floorZ = ctx.centerZ + 10; // Perto da calçada

        ctx.createVoxel(floorX, floorY, floorZ, 24, 0.5, 5, floorSignMaterial);

        // Texto no chão (Eixo X = Largura, Eixo Z = Altura da Letra)
        // Lendo de Sul para Norte (Olhando para -Z):
        // Topo da letra = Z+1, Base da letra = Z-1
        // Esquerda = X-, Direita = X+
        let textY = 0.75;

        // G
        ctx.createVoxel(floorX - 10, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 9, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 8, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 10, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 8, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 10, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 9, textY, floorZ - 1, 1, 1, 1, energyCyan);

        // L
        ctx.createVoxel(floorX - 6, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 6, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 6, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 5, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 4, textY, floorZ - 1, 1, 1, 1, energyCyan);

        // M
        ctx.createVoxel(floorX - 2, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 1, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 0, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 2, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 0, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX - 2, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 0, textY, floorZ - 1, 1, 1, 1, energyCyan);

        // 5
        ctx.createVoxel(floorX + 2, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 3, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 4, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 2, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 2, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 3, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 4, textY, floorZ - 1, 1, 1, 1, energyCyan);

        // .
        ctx.createVoxel(floorX + 6, textY, floorZ - 1, 1, 1, 1, energyCyan);

        // 1
        ctx.createVoxel(floorX + 9, textY, floorZ + 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 9, textY, floorZ + 0, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 9, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 8, textY, floorZ - 1, 1, 1, 1, energyCyan);
        ctx.createVoxel(floorX + 10, textY, floorZ - 1, 1, 1, 1, energyCyan);

        renderStandardSign('O Motor da Realidade', 'GLM 5.1');
    };
})();
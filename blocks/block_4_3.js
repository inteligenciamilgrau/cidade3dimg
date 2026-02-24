// blocks/block_4_3.js
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['4_3'] = function(ctx) {

        // === CONFIGURAÇÕES ===
        const cx = ctx.centerX;
        const cz = ctx.centerZ;
        
        // Cores
        const C_COPPER = 0x43B3AE; 
        const C_STONE = 0x888888;
        const C_GOLD = 0xFFD700;
        const C_FIRE = 0xFF4500;

        // === FUNÇÕES ===
        function createSolid(x, y, z, w, h, d, color, matType = 'Lambert') {
            let mat;
            if (matType === 'Basic') mat = new ctx.THREE.MeshBasicMaterial({ color: color });
            else mat = new ctx.THREE.MeshLambertMaterial({ color: color });
            
            const mesh = ctx.createVoxel(x, y, z, w, h, d, mat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(mesh));
            return mesh;
        }

        // === 1. ELEVADOR AUTOMÁTICO ===
        function initElevator() {
            const elMat = new ctx.THREE.MeshLambertMaterial({ color: C_GOLD });
            // Altura 0.2 (Tapete flutuante)
            const platform = ctx.createVoxel(cx, 2, cz, 3.8, 0.2, 3.8, elMat);
            const elBox = new ctx.THREE.Box3().setFromObject(platform);
            ctx.collidables.push(elBox);

            let state = 'WAIT_BOTTOM';
            let timer = 0;
            const Y_BOT = 2;
            const Y_TOP = 32.2; 

            setInterval(() => {
                if (state === 'UP') {
                    platform.position.y += 0.2;
                    if (platform.position.y >= Y_TOP) {
                        platform.position.y = Y_TOP;
                        state = 'WAIT_TOP';
                        timer = 0;
                    }
                } else if (state === 'DOWN') {
                    platform.position.y -= 0.2;
                    if (platform.position.y <= Y_BOT) {
                        platform.position.y = Y_BOT;
                        state = 'WAIT_BOTTOM';
                        timer = 0;
                    }
                } else if (state === 'WAIT_TOP') {
                    timer += 16;
                    if (timer > 5000) state = 'DOWN';
                } else if (state === 'WAIT_BOTTOM') {
                    timer += 16;
                    if (timer > 3000) state = 'UP';
                }
                
                platform.updateMatrixWorld();
                elBox.setFromObject(platform);
            }, 16);
        }

        // === 2. BASE SÓLIDA ===
        createSolid(cx, 1, cz, 28, 2, 28, C_STONE);
        
        // Paredes Grossas
        createSolid(cx, 6, cz - 8, 20, 10, 4, C_STONE); // Trás
        createSolid(cx - 8, 6, cz, 4, 10, 20, C_STONE); // Esq
        createSolid(cx + 8, 6, cz, 4, 10, 20, C_STONE); // Dir
        
        // Frente (Entrada)
        createSolid(cx - 6, 6, cz + 8, 8, 10, 4, C_STONE); 
        createSolid(cx + 6, 6, cz + 8, 8, 10, 4, C_STONE);
        createSolid(cx, 9, cz + 8, 6, 4, 4, C_STONE); 

        // === 3. CORPO ===
        const by = 22;
        createSolid(cx, by, cz - 5, 12, 24, 2, C_COPPER);
        createSolid(cx - 5, by, cz, 2, 24, 12, C_COPPER);
        createSolid(cx + 5, by, cz, 2, 24, 12, C_COPPER);
        createSolid(cx, by + 5, cz + 5, 12, 14, 2, C_COPPER);

        // === 4. CABEÇA / MIRANTE ===
        const hy = 32;
        // Piso
        createSolid(cx - 4.5, hy, cz, 4, 1, 10, C_COPPER);
        createSolid(cx + 4.5, hy, cz, 4, 1, 10, C_COPPER);
        createSolid(cx, hy, cz - 4.5, 5, 1, 4, C_COPPER);
        createSolid(cx, hy, cz + 4.5, 5, 1, 4, C_COPPER);
        
        // Colunas e Teto
        createSolid(cx - 4, hy+3, cz - 4, 1, 5, 1, C_COPPER);
        createSolid(cx + 4, hy+3, cz - 4, 1, 5, 1, C_COPPER);
        createSolid(cx - 4, hy+3, cz + 4, 1, 5, 1, C_COPPER);
        createSolid(cx + 4, hy+3, cz + 4, 1, 5, 1, C_COPPER);
        createSolid(cx, hy+6, cz, 10, 1, 10, C_COPPER);

        // Coroa
        createSolid(cx, hy+8, cz, 2, 4, 2, C_GOLD);
        createSolid(cx, hy+7, cz+3, 1, 2, 4, C_GOLD);

        // === 5. BRAÇOS ===
        createSolid(cx + 6, 28, cz, 6, 4, 4, C_COPPER); // Ombro
        createSolid(cx + 8, 32, cz, 3, 10, 3, C_COPPER); // Braço
        createSolid(cx + 8, 38, cz, 4, 2, 4, C_GOLD); // Tocha base
        createSolid(cx + 8, 41, cz, 2, 4, 2, C_FIRE, 'Basic'); // Fogo
        createSolid(cx - 6, 26, cz + 4, 4, 6, 2, C_COPPER); // Tábua

        // === 6. PLACA (CORRIGIDA) ===
        const cvs = document.createElement('canvas');
        cvs.width = 512; cvs.height = 256;
        const c2 = cvs.getContext('2d');
        
        c2.fillStyle = '#FFCC00'; c2.fillRect(0,0,512,256); // Fundo
        c2.lineWidth = 20; c2.strokeStyle = '#000000'; c2.strokeRect(0,0,512,256); // Borda
        c2.font = '900 80px Arial Black'; c2.fillStyle = '#000000';
        c2.textAlign = 'center'; c2.textBaseline = 'middle';
        c2.fillText("GEMINI", 256, 100);
        c2.fillText("3.1 PRO", 256, 190);

        const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(cvs) });

        // A Placa em si (Z = 12.6)
        const sign = ctx.createVoxel(cx + 10, 4, cz + 12.6, 6, 3, 0.2, signMat);
        sign.rotation.x = -0.2;
        sign.rotation.y = -0.4;
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(sign));

        // HASTE CORRIGIDA:
        // Movida para Z = 12.0 (ATRÁS da placa)
        // Mais fina (0.5) para não aparecer nas bordas
        createSolid(cx + 10, 2, cz + 12.0, 0.5, 4, 0.5, C_STONE);

        initElevator();
        console.log("Block 4_3: Haste movida para trás da placa.");
    };
})();
// blocks/block_2_4.js
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['2_4'] = function(ctx) {

        // === MATERIAIS ===
        const matConcrete = new ctx.THREE.MeshLambertMaterial({ color: 0xcccccc });
        const matGlass = new ctx.THREE.MeshLambertMaterial({ color: 0x88ccff });
        const matWood = new ctx.THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const matWater = new ctx.THREE.MeshLambertMaterial({ color: 0x0066ff });
        const matGreen = new ctx.THREE.MeshLambertMaterial({ color: 0x00cc00 });
        const matDark = new ctx.THREE.MeshLambertMaterial({ color: 0x333333 });
        const matFrame = new ctx.THREE.MeshLambertMaterial({ color: 0x111111 });
        const matSign = new ctx.THREE.MeshLambertMaterial({ color: 0xff6600 });
        const matText = new ctx.THREE.MeshBasicMaterial({ color: 0xffffff });

        // === HELPER PARA CRIAÇÃO ===
        function createBlock(lx, ly, lz, w, h, d, material, collide = true) {
            const absX = ctx.centerX + lx;
            const absZ = ctx.centerZ + lz;
            const mesh = ctx.createVoxel(absX, ly, absZ, w, h, d, material);
            
            if (collide) {
                ctx.collidables.push(new ctx.THREE.Box3().setFromObject(mesh));
            }
            return mesh;
        }

        // === HELPER PARA LETRAS EM VOXEL ===
        function createLetter(baseX, baseY, baseZ, letter) {
            const letters = {
                'Q': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[0,0,0,1]],
                'w': [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[0,0,0,0,0]],
                'e': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,0],[0,1,1,0]],
                'n': [[1,0,1,1],[1,1,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
                '3': [[1,1,1,0],[1,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0]],
                '5': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,1,1,0]],
                '.': [[0,0,0],[0,0,0],[0,0,1]],
                '-': [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
                'P': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
                'l': [[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
                'u': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,1]],
                's': [[0,1,1,0],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,1,1,0]]
            };
            
            const pattern = letters[letter];
            if (!pattern) return;
            
            const pixelSize = 0.35;
            const spacing = 0.4;
            
            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        // Texto NA FRENTE da placa (Z maior = mais perto da rua)
                        createBlock(
                            baseX + (col * spacing),
                            baseY - (row * spacing),
                            baseZ + 0.4,
                            pixelSize, pixelSize, 0.3,
                            matText,
                            false
                        );
                    }
                }
            }
        }

        // === CONFIGURAÇÕES DO PRÉDIO ===
        const buildingSize = 24;
        const halfSize = 12;
        const floorHeight = 4;
        const stairWellX = 9;
        const stairWellZ = 9;

        // === PISOS - DENTRO DAS PAREDES (±11) ===
        function createFloor(y) {
            // Parte Esquerda: de -11 até 8.5 (antes do vão)
            createBlock(-11, y, 0, 19.5, 1, buildingSize, matConcrete);
            // Parte Direita: após o vão (12 a 12.5)
            createBlock(12.2, y, 0, 0.5, 1, buildingSize, matConcrete);
        }

        createFloor(0.5);
        createFloor(4.5);
        createFloor(8.5);
        createBlock(0, 12.5, 0, buildingSize, 1, buildingSize, matConcrete);

        // === PAREDES - NAS BORDAS (±12) ===
        const positions = [-halfSize, halfSize];
        for (let x of positions) {
            for (let z of positions) {
                createBlock(x, 6, z, 1, 12, 1, matConcrete);
            }
        }

        // Fachada Frente (Z = +12)
        createBlock(-7, 6, 12, 10, 12, 0.5, matGlass);
        createBlock(7, 6, 12, 10, 12, 0.5, matGlass);
        createBlock(0, 2.5, 12, 4, 1, 0.5, matFrame);

        // Fachada Fundo (Z = -12)
        createBlock(0, 6, -12, buildingSize, 12, 0.5, matGlass);

        // Fachadas Laterais (X = ±12)
        createBlock(12, 6, 0, 0.5, 12, buildingSize, matGlass);
        createBlock(-12, 6, 0, 0.5, 12, buildingSize, matGlass);

        // === ESCADAS ===
        const stepW = 3;
        const stepD = 1;
        const stepH = 0.4;
        const stepsPerFloor = 10;
        const stairX = 10.5;

        for (let floor = 0; floor < 3; floor++) {
            const baseY = (floor * floorHeight) + 0.5;
            for (let i = 0; i < stepsPerFloor; i++) {
                let stepY = baseY + (i * stepH);
                let stepZ = stairWellZ - (i * stepD);
                createBlock(stairX, stepY, stepZ, stepW, stepH, stepD, matWood, true);
            }
        }

        // === PLACA "Qwen 3.5-Plus" COM TEXTO EM VOXEL ===
        const signX = 0;
        const signZ = 14;
        const signY = 3;

        // Estrutura da placa
        createBlock(signX, signY + 1.5, signZ, 12, 0.3, 0.5, matDark, true);
        createBlock(signX - 5.5, signY - 1, signZ, 0.5, 5, 0.5, matDark, true);
        createBlock(signX + 5.5, signY - 1, signZ, 0.5, 5, 0.5, matDark, true);
        
        // Fundo da placa (laranja)
        createBlock(signX, signY, signZ, 11, 2.5, 0.5, matSign, false);

        // Texto "Qwen 3.5-Plus" em voxel - NA FRENTE DA PLACA
        // Linha 1: "Qwen"
        createLetter(signX - 4.5, signY + 0.8, signZ, 'Q');
        createLetter(signX - 2.8, signY + 0.8, signZ, 'w');
        createLetter(signX - 1.3, signY + 0.8, signZ, 'e');
        createLetter(signX + 0.2, signY + 0.8, signZ, 'n');

        // Linha 2: "3.5-Plus"
        createLetter(signX - 4.5, signY - 0.5, signZ, '3');
        createLetter(signX - 3.8, signY - 0.5, signZ, '.');
        createLetter(signX - 3.4, signY - 0.5, signZ, '5');
        createLetter(signX - 2.5, signY - 0.5, signZ, '-');
        createLetter(signX - 1.5, signY - 0.5, signZ, 'P');
        createLetter(signX - 0.7, signY - 0.5, signZ, 'l');
        createLetter(signX - 0.2, signY - 0.5, signZ, 'u');
        createLetter(signX + 0.5, signY - 0.5, signZ, 's');

        // Luzes decorativas
        createBlock(signX - 5.5, signY + 1.7, signZ + 0.4, 0.3, 0.3, 0.3, matText, false);
        createBlock(signX + 5.5, signY + 1.7, signZ + 0.4, 0.3, 0.3, 0.3, matText, false);

        // === MOBILIÁRIO ===
        createBlock(-5, 1, -5, 4, 1.5, 2, matWood, true);
        createBlock(-10, 1, -10, 1.5, 3, 1.5, matGreen, false);
        createBlock(5, 1, 5, 4, 1, 2, matDark, true);
        createBlock(0, 0.6, 0, 6, 0.1, 4, new ctx.THREE.MeshLambertMaterial({color: 0xaa0000}), false);

        createBlock(-6, 5, -6, 3, 1, 4, matWood, true);
        createBlock(-4, 5, -6, 1, 1, 1, matDark, true);
        createBlock(8, 5, 8, 1, 3, 4, matConcrete, true);

        createBlock(0, 9, 0, 6, 1, 3, matWood, true);
        createBlock(0, 9, 3, 1, 1, 1, matDark, true);

        // === COBERTURA (Piscina) ===
        const roofY = 13.5;
        createBlock(0, roofY, 0, 10, 1, 10, matConcrete, true);
        createBlock(0, roofY - 0.2, 0, 8, 0.5, 8, matWater, false);
        createBlock(6, roofY, 6, 3, 1, 1, matWood, true);
        createBlock(6, roofY, -6, 3, 1, 1, matWood, true);
        createBlock(-8, roofY, -8, 2, 2, 2, matGreen, false);

        // === REGISTRO NO MINIMAPA ===
        ctx.buildings.push({
            x: ctx.centerX,
            z: ctx.centerZ,
            w: buildingSize,
            d: buildingSize,
            h: 15,
            color: 0xcccccc
        });

    };
})();
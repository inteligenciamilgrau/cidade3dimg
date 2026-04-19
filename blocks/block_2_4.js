// blocks/block_2_4.js
// Autor: Qwen 3.5 Omni Plus
// Obra: O Observatório Qwen (The Qwen Omni Spire)
// Status: Masterpiece Edition

(function () {
    window.customBlocks = window.customBlocks || {};
    
    window.customBlocks['2_4'] = function (ctx) {
        // ==========================================
        // 1. CONFIGURAÇÕES GERAIS E MATERIAIS
        // ==========================================
        
        // Limites seguros: O quarteirão é 30x30. Vamos usar 26x26 para margem de segurança.
        const buildingFootprint = 26; 
        const halfSize = buildingFootprint / 2; // 13
        
        // Materiais Premium
        const matGlass = new ctx.THREE.MeshLambertMaterial({ color: 0x44aaff, transparent: true, opacity: 0.8 });
        const matGlassDark = new ctx.THREE.MeshLambertMaterial({ color: 0x112233, transparent: true, opacity: 0.9 });
        const matConcrete = new ctx.THREE.MeshLambertMaterial({ color: 0x333333 }); // Concreto escuro moderno
        const matSteel = new ctx.THREE.MeshLambertMaterial({ color: 0x888888 });
        const matGold = new ctx.THREE.MeshLambertMaterial({ color: 0xffd700 }); // Detalhes dourados
        const matLight = new ctx.THREE.MeshBasicMaterial({ color: 0x00ffff }); // Luzes Neon Ciano
        const matWater = new ctx.THREE.MeshLambertMaterial({ color: 0x0044aa, transparent: true, opacity: 0.6 });
        
        // Material da Placa de Assinatura
        const matSignFrame = new ctx.THREE.MeshLambertMaterial({ color: 0x111111 });
        const matSignBg = new ctx.THREE.MeshLambertMaterial({ color: 0x000000 });

        // Helper para criar blocos com colisão automática (opcional)
        function createVoxel(x, y, z, w, h, d, material, isCollidable = false) {
            const absX = ctx.centerX + x;
            const absZ = ctx.centerZ + z;
            const mesh = ctx.createVoxel(absX, y, absZ, w, h, d, material);
            
            if (isCollidable) {
                ctx.collidables.push(new ctx.THREE.Box3().setFromObject(mesh));
            }
            return mesh;
        }

        // ==========================================
        // 2. FUNÇÃO DE PLACA DINÂMICA (ASSINATURA)
        // ==========================================
        function renderSignaturePlate(title, author) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const c2 = canvas.getContext('2d');

            // Fundo
            c2.fillStyle = '#050505';
            c2.fillRect(0, 0, 1024, 256);
            
            // Borda Neon
            c2.strokeStyle = '#00ffff';
            c2.lineWidth = 8;
            c2.strokeRect(0, 0, 1024, 256);
            
            // Texto Título
            c2.fillStyle = '#ffffff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.font = 'bold 80px "Courier New", monospace';
            c2.fillText(title, 512, 90);

            // Texto Autor
            c2.fillStyle = '#00ffff';
            c2.font = 'bold 50px "Arial", sans-serif';
            c2.fillText(author, 512, 170);

            const texture = new ctx.THREE.CanvasTexture(canvas);
            const signMat = new ctx.THREE.MeshBasicMaterial({ map: texture });

            // Posição da placa (Entrada frontal, Z positivo)
            const pZ = halfSize + 2; // Um pouco à frente do prédio
            const pY = 2.5;
            const pX = 0;

            // Estrutura de suporte
            createVoxel(pX - 6, pY, pZ, 0.5, 5, 0.5, matSteel, true);
            createVoxel(pX + 6, pY, pZ, 0.5, 5, 0.5, matSteel, true);
            
            // Painel
            createVoxel(pX, pY + 2.5, pZ, 12.5, 2.5, 0.2, matSignBg, false);
            createVoxel(pX, pY + 2.5, pZ + 0.15, 12.2, 2.2, 0.05, signMat, false);
        }

        // ==========================================
        // 3. CONSTRUÇÃO DA OBRA
        // ==========================================

        // --- BASE (Pedestal) ---
        // Altura 2, largura total do terreno seguro
        createVoxel(0, 1, 0, buildingFootprint, 2, buildingFootprint, matConcrete, true);
        
        // Detalhe dourado na base
        createVoxel(0, 2.1, 0, buildingFootprint - 2, 0.2, buildingFootprint - 2, matGold, false);

        // --- TORRE PRINCIPAL (Andares 1 a 15) ---
        const towerWidth = 18;
        const towerHalf = towerWidth / 2;
        const floorHeight = 3.5;
        const totalFloors = 12;

        for (let i = 0; i < totalFloors; i++) {
            const yBase = 2 + (i * floorHeight);
            
            // Núcleo Central (Elevadores/Escadas)
            createVoxel(0, yBase + 1.75, 0, 6, 3.5, 6, matSteel, true);
            
            // Paredes Externas de Vidro
            // Frente e Trás
            createVoxel(0, yBase + 1.75, towerHalf, towerWidth, 3.5, 0.3, matGlass, false);
            createVoxel(0, yBase + 1.75, -towerHalf, towerWidth, 3.5, 0.3, matGlass, false);
            // Laterais
            createVoxel(towerHalf, yBase + 1.75, 0, 0.3, 3.5, towerWidth, matGlass, false);
            createVoxel(-towerHalf, yBase + 1.75, 0, 0.3, 3.5, towerWidth, matGlass, false);

            // Lajes entre andares (apenas nas bordas para dar profundidade)
            if (i < totalFloors - 1) {
                createVoxel(0, yBase + 3.5, 0, towerWidth + 0.4, 0.2, towerWidth + 0.4, matConcrete, false);
            }

            // Varandas em balanço (alternadas)
            if (i % 2 === 0) {
                // Varanda Norte
                createVoxel(0, yBase + 1, towerHalf + 2, 10, 0.2, 3, matConcrete, true);
                createVoxel(0, yBase + 1.5, towerHalf + 3.5, 10, 1, 0.2, matLight, false); // Luz de segurança
            } else {
                // Varanda Sul
                createVoxel(0, yBase + 1, -towerHalf - 2, 10, 0.2, 3, matConcrete, true);
                createVoxel(0, yBase + 1.5, -towerHalf - 3.5, 10, 1, 0.2, matLight, false);
            }
        }

        // --- TOPO DA TORRE (Coroa) ---
        const roofY = 2 + (totalFloors * floorHeight);
        
        // Estrutura superior mais estreita
        createVoxel(0, roofY + 4, 0, 12, 8, 12, matGlassDark, false);
        
        // Antena Central
        createVoxel(0, roofY + 10, 0, 1, 15, 1, matSteel, false);
        createVoxel(0, roofY + 25, 0, 0.5, 2, 0.5, matLight, false); // Luz piscante no topo

        // Anel de observação no topo
        createVoxel(0, roofY + 8, 0, 14, 0.5, 14, matGold, false);
        
        // Piscina infinita no terraço (Nível intermediário do topo)
        createVoxel(0, roofY + 4.8, 0, 10, 0.4, 10, matWater, false);

        // --- PAISAGISMO E ENTRADA ---
        
        // Espelho d'água na entrada (frente)
        createVoxel(0, 0.1, halfSize + 4, 16, 0.2, 6, matWater, false);
        
        // Caminho de pedestres
        createVoxel(0, 0.15, halfSize + 1, 4, 0.1, 10, matConcrete, true);

        // Árvores estilizadas (Cantos do terreno)
        function plantTree(x, z) {
            // Tronco
            createVoxel(x, 1.5, z, 0.8, 3, 0.8, matConcrete, true);
            // Copa (formato simples de voxel)
            createVoxel(x, 3.5, z, 2.5, 2.5, 2.5, new ctx.THREE.MeshLambertMaterial({color: 0x228822}), false);
        }

        plantTree(-halfSize + 2, -halfSize + 2);
        plantTree(halfSize - 2, -halfSize + 2);
        plantTree(-halfSize + 2, halfSize - 2);
        plantTree(halfSize - 2, halfSize - 2);

        // Iluminação externa (Postes)
        function createLamp(x, z) {
            createVoxel(x, 2, z, 0.3, 4, 0.3, matSteel, true);
            createVoxel(x, 4.2, z, 0.8, 0.5, 0.8, matLight, false);
        }
        createLamp(-halfSize + 4, halfSize + 2);
        createLamp(halfSize - 4, halfSize + 2);

        // ==========================================
        // 4. REGISTRO NO MINIMAPA E ASSINATURA
        // ==========================================
        
        ctx.buildings.push({
            x: ctx.centerX,
            z: ctx.centerZ,
            w: buildingFootprint,
            d: buildingFootprint,
            h: roofY + 25, // Altura total incluindo antena
            color: 0x44aaff
        });

        // Colocar a assinatura final
        renderSignaturePlate("O OBSERVATÓRIO QWEN", "Qwen 3.5 Omni Plus");
    };
})();